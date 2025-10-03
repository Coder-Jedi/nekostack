// API Gateway Worker Entry Point
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return new Response("API Gateway - Coming Soon", { status: 200 });
  },
};
