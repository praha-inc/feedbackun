import type { Env } from './type/env';

export default {
  async fetch(
    _request: Request,
    _env: Env,
    _context: ExecutionContext,
  ): Promise<Response> {
    return new Response('Hello, world!');
  },
};
