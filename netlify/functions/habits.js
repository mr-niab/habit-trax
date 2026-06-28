/**
 * GET  /api/habits?date=YYYY-MM-DD  → { habits }
 * POST /api/habits                  { date, habits } → 204
 *
 * Stores today's habit state in Netlify Blobs (store: "habits", key: YYYY-MM-DD).
 */
import { getStore } from '@netlify/blobs';

export default async (req) => {
  const store = getStore('habits');

  if (req.method === 'GET') {
    const url    = new URL(req.url);
    const date   = url.searchParams.get('date') || today();
    const raw    = await store.get(date);
    const habits = raw ? JSON.parse(raw) : null;
    return Response.json({ habits });
  }

  if (req.method === 'POST') {
    const { date, habits } = await req.json();
    if (!date || !habits) return new Response('Bad Request', { status: 400 });
    await store.set(date, JSON.stringify(habits));
    return new Response(null, { status: 204 });
  }

  return new Response('Method Not Allowed', { status: 405 });
};

const today = () => new Date().toISOString().slice(0, 10);

export const config = { path: '/api/habits' };
