/**
 * POST /api/health
 * Apple Shortcuts bridge — receives activity data and merges it into today's habits.
 *
 * Body: { secret: "...", minutes: 45, steps: 6847, kcal: 380 }
 * The secret must match the HEALTH_SECRET env var set in Netlify.
 *
 * Apple Shortcut setup:
 *   1. Create a shortcut that reads "Active Energy", "Steps", "Workout Minutes" from Health
 *   2. Add a "Get Contents of URL" action:
 *        URL: https://your-site.netlify.app/api/health
 *        Method: POST
 *        Body (JSON): { "secret": "<HEALTH_SECRET>", "minutes": <workout_minutes>, "steps": <steps>, "kcal": <active_kcal> }
 *   3. Run the shortcut each evening (automate with "Time of Day" trigger)
 */
import { getStore } from '@netlify/blobs';

export default async (req) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  const body = await req.json();
  const expectedSecret = process.env.HEALTH_SECRET;

  if (expectedSecret && body.secret !== expectedSecret) {
    return new Response('Unauthorized', { status: 401 });
  }

  const date     = new Date().toISOString().slice(0, 10);
  const store    = getStore('habits');
  const raw      = await store.get(date);
  const habits   = raw ? JSON.parse(raw) : {};

  // Merge health data
  const updated = {
    ...habits,
    activity: Number(body.minutes) || 0,
    steps:    Number(body.steps)   || 0,
    kcal:     Number(body.kcal)    || 0,
  };
  await store.set(date, JSON.stringify(updated));

  return Response.json({ ok: true });
};

export const config = { path: '/api/health' };
