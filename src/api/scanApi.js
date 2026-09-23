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