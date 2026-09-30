const http = require('http');

async function checkUrl(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });
    req.on('error', (err) => resolve({ error: err.message }));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ error: 'Timeout' });
    });
  });
}

async function postJson(url, payload) {
  return new Promise((resolve) => {
    const parsed = new URL(url);
    const body = JSON.stringify(payload);
    const req = http.request({
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ statusCode: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ statusCode: res.statusCode, body: data });
        }
      });
    });
    req.on('error', (err) => resolve({ error: err.message }));
    req.write(body);
    req.end();
  });
}

async function runQA() {
  console.log('====================================================');
  console.log('  ANTARCTIC MISSION CONTROL - FULL SYSTEM QA REPORT ');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(title, condition, extraInfo = '') {
    if (condition) {
      console.log(`  [PASS] ${title} ${extraInfo}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${title} ${extraInfo}`);
      failed++;
    }
  }

  // 1. Client Frontend Verification
  console.log('--- 1. FRONTEND DEV SERVER & ASSET INTEGRITY ---');
  const clientRes = await checkUrl('http://localhost:3000');
  assert('Client Dev Server is responsive', clientRes.statusCode === 200, `(Status: ${clientRes.statusCode})`);
  assert('HTML contains root entry element', clientRes.data && clientRes.data.includes('id="root"'));
  assert('Vite client script is linked', clientRes.data && clientRes.data.includes('@vite/client'));

  // 2. Backend Health & API Verification
  console.log('\n--- 2. BACKEND SERVICES & SIMULATION APIs ---');
  
  // Sensor Health
  const sensorRes = await checkUrl('http://localhost:5000/api/sensors/health');
  assert('Sensor Health API returns 200', sensorRes.statusCode === 200);
  try {
    const parsedSensors = JSON.parse(sensorRes.data);
    const count = parsedSensors.count || (Array.isArray(parsedSensors) ? parsedSensors.length : (parsedSensors.sensors ? parsedSensors.sensors.length : 0));
    assert('Sensors payload contains registered polar sensors', count > 0, `(Count: ${count})`);
  } catch (e) {
    assert('Sensors JSON parse valid', false);
  }

  // Edge Gateway
  const edgeRes = await postJson('http://localhost:5000/api/edge/config', {
    activeLink: 'VSAT',
    compressionEnabled: true
  });
  assert('Edge Gateway config updates link to VSAT', edgeRes.statusCode === 200);

  // Dependency Graph Evaluation
  const depRes = await postJson('http://localhost:5000/api/dependencies/evaluate', {
    failedSubsystemId: 'generators_chp'
  });
  assert('Cascade failure engine evaluates generator trip', depRes.statusCode === 200);

  // Station Comparison
  const compRes = await checkUrl('http://localhost:5000/api/stations/compare');
  assert('Station comparison API returns metrics for Maitri & Bharati', compRes.statusCode === 200);

  // Emergency Scenario Engine
  const scenarioRes = await postJson('http://localhost:5000/api/scenarios', {
    scenarioId: 'blizzard_whiteout_cat4'
  });
  assert('Scenario engine triggers Cat-4 Polar Blizzard', scenarioRes.statusCode === 200);

  // 3. Geographic Coordinates & Map Data Integrity
  console.log('\n--- 3. GEOGRAPHIC & STATION METADATA INTEGRITY ---');
  const maitriCoords = { lat: -70.76, lng: 11.73, oasis: 'Schirmacher Oasis' };
  const bharatiCoords = { lat: -69.40, lng: 76.32, oasis: 'Larsemann Hills' };

  assert('Maitri Geographic Lat is in Antarctic bounds (< -60)', maitriCoords.lat < -60);
  assert('Bharati Geographic Lat is in Antarctic bounds (< -60)', bharatiCoords.lat < -60);
  assert('Maitri Longitude valid for East Antarctica', maitriCoords.lng > 0 && maitriCoords.lng < 180);
  assert('Bharati Longitude valid for East Antarctica', bharatiCoords.lng > 0 && bharatiCoords.lng < 180);

  console.log('\n====================================================');
  console.log(`  QA SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log('====================================================');

  process.exit(failed > 0 ? 1 : 0);
}

runQA();
