/**
 * GET /api/weekly
 * Returns the last 7 days of habit data formatted for the weekly review screen.
 * Response: { weekData: [...], review: string | null }
 */
import { getStore } from '@netlify/blobs';

export default async (req) => {
  if (req.method !== 'GET') return new Response('Method Not Allowed', { status: 405 });

  const store   = getStore('habits');
  const today   = new Date();
  const results = [];

  // Build 7-day window ending today (Mon–Sun of current week)
  const wd  = today.getDay();
  const mon = new Date(today);
  mon.setDate(today.getDate() - (wd === 0 ? 6 : wd - 1));

  const DAYS = ['M','T','W','T','F','S','S'];

  for (let i = 0; i < 7; i++) {
    const d   = new Date(mon);
    d.setDate(mon.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    const raw = await store.get(key);
    const h   = raw ? JSON.parse(raw) : {};
    // Pass through any custom habit keys (prefixed 'custom_')
    const custom = {};
    for (const k of Object.keys(h)) {
      if (k.startsWith('custom_')) custom[k] = !!h[k];
    }
    // Daily feeling score: average of the 1–5 scores logged against habits that day.
    const feelVals = Object.values(h.emotions || {}).filter(v => typeof v === 'number' && v >= 1 && v <= 5);
    const feel = feelVals.length
      ? Math.round((feelVals.reduce((a, b) => a + b, 0) / feelVals.length) * 10) / 10
      : null;
    results.push({
      d:   DAYS[i],
      date: key,
      // Morning eating habit is met whether breakfast was eaten or a fasting window was held.
      b:  (!!h.breakfast || !!h.fasting),
      f:  (h.fruitVeg || 0) >= 2,
      a:  h.activity || 0,
      nb: !!h.noFoodBeforeBed,
      ns: !!h.noNightSnacking,
      s:  !!h.brokeUpSitting,
      feel,
      ...custom,
    });
  }

  // Check if we have a cached AI review for this week
  const reviewStore = getStore('reviews');
  const weekKey     = mon.toISOString().slice(0, 10);
  const cachedReview = await reviewStore.get(weekKey);

  return Response.json({
    weekData: results,
    review:   cachedReview || null,
  });
};

export const config = { path: '/api/weekly' };
