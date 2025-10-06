import { auth } from './auth';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:5173',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie, better-auth.session_token',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400', // 24 hours
};

const server = Bun.serve({
  port: 3000,
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }
    
    if (url.pathname.startsWith('/api/auth')) {
      const authResponse = await auth.handler(request);
      
      const headers = new Headers(authResponse.headers);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        headers.set(key, value);
      });
      
      return new Response(authResponse.body, {
        status: authResponse.status,
        headers,
      });
    }
    
    if (url.pathname === '/') {
      return new Response(
        JSON.stringify({
          status: 'running',
          message: 'Better Auth server is running! 🚀',
          endpoints: {
            auth: '/api/auth/*',
            health: '/',
          }
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }
    
    return new Response(
      JSON.stringify({ error: 'Not found' }),
      {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  },
});