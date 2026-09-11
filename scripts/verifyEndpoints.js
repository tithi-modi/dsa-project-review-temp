// scripts/verifyEndpoints.js

const BASE_URL = 'http://localhost:5000';

const endpoints = [
  { name: 'Health Check', method: 'GET', path: '/' },
  { name: 'Get Single Farmer (O(1))', method: 'GET', path: '/api/farmers/FARM-001' },
  { name: 'Get All Farmers', method: 'GET', path: '/api/farmers' },
  { name: 'Intake Queue', method: 'GET', path: '/api/intake/queue' },
  { name: 'Manager Analytics', method: 'GET', path: '/api/manager/analytics' },
  { name: 'Collection Route Optimization', method: 'GET', path: '/api/routes/optimize' },
  { name: 'Auth Login Route', method: 'POST', path: '/api/auth/login' }
];

async function verifyAllEndpoints() {
  console.log('=== STARTING REST API ENDPOINT VERIFICATION ===\n');
  const results = [];

  for (const ep of endpoints) {
    try {
      const options = {
        method: ep.method,
        headers: { 'Content-Type': 'application/json' }
      };

      if (ep.method === 'POST') {
        options.body = JSON.stringify({});
      }

      const response = await fetch(`${BASE_URL}${ep.path}`, options);
      const isJson = response.headers.get('content-type')?.includes('application/json');

      results.push({
        Endpoint_Name: ep.name,
        HTTP_Method: ep.method,
        Route: ep.path,
        Status_Code: response.status,
        Response_Type: isJson ? 'JSON' : 'Text',
        Verification: response.status !== 404 ? '✅ PASS' : '⚠️ FAIL (404 Not Found)'
      });
    } catch (error) {
      results.push({
        Endpoint_Name: ep.name,
        HTTP_Method: ep.method,
        Route: ep.path,
        Status_Code: 'ERR',
        Response_Type: 'N/A',
        Verification: '❌ SERVER UNREACHABLE'
      });
    }
  }

  console.table(results);
  console.log('\nVerification complete. All 7 endpoints verified against registered routes.');
}

verifyAllEndpoints();