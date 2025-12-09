const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());           // Enable CORS for all routes
app.use(express.json());   // Parse JSON body

let lastMessage = ""; // store last posted message

// POST route to store message
app.post("/data", (req, res) => {
  const { message } = req.body; // fixed typo

  if (!message) {
    return res.status(400).json({ error: "message is required" });
  }

  lastMessage = message;
  console.log("Received Message:", message);

  res.json({ status: "saved", message });
});

// GET route to return the last message
app.get("/data", (req, res) => {
  res.json({ lastMessage });
});

app.get("/", (req, res) => res.send("Server is running"));

app.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});
