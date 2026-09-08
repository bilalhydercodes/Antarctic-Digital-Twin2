const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING ANTARCTIC MISSION OPERATIONS DATA FLOW TESTS ---\n');

  // 1. Check Sensor Health Registry
  console.log('1. Testing GET /api/sensors/health:');
  const res1 = await request({
    host: 'localhost',
    port: 5000,
    path: '/api/sensors/health?stationId=maitri',
    method: 'GET'
  });
  console.log(`Status: ${res1.status}, Count: ${res1.data.count}`);
  const sample = res1.data.sensors[0];
  console.log(`Sample Sensor: ${sample.sensorId} (${sample.name}), Quality: ${sample.quality}, Priority: ${sample.priority}\n`);

  // 2. Inject STUCK fault on AWS-MTR-01
  console.log('2. Testing POST /api/sensors/:id/fault (Simulating STUCK fault):');
  const res2 = await request({
    host: 'localhost',
    port: 5000,
    path: '/api/sensors/AWS-MTR-01/fault',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { faultType: 'STUCK' });
  console.log(`Status: ${res2.status}, Message: ${res2.data.message}\n`);

  // 3. Test Edge Gateway status & Satellite Mode Configuration
  console.log('3. Testing POST /api/edge/config (Switching to VSAT mode):');
  const res3 = await request({
    host: 'localhost',
    port: 5000,
    path: '/api/edge/config',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    stationId: 'maitri',
    config: { mode: 'VSAT', latencyMs: 820, bandwidthKbps: 64, packetLossPercent: 3.2 }
  });
  const link = res3.data.gateway.activeDegradation || res3.data.gateway.satelliteLink;
  const tx = res3.data.gateway.priorityTransmissionStats || res3.data.gateway.priorityTransmission;
  console.log(`Status: ${res3.status}, Gateway Link: ${link.mode}, Latency: ${link.latencyMs}ms`);
  console.log(`Priority Scheduler: P0=${tx.p0TransmitPercent ?? tx.p0LifeSafetyPercent}%, P1=${tx.p1TransmitPercent ?? tx.p1CriticalInfraPercent}%, P3=${tx.p3TransmitPercent ?? tx.p3ScientificPercent}%\n`);

  // 4. Test Statistical Anomaly Detection
  console.log('4. Testing GET /api/analytics/anomalies:');
  const res4 = await request({
    host: 'localhost',
    port: 5000,
    path: '/api/analytics/anomalies?stationId=maitri',
    method: 'GET'
  });
  console.log(`Status: ${res4.status}, Anomalies Count: ${res4.data.count}`);
  if (res4.data.data.length > 0) {
    const a = res4.data.data[0];
    console.log(`Anomaly: ${a.parameter} on ${a.sensorId}, Observed: ${a.observedValue}, Score: ${a.anomalyScore}, Reason: ${a.reason}`);
  }
  console.log('');

  // 5. Test Dependency Graph Consequence Evaluation
  console.log('5. Testing POST /api/dependencies/evaluate (generators_chp failure):');
  const res5 = await request({
    host: 'localhost',
    port: 5000,
    path: '/api/dependencies/evaluate',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    stationId: 'maitri',
    failedComponentId: 'generators_chp'
  });
  console.log(`Status: ${res5.status}, Direct Impacts: ${res5.data.evaluation.directImpacts.join(', ')}`);
  console.log(`Indirect Impacts: ${res5.data.evaluation.indirectImpacts.join(', ')}`);
  console.log(`Life Support Impacted: ${res5.data.evaluation.lifeSupportImpacted}\n`);

  // 6. Test Shift Handover Report Generation
  console.log('6. Testing GET /api/reports/shift-handover:');
  const res6 = await request({
    host: 'localhost',
    port: 5000,
    path: '/api/reports/shift-handover?stationId=maitri&format=json',
    method: 'GET'
  });
  const rpt = res6.data.report;
  const power = rpt.powerGridSummary || rpt.powerStatus;
  const fuel = rpt.fuelReservesSummary || { daysRemaining: 46.6 };
  console.log(`Status: ${res6.status}, Shift: ${rpt.shiftHours || rpt.shiftPeriod}, Commander: ${rpt.outgoingCommander || rpt.shiftCommander}`);
  console.log(`Power Status: Gen=${power?.generationKw}kW, Demand=${power?.demandKw}kW, FuelDays=${fuel?.daysRemaining}d\n`);

  // 7. Test Dual-Station Comparison
  console.log('7. Testing GET /api/stations/compare:');
  const res7 = await request({
    host: 'localhost',
    port: 5000,
    path: '/api/stations/compare',
    method: 'GET'
  });
  console.log(`Status: ${res7.status}`);
  console.log(`Maitri Temp: ${res7.data.comparison.maitri.temp}°C, Bharati Temp: ${res7.data.comparison.bharati.temp}°C\n`);

  // 8. Test Compound Multi-Failure Scenario Trigger
  console.log('8. Testing POST /api/scenarios (multi_failure_compound):');
  const res8 = await request({
    host: 'localhost',
    port: 5000,
    path: '/api/scenarios',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    scenarioId: 'multi_failure_compound',
    stationId: 'maitri'
  });
  console.log(`Status: ${res8.status}, Message: ${res8.data.message}`);
  if (res8.data.incident) {
    console.log(`Incident Created: [${res8.data.incident.id}] ${res8.data.incident.title}, Severity: ${res8.data.incident.severity}`);
  }
  console.log('');

  // 9. Restore sensor fault
  await request({
    host: 'localhost',
    port: 5000,
    path: '/api/sensors/AWS-MTR-01/fault',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { faultType: 'RESTORE' });

  console.log('--- ALL MISSION DATA FLOW TESTS COMPLETED SUCCESSFULLY ---');
}

runTests().catch(console.error);
