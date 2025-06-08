const BACKEND_URL = 'http://localhost:5000';

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

export async function sendVoice(payload) {
  const res = await fetch(`${BACKEND_URL}/analyze-voice`, {
    method: 'POST',
    headers: defaultHeaders,
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function analyzeFace(payload) {
  const res = await fetch(`${BACKEND_URL}/analyze-face`, {
    method: 'POST',
    headers: defaultHeaders,
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function analyzeText(payload) {
  const res = await fetch(`${BACKEND_URL}/analyze-text`, {
    method: 'POST',
    headers: defaultHeaders,
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function evaluateRisk(payload) {
  const res = await fetch(`${BACKEND_URL}/evaluate-risk`, {
    method: 'POST',
    headers: defaultHeaders,
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  return res.json();
}
