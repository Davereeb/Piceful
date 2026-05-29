// LOCAL TESTING ONLY - not for production
import http from 'node:http';
import dotenv from 'dotenv';
dotenv.config();

import handler from './api/analyze.js';

const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', (chunk) => { body += chunk; });
  req.on('end', () => {
    req.body = body ? JSON.parse(body) : {};

    const mockRes = {
      statusCode: 200,
      status(code) { this.statusCode = code; return this; },
      json(data) {
        res.writeHead(this.statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
      },
      end() { res.writeHead(this.statusCode); res.end(); },
    };

    handler(req, mockRes);
  });
});

server.listen(3000, () => {
  console.log('Local test server running on http://localhost:3000');
});
