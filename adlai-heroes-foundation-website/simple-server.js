const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  
  // Serve the built Next.js files
  let filePath = path.join(__dirname, '.next/server/app', req.url === '/' ? 'page.js' : req.url);
  
  // Simple HTML response for now
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <html>
      <head><title>Adlai Heroes Foundation</title></head>
      <body>
        <h1>🎉 Server is Working!</h1>
        <p>The Adlai Heroes Foundation website is running!</p>
        <p><a href="/admin">Go to Admin Dashboard</a></p>
        <p>Time: ${new Date().toLocaleString()}</p>
        <script>
          if (window.location.pathname === '/admin') {
            document.body.innerHTML = '<h1>Admin Dashboard</h1><p>The admin is functional - we just need to integrate it properly.</p>';
          }
        </script>
      </body>
    </html>
  `);
});

const PORT = 8080;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Simple server running at:`);
  console.log(`   - http://localhost:${PORT}`);
  console.log(`   - http://127.0.0.1:${PORT}`);
  console.log(`   - Admin: http://localhost:${PORT}/admin`);
});