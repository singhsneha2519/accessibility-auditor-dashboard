const BASE_URL = 'https://accessibility-auditor-cloud.onrender.com'; // replace with your real Render URL

export async function scanUrl(url) {
  const response = await fetch(`${BASE_URL}/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  });
  const data = await response.json();
  return { ok: response.ok, data };
}

// Placeholder — wire this up once your AI teammate's endpoint is live
export async function getAllScans() {
  const response = await fetch(`${BASE_URL}/scans`);
  const data = await response.json();
  return { ok: response.ok, data };
}

const AI_BASE_URL = 'https://violations.onrender.com'; // paste her real URL, no trailing slash

export async function explainViolations(siteUrl) {
  const response = await fetch(
    `${AI_BASE_URL}/summarize-url?url=${encodeURIComponent(siteUrl)}`,
    { cache: 'no-store' }
  );
  const text = await response.text();
  return { ok: response.ok, text };
}

const DS_BASE_URL = 'https://accessibility-auditor-ds.onrender.com';

export async function getInsights() {
  const response = await fetch(`${DS_BASE_URL}/insights`, { cache: 'no-store' });
  const data = await response.json();
  return { ok: response.ok, data };
}