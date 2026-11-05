import { createProgressApi } from "./progress";

interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/api/progress") {
      const { GET, POST } = createProgressApi(env.DB);
      if (request.method === "GET") return GET();
      if (request.method === "POST") return POST(request);
      return new Response("Method Not Allowed", { status: 405 });
    }
    if (["/", "/piano", "/piano/", "/piano.html"].includes(url.pathname) &&
        (request.method === "GET" || request.method === "HEAD")) {
      const assetUrl = new URL("/piano.html", url);
      const headers = new Headers(request.headers);
      for (const name of ["If-None-Match", "If-Modified-Since", "If-Match", "If-Unmodified-Since", "If-Range", "Range"]) headers.delete(name);
      const asset = await env.ASSETS.fetch(new Request(assetUrl, {method:request.method, headers}));
      const response = new Response(asset.body, asset);
      response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
      for (const name of ["ETag", "Last-Modified"]) response.headers.delete(name);
      return response;
    }
    return env.ASSETS.fetch(request);
  },
};
