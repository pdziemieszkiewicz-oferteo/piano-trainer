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
      return Response.redirect(new URL("/piano.html", url).toString(), 302);
    }
    return env.ASSETS.fetch(request);
  },
};
