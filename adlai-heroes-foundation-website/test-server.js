const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <html>
      <head><title>Test Server</title></head>
      <body>
        <h1>🎉 Server is Working!</h1>
        <p>Your development environment is fine.</p>
        <p>Node version: ${process.version}</p>
        <p>Time: ${new Date().toLocaleString()}</p>
      </body>
    </html>
  `);
});

const PORT = 3002;
server.listen(PORT, () => {
  console.log(`✅ Test server running at http://localhost:${PORT}`);
});