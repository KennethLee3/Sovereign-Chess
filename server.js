const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

// Serve static files from "public"
app.use(express.static("public"));
app.use(express.json()); // parse JSON POST requests

// API endpoint to process a move
app.post("/move", (req, res) => {
  const { from, to } = req.body;

  // Just a mock response for now
  const engineMove = "e7e5";
  console.log(`Player moved ${from} to ${to}, engine replies ${engineMove}`);

  res.json({
    valid: true,
    engineMove
  });
});

// Start server
const server = app.listen(port, () =>
  console.log(`Sovereign Chess backend listening on port ${port}!`)
);
server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
