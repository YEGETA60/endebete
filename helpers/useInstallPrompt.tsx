import { useState, useEffect, useCallback } from "react";

// Extend the Event interface for beforeinstallprompt which is not yet fully standard in TS
export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const DISMISS_KEY = "endebete-install-dismissed";
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function useInstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOSSafari, setIsIOSSafari] = useState(false);
  const [isAndroidChrome, setIsAndroidChrome] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (typeof window !== "undefined") {
      const ua = navigator.userAgent;
      
      const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
      const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua) && !/CriOS/.test(ua) && !/FxiOS/.test(ua);
      setIsIOSSafari(isIOS && isSafari);

      const isAndroid = /Android/.test(ua);
      const isChrome = /Chrome/.test(ua) && !/Edge/.test(ua) && !/OPR/.test(ua);
      setIsAndroidChrome(isAndroid && isChrome);

      const mq = window.matchMedia("(display-mode: standalone)");
      setIsStandalone(mq.matches);
      
      const handleChange = (e: MediaQueryListEvent) => setIsStandalone(e.matches);
      mq.addEventListener("change", handleChange);

      // Check dismissal state
      const dismissedData = localStorage.getItem(DISMISS_KEY);
      if (dismissedData) {
        try {
          const { timestamp } = JSON.parse(dismissedData);
          if (Date.now() - timestamp < DISMISS_DURATION_MS) {
            setIsDismissed(true);
          } else {
            localStorage.removeItem(DISMISS_KEY);
          }
        } catch (e) {
          localStorage.removeItem(DISMISS_KEY);
        }
      }

      return () => mq.removeEventListener("change", handleChange);
    }
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setPromptEvent(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!promptEvent) return;
    
    // Show the install prompt
    await promptEvent.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await promptEvent.userChoice;
    
    // We no longer need the prompt. Clear it up.
    setPromptEvent(null);
  }, [promptEvent]);

  const dismiss = useCallback(() => {
    setIsDismissed(true);
    localStorage.setItem(DISMISS_KEY, JSON.stringify({ timestamp: Date.now() }));
  }, []);

  const isInstallable = Boolean((promptEvent || isIOSSafari) && !isDismissed && !isStandalone);

  return {
    isInstallable,
    isIOSSafari,
    isAndroidChrome,
    promptInstall,
    dismiss,
  };
}