import { VAPID_PUBLIC_KEY } from "./_publicConfigs";
import superjson from "superjson";
import { toast } from "sonner";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

type NativePushSubscription = { fcmToken: string; platform: string };

type CapacitorFirebaseMessaging = {
  requestPermissions: () => Promise<{ receive: string }>;
  getToken: () => Promise<{ token: string }>;
  deleteToken?: () => Promise<void>;
  addListener: (
    event: string,
    cb: (data: { token?: string }) => void,
  ) => unknown;
};

function getFirebaseMessaging(): CapacitorFirebaseMessaging | null {
  const cap = (globalThis as unknown as {
    Capacitor?: {
      isNativePlatform?: () => boolean;
      Plugins?: { FirebaseMessaging?: CapacitorFirebaseMessaging };
    };
  }).Capacitor;
  if (!cap || !cap.isNativePlatform || !cap.isNativePlatform()) return null;
  return (cap.Plugins && cap.Plugins.FirebaseMessaging) || null;
}

function getNativePlatform(): string {
  const cap = (globalThis as unknown as {
    Capacitor?: { getPlatform?: () => string };
  }).Capacitor;
  return cap && cap.getPlatform ? cap.getPlatform() : "unknown";
}

function subscribeNative(
  fm: CapacitorFirebaseMessaging,
): Promise<NativePushSubscription | null> {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (value: NativePushSubscription | null) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };
    const finishToken = (token: string | undefined) => {
      if (token) finish({ fcmToken: token, platform: getNativePlatform() });
    };
    fm.addListener("tokenReceived", (data) => finishToken(data && data.token));
    const tryGetToken = (attempt: number) => {
      fm.getToken()
        .then((result) => finishToken(result && result.token))
        .catch(() => {
          if (attempt < 5 && !settled) {
            setTimeout(() => tryGetToken(attempt + 1), 2000);
          }
        });
    };
    fm.requestPermissions()
      .then((permission) => {
        if (permission.receive !== "granted") {
          finish(null);
          return;
        }
        tryGetToken(0);
      })
      .catch(() => finish(null));
    setTimeout(() => finish(null), 20000);
  });
}

export async function subscribeToPush(): Promise<
  PushSubscriptionJSON | NativePushSubscription | null
> {
  const firebaseMessaging = getFirebaseMessaging();
  if (firebaseMessaging) {
    return subscribeNative(firebaseMessaging);
  }
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return null;
  const registration = await navigator.serviceWorker.register("/sw.js", {
    scope: "/",
  });
  if ((await Notification.requestPermission()) !== "granted") return null;
  const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
  let subscription = await registration.pushManager.getSubscription();
  if (subscription) {
    const existingKey = subscription.options?.applicationServerKey;
    const sameKey =
      !!existingKey &&
      new Uint8Array(existingKey).toString() === applicationServerKey.toString();
    if (!sameKey) {
      await subscription.unsubscribe();
      subscription = null;
    }
  }
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey as any,
    });
  }
  return subscription.toJSON();
}

const pushStateHandlers = new Set<(enabled: boolean) => void>();

function emitPushState(enabled: boolean): void {
  pushStateHandlers.forEach((handler) => handler(enabled));
}

export function onPushEnabledChange(
  handler: (enabled: boolean) => void,
): () => void {
  pushStateHandlers.add(handler);
  return () => {
    pushStateHandlers.delete(handler);
  };
}

const PUSH_OPT_IN_KEY = "endebete-push-opt-in";
const PUSH_IDENTITY_KEY = "endebete-push-identity";

function readPushLocal(key: string): string | null {
  try {
    return typeof localStorage === "undefined" ? null : localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writePushLocal(key: string, value: string | null): void {
  try {
    if (typeof localStorage === "undefined") return;
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    return;
  }
}

function subscriptionIdentity(
  sub: PushSubscriptionJSON | NativePushSubscription,
): string | null {
  return (
    (sub as PushSubscriptionJSON).endpoint ||
    (sub as NativePushSubscription).fcmToken ||
    null
  );
}

function isPushOptedIn(): boolean {
  return readPushLocal(PUSH_OPT_IN_KEY) === "1";
}

export async function enablePush(): Promise<void> {
  const subscription = await subscribeToPush();
  if (!subscription) return;

  const identity = subscriptionIdentity(subscription);
  const previousIdentity = readPushLocal(PUSH_IDENTITY_KEY);
  if (previousIdentity && previousIdentity !== identity) {
    // The subscription rotated — DELETE the OLD one (previousIdentity) from your
    // server so pushes stop failing against the dead endpoint.
    await fetch("/_api/push/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: superjson.stringify({ identity: previousIdentity }),
    }).catch(console.error);
  }

  // Save the new subscription to your server, keyed by its identity.
  await fetch("/_api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: superjson.stringify({
      subscription,
      identity: identity ?? "",
      previousIdentity: previousIdentity || undefined,
    }),
  }).catch(console.error);

  writePushLocal(PUSH_IDENTITY_KEY, identity);
  writePushLocal(PUSH_OPT_IN_KEY, "1");
  emitPushState(true);
}

