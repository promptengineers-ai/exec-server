const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies in POST requests
app.use(express.json());

// POST /exec endpoint – expects a JSON body: { "cmd": "your-command" }
app.post('/exec', (req, res) => {
  const cmd = req.body.cmd;
  if (!cmd) {
    return res.status(400).send('Error: Missing "cmd" in request body.');
  }

  // WARNING: Executing shell commands from a web endpoint is very dangerous!
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).send(`Execution error:\n${stderr || error.message}`);
    }
    res.type('text/plain').send(stdout);
  });
});

app.listen(port, () => {
  console.log(`Express server is listening on port ${port}`);
});
