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
    if (url.pathname === "/" || url.pathname === "/piano") {
      return new Response(null, {status:302,headers:{Location:new URL("/piano.html?v=2.1", url).toString(),"Cache-Control":"no-store, max-age=0"}});
    }
    const asset = await env.ASSETS.fetch(request);
    if (asset.headers.get("Content-Type")?.includes("text/html")) {
      const response = new Response(asset.body, asset);
      response.headers.set("Cache-Control", "no-store, max-age=0");
      return response;
    }
    return asset;
  },
};
