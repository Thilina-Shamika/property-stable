import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

export async function GET(req: Request, res: Response) {
  try {
    return await handler(req, res);
  } catch (error) {
    console.error('NextAuth GET error:', error);
    return new Response(JSON.stringify({ error: 'Authentication failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(req: Request, res: Response) {
  try {
    return await handler(req, res);
  } catch (error) {
    console.error('NextAuth POST error:', error);
    return new Response(JSON.stringify({ error: 'Authentication failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 