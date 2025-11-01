// scripts/post_requests.js
// Node script (requires Node 18+ or a fetch polyfill)
// Purpose: POST the four JSON payloads to your ngrok base URL endpoints

const BASE = 'https://13638c9e588a.ngrok-free.app';

const endpoints = [
  { path: '/planner', body: { query: 'plan trip to russia' } },
  { path: '/motivation', body: { mood: 'feeling happy' } },
  { path: '/subject', body: { subject: 'teach me javascript basics' } },
  { path: '/feedback', body: { input: 'correct the given code for(i=1; i<=1; i+){' } },
];

async function post(path, body) {
  const url = BASE + path;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    console.log(`\nPOST ${url}`);
    console.log('Status:', res.status);
    console.log('Response body:', text);
  } catch (err) {
    console.error(`Error posting to ${url}:`, err.message);
  }
}

async function main() {
  for (const e of endpoints) {
    await post(e.path, e.body);
  }
}

main().catch((err) => {
  console.error('Unhandled error:', err);
  process.exit(1);
});

/*
PowerShell examples (paste in PowerShell):

$base = 'https://13638c9e588a.ngrok-free.app'
# planner
$body = @{ query = 'plan trip to russia' }
Invoke-RestMethod -Uri ($base + '/planner') -Method Post -Body ($body | ConvertTo-Json) -ContentType 'application/json'

# motivation (corrected spelling)
$body = @{ mood = 'feeling happy' }
Invoke-RestMethod -Uri ($base + '/motivation') -Method Post -Body ($body | ConvertTo-Json) -ContentType 'application/json'

# subject
$body = @{ subject = 'teach me javascript basics' }
Invoke-RestMethod -Uri ($base + '/subject') -Method Post -Body ($body | ConvertTo-Json) -ContentType 'application/json'

# feedback (send the broken code for correction)
$body = @{ input = 'correct the given code for(i=1; i<=1; i+){' }
Invoke-RestMethod -Uri ($base + '/feedback') -Method Post -Body ($body | ConvertTo-Json) -ContentType 'application/json'
*/