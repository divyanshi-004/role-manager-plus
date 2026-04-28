const http = require('http');
const data = JSON.stringify({
  name: 'Test User',
  email: 'testuser12345678@example.com',
  password: 'password123'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/users/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
  },
};

const req = http.request(options, (res) => {
  console.log('status', res.statusCode);
  res.on('data', (chunk) => process.stdout.write(chunk));
});

req.on('error', console.error);
req.write(data);
req.end();