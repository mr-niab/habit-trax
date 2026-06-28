/**
 * POST /api/weekly-review  { weekData: [...] }
 * Calls Claude to generate a personalized weekly insight. Caches result until next Monday.
 * Requires ANTHROPIC_API_KEY env var.
 */
import { getStore } from '@netlify/blobs';

export default async (req) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  const { weekData } = await req.json();
  if (!weekData || weekData.length === 0) {
    return Response.json({ review: null });
  }

  // Don't fabricate a review when nothing has actually been logged this week.
  const hasData = weekData.some(d =>
    (d.a || 0) > 0 || d.b || d.f || d.nb || d.ns || d.s || d.feel != null ||
    Object.keys(d).some(k => k.startsWith('custom_') && d[k])
  );
  if (!hasData) {
    return Response.json({ review: null });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ review: 'Set ANTHROPIC_API_KEY in Netlify environment variables to enable AI reviews.' });
  }

  // Format summary for Claude
  const totalAct = weekData.reduce((s, d) => s + (d.a || 0), 0);
  const scores = {
    breakfast:  weekData.filter(d => d.b).length,
    fruitVeg:   weekData.filter(d => d.f).length,
    activity:   weekData.filter(d => d.a >= 30).length,
    noFood3h:   weekData.filter(d => d.nb).length,
    noNightSnk: weekData.filter(d => d.ns).length,
    brokeUpSit: weekData.filter(d => d.s).length,
  };
  const feelVals = weekData.map(d => d.feel).filter(v => typeof v === 'number');
  const feelAvg  = feelVals.length
    ? Math.round((feelVals.reduce((a, b) => a + b, 0) / feelVals.length) * 10) / 10
    : null;

  const prompt = `You are a warm, practical health coach. Based on this week's habit data, write a short personalized weekly review (3 short paragraphs, plain text, no markdown, no bullet points). Focus on patterns, what's working, how the habits relate to how the person felt (a daily 1–5 self-rating where 5 is really good), and one specific actionable suggestion for next week. Keep it encouraging, not clinical. Only reference data that is present.

Week summary:
- Morning eating habit met (breakfast eaten or fasting window held): ${scores.breakfast}/7 days
- Fruit/veg with meals (≥2 servings): ${scores.fruitVeg}/7 days
- 30+ min activity: ${scores.activity}/7 days (${totalAct} min total; goal is 150 min)
- No food 3h before bed: ${scores.noFood3h}/7 days
- No night snacking: ${scores.noNightSnk}/7 days
- Broke up sitting: ${scores.brokeUpSit}/7 days
- How they felt (daily 1–5): ${feelAvg != null ? `${feelAvg}/5 average` : 'not enough ratings logged'}

Daily detail: ${weekData.map(d => `${d.d}: activity=${d.a}min, morningEating=${d.b}, fruit/veg=${d.f}, no3hFood=${d.nb}, noSnk=${d.ns}, brokeUp=${d.s}, feeling=${d.feel != null ? d.feel : 'n/a'}`).join('; ')}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    return Response.json({ review: 'Could not generate review right now. Try again later.' });
  }

  const data   = await response.json();
  const review = data.content?.[0]?.text || '';

  // Cache until next Monday
  const store    = getStore('reviews');
  const mon      = getMondayKey();
  await store.set(mon, review);

  return Response.json({ review });
};

function getMondayKey() {
  const t  = new Date();
  const wd = t.getDay();
  const d  = new Date(t);
  d.setDate(t.getDate() - (wd === 0 ? 6 : wd - 1));
  return d.toISOString().slice(0, 10);
}

export const config = { path: '/api/weekly-review' };
