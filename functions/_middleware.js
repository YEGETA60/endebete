export async function onRequest(context) {
  const response = await context.next();
  if (response.status === 404 && !context.request.url.includes('/_api/')) {
    return context.env.ASSETS.fetch(new URL('/index.html', context.request.url));
  }
  return response;
}
