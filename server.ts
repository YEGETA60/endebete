import "./loadEnv.js";
import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
import { serve } from '@hono/node-server';

const app = new Hono();

app.post('_api/auth/logout',async c => {
  try {
    const { handle } = await import("./endpoints/auth/logout_POST.js");
    let request = c.req.raw;
    const response: any = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + e.message,  500)
  }
})
app.get('_api/auth/session',async c => {
  try {
    const { handle } = await import("./endpoints/auth/session_GET.js");
    let request = c.req.raw;
    const response: any = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + e.message,  500)
  }
})
app.get('_api/host/profile',async c => {
  try {
    const { handle } = await import("./endpoints/host/profile_GET.js");
    let request = c.req.raw;
    const response: any = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + e.message,  500)
  }
})
app.get('_api/inquiries/sent',async c => {
  try {
    const { handle } = await import("./endpoints/inquiries/sent_GET.js");
    let request = c.req.raw;
    const response: any = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + e.message,  500)
  }
})
app.post('_api/photos/delete',async c => {
  try {
    const { handle } = await import("./endpoints/photos/delete_POST.js");
    let request = c.req.raw;
    const response: any = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + e.message,  500)
  }
})
app.post('_api/photos/upload',async c => {
  try {
    const { handle } = await import("./endpoints/photos/upload_POST.js");
    let request = c.req.raw;
    const response: any = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + e.message,  500)
  }
})
app.get('_api/properties/get',async c => {
  try {
    const { handle } = await import("./endpoints/properties/get_GET.js");
    let request = c.req.raw;
    const response: any = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + e.message,  500)
  }
})
app.get('_api/properties/list',async c => {
  try {
    const { handle } = await import("./endpoints/properties/list_GET.js");
    let request = c.req.raw;
    const response: any = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + e.message,  500)
  }
})
app.post('_api/inquiries/reply',async c => {
  try {
    const { handle } = await import("./endpoints/inquiries/reply_POST.js");
    let request = c.req.raw;
    const response: any = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + e.message,  500)
  }
})
app.post('_api/inquiries/create',async c => {
  try {
    const { handle } = await import("./endpoints/inquiries/create_POST.js");
    let request = c.req.raw;
    const response: any = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + e.message,  500)
  }
})
app.get('_api/inquiries/messages',async c => {
  try {
    const { handle } = await import("./endpoints/inquiries/messages_GET.js");
    let request = c.req.raw;
    const response: any = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + e.message,  500)
  }
})
app.get('_api/inquiries/received',async c => {
  try {
    const { handle } = await import("./endpoints/inquiries/received_GET.js");
    let request = c.req.raw;
    const response: any = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + e.message,  500)
  }
})
app.post('_api/properties/create',async c => {
  try {
    const { handle } = await import("./endpoints/properties/create_POST.js");
    let request = c.req.raw;
    const response: any = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + e.message,  500)
  }
})
app.post('_api/properties/delete',async c => {
  try {
    const { handle } = await import("./endpoints/properties/delete_POST.js");
    let request = c.req.raw;
    const response: any = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + e.message,  500)
  }
})
app.post('_api/properties/update',async c => {
  try {
    const { handle } = await import("./endpoints/properties/update_POST.js");
    let request = c.req.raw;
    const response: any = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + e.message,  500)
  }
})
app.post('_api/auth/update-profile',async c => {
  try {
    const { handle } = await import("./endpoints/auth/update-profile_POST.js");
    let request = c.req.raw;
    const response: any = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + e.message,  500)
  }
})
app.post('_api/auth/change-password',async c => {
  try {
    const { handle } = await import("./endpoints/auth/change-password_POST.js");
    let request = c.req.raw;
    const response: any = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + e.message,  500)
  }
})
app.get('_api/properties/availability',async c => {
  try {
    const { handle } = await import("./endpoints/properties/availability_GET.js");
    let request = c.req.raw;
    const response: any = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + e.message,  500)
  }
})
app.post('_api/auth/login_with_password',async c => {
  try {
    const { handle } = await import("./endpoints/auth/login_with_password_POST.js");
    let request = c.req.raw;
    const response: any = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + e.message,  500)
  }
})
app.post('_api/auth/register_with_password',async c => {
  try {
    const { handle } = await import("./endpoints/auth/register_with_password_POST.js");
    let request = c.req.raw;
    const response: any = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + e.message,  500)
  }
})
app.post('_api/properties/availability/block',async c => {
  try {
    const { handle } = await import("./endpoints/properties/availability/block_POST.js");
    let request = c.req.raw;
    const response: any = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + e.message,  500)
  }
})
app.post('_api/properties/availability/unblock',async c => {
  try {
    const { handle } = await import("./endpoints/properties/availability/unblock_POST.js");
    let request = c.req.raw;
    const response: any = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + e.message,  500)
  }
})
app.post('_api/push/subscribe',async c => {
  try {
    const { handle } = await import("./endpoints/push/subscribe_POST.js");
    let request = c.req.raw;
    const response: any = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + e.message,  500)
  }
})
app.post('_api/push/unsubscribe',async c => {
  try {
    const { handle } = await import("./endpoints/push/unsubscribe_POST.js");
    let request = c.req.raw;
    const response: any = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + e.message,  500)
  }
})
app.post('_api/favorites/toggle', async c => {
  try {
    const { handle } = await import("./endpoints/favorites/toggle_POST.js");
    let request = c.req.raw;
    const response: any = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + e.message, 500);
  }
})
app.get('_api/favorites/list', async c => {
  try {
    const { handle } = await import("./endpoints/favorites/list_GET.js");
    let request = c.req.raw;
    const response: any = await handle(request);
    if (!(response instanceof Response) && response.constructor.name !== "Response") {
      return c.text("Invalid response format. handle should always return a Response object." + response.constructor.name, 500);
    }
    return response;
  } catch (e) {
    console.error(e);
    return c.text("Error loading endpoint code " + e.message, 500);
  }
})
app.put('/_api/photos/upload_binary', async c => {
  try {
    const { getServerUserSession } = await import("./helpers/getServerUserSession.js");
    const { user } = await getServerUserSession(c.req.raw);
    const pathParam = c.req.query("path");
    if (!pathParam || !pathParam.startsWith(`properties/${user.id}/`)) {
      return c.text("Forbidden or invalid path", 403);
    }
    const { default: fs } = await import("fs");
    const { default: path } = await import("path");
    const targetPath = path.join(process.cwd(), "public", "uploads", pathParam);
    await fs.promises.mkdir(path.dirname(targetPath), { recursive: true });
    const buffer = Buffer.from(await c.req.arrayBuffer());
    await fs.promises.writeFile(targetPath, buffer);
    return c.json({ success: true });
  } catch (e: any) {
    console.error("Binary upload error:", e);
    return c.text("Upload failed: " + e.message, 500);
  }
});
app.use("/uploads/*", serveStatic({ root: "./public" }));
app.use("/*", serveStatic({ root: "./public" }));
app.use('/*', serveStatic({ root: './dist' }))
app.get("*", async (c, next) => {
  const p = c.req.path;
  if (p.startsWith("/_api")) {
    return next();
  }
  return serveStatic({ path: "./dist/index.html" })(c, next);
});
const port = parseInt(process.env.PORT || "3333", 10);
serve({ fetch: app.fetch, port });
console.log(`Running at http://localhost:${port}`)
