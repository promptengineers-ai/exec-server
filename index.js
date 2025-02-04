const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = process.env.PORT || 3005;

// Logging middleware: logs every incoming request with method, URL, and IP address.
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} from ${req.ip}`);
  next();
});

// Health check endpoint – responds with a simple status message.
app.get('/health', (req, res) => {
  console.log(`[${new Date().toISOString()}] Health check endpoint was accessed.`);
  res.status(200).send('Server is up and running');
});

// Middleware to parse JSON bodies in POST requests.
app.use(express.json());

// POST /exec endpoint – expects a JSON body: { "cmd": "your-command" }
app.post('/exec', (req, res) => {
  const cmd = req.body.cmd;
  console.log(`[${new Date().toISOString()}] /exec called with command: ${cmd}`);

  if (!cmd) {
    console.error(`[${new Date().toISOString()}] Error: Missing "cmd" in request body.`);
    return res.status(400).send('Error: Missing "cmd" in request body.');
  }

  // WARNING: Executing shell commands from a web endpoint is very dangerous!
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`[${new Date().toISOString()}] Execution error: ${stderr || error.message}`);
      return res.status(500).send(`Execution error:\n${stderr || error.message}`);
    }
    console.log(`[${new Date().toISOString()}] Command executed successfully. Output: ${stdout}`);
    res.type('text/plain').send(stdout);
  });
});

// Bind to all network interfaces so that the server is accessible from the host (and externally)
app.listen(port, '0.0.0.0', () => {
  console.log(`[${new Date().toISOString()}] Express server is listening on port ${port}`);
});
