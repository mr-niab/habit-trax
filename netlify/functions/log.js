/**
 * POST /api/log  { date, logType, mealType, quality, fruitVeg, notes, timestamp }
 * Appends a meal/snack log entry to Netlify Blobs (store: "logs", key: YYYY-MM-DD).
 */
import { getStore } from '@netlify/blobs';

export default async (req) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  const body = await req.json();
  const { date } = body;
  if (!date) return new Response('Bad Request', { status: 400 });

  const store = getStore('logs');
  const raw   = await store.get(date);
  const logs  = raw ? JSON.parse(raw) : [];
  logs.push({ ...body, savedAt: new Date().toISOString() });
  await store.set(date, JSON.stringify(logs));

  return new Response(null, { status: 204 });
};

export const config = { path: '/api/log' };