export async function unsubscribeFromPush(): Promise<boolean> {
  const firebaseMessaging = getFirebaseMessaging();
  if (firebaseMessaging) {
    if (firebaseMessaging.deleteToken) {
      await firebaseMessaging.deleteToken().catch(() => {});
    }
    return true;
  }
  const registration = await navigator.serviceWorker.getRegistration("/");
  const subscription = await registration?.pushManager.getSubscription();
  if (!subscription) return false;
  return subscription.unsubscribe();
}

export async function disablePush(): Promise<void> {
  await unsubscribeFromPush();

  // Delete your stored subscription(s) from your server.
  await fetch("/_api/push/unsubscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: superjson.stringify({}),
  }).catch(console.error);

  writePushLocal(PUSH_OPT_IN_KEY, null);
  writePushLocal(PUSH_IDENTITY_KEY, null);
  emitPushState(false);
}

export type PushMessagePayload = {
  title?: string;
  body?: string;
  url?: string;
  icon?: string;
  tag?: string;
  data?: Record<string, unknown>;
  showWhenFocused?: boolean;
  badgeCount?: number;
  actions?: { action: string; title: string; icon?: string; url?: string }[];
};

// Fires whenever a push arrives while at least one app window is open. Use it to
// present the notification in-app (toast, badge, live refresh) instead of / on
// top of the OS banner. Pair with `showWhenFocused: false` on the sent payload
// to suppress the OS banner while the app is focused and handle it here.
// Returns a cleanup function that removes the listener.
export function onPushMessage(
  handler: (payload: PushMessagePayload) => void,
): () => void {
  if (!("serviceWorker" in navigator)) return () => {};
  const listener = (event: MessageEvent) => {
    const data = event.data;
    if (data && data.type === "endebete-push") {
      handler((data.payload ?? {}) as PushMessagePayload);
    }
  };
  navigator.serviceWorker.addEventListener("message", listener);
  return () => navigator.serviceWorker.removeEventListener("message", listener);
}

export type NotificationClickEvent = {
  // The clicked action button's id, or "" when the notification body was clicked.
  action: string;
  // The resolved target url (action url, or the payload's url), or null if none.
  url: string | null;
  // The payload's `data` object.
  data: Record<string, unknown>;
};

// Fires when the user clicks the notification (or one of its action buttons)
// while an app window is open. Use it to route in-app (e.g. router.push) without
// a full page reload, or to run analytics. If you handle routing here, omit
// `url` on the sent payload so the service worker doesn't also navigate.
// Returns a cleanup function that removes the listener.
export function onNotificationClick(
  handler: (event: NotificationClickEvent) => void,
): () => void {
  if (!("serviceWorker" in navigator)) return () => {};
  const listener = (event: MessageEvent) => {
    const data = event.data;
    if (data && data.type === "endebete-notificationclick") {
      handler({
        action: data.action ?? "",
        url: data.url ?? null,
        data: (data.data ?? {}) as Record<string, unknown>,
      });
    }
  };
  navigator.serviceWorker.addEventListener("message", listener);
  return () => navigator.serviceWorker.removeEventListener("message", listener);
}

export function listenToPush(): () => void {
  // 1. A push arrived while the app is open.
  const offMessage = onPushMessage((payload) => {
    toast(payload.title || "Notification", {
      description: payload.body,
    });
  });

  // 2. The user clicked a notification while the app is open.
  const offClick = onNotificationClick((event) => {
    if (event.url) {
      window.location.href = event.url;
    }
  });

  return () => {
    offMessage();
    offClick();
  };
}

async function resyncPush(): Promise<void> {
  if (!isPushOptedIn()) return;
  if (typeof Notification !== "undefined" && Notification.permission !== "granted") {
    return;
  }
  await enablePush();
}

(
  globalThis as unknown as {
    onPushSubscriptionChange?: (
      handler: (subscribed: boolean) => void,
    ) => () => void;
  }
).onPushSubscriptionChange?.((subscribed) => {
  if (!subscribed) void disablePush();
});

let pushResyncTimer: ReturnType<typeof setTimeout> | undefined;
if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible") return;
    clearTimeout(pushResyncTimer);
    pushResyncTimer = setTimeout(() => void resyncPush(), 2000);
  });
}

void resyncPush();
