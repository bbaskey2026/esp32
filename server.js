const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());           // Enable CORS for all routes
app.use(express.json());   // Parse JSON body

let lastMessage = ""; // store last posted message

// POST route to store message
app.post("/data", (req, res) => {
  const { message } = req.body;
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

// HTML interface route
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Message Server Interface</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 50px auto;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .container {
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
          color: #333;
        }
        .form-group {
          margin: 20px 0;
        }
        label {
          display: block;
          margin-bottom: 8px;
          font-weight: bold;
          color: #555;
        }
        input[type="text"] {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
          box-sizing: border-box;
        }
        button {
          padding: 10px 20px;
          margin: 5px;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .btn-send {
          background-color: #4CAF50;
          color: white;
        }
        .btn-send:hover {
          background-color: #45a049;
        }
        .btn-fetch {
          background-color: #2196F3;
          color: white;
        }
        .btn-fetch:hover {
          background-color: #0b7dda;
        }
        #console {
          margin-top: 20px;
          padding: 15px;
          background-color: #1e1e1e;
          color: #00ff00;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          min-height: 200px;
          max-height: 400px;
          overflow-y: auto;
        }
        .console-line {
          margin: 5px 0;
        }
        .timestamp {
          color: #888;
        }
        .error {
          color: #ff4444;
        }
        .success {
          color: #00ff00;
        }
        .info {
          color: #00bfff;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>📡 Message Server Interface</h1>
        
        <div class="form-group">
          <label for="messageInput">Enter Message:</label>
          <input type="text" id="messageInput" placeholder="Type your message here...">
        </div>
        
        <div>
          <button class="btn-send" onclick="sendMessage()">Send Message</button>
          <button class="btn-fetch" onclick="fetchMessage()">Fetch Last Message</button>
        </div>
        
        <div id="console">
          <div class="console-line info">Console ready. Waiting for actions...</div>
        </div>
      </div>

      <script>
        const consoleDiv = document.getElementById('console');
        
        function logToConsole(message, type = 'info') {
          const timestamp = new Date().toLocaleTimeString();
          const line = document.createElement('div');
          line.className = \`console-line \${type}\`;
          line.innerHTML = \`<span class="timestamp">[\${timestamp}]</span> \${message}\`;
          consoleDiv.appendChild(line);
          consoleDiv.scrollTop = consoleDiv.scrollHeight;
          
          // Also log to browser console
          console.log(\`[\${timestamp}] \${message}\`);
        }

        async function sendMessage() {
          const messageInput = document.getElementById('messageInput');
          const message = messageInput.value.trim();
          
          if (!message) {
            logToConsole('❌ Error: Message cannot be empty', 'error');
            return;
          }
          
          logToConsole(\`📤 Sending message: "\${message}"\`, 'info');
          
          try {
            const response = await fetch('/data', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ message })
            });
            
            const data = await response.json();
            
            if (response.ok) {
              logToConsole(\`✅ Success: Message saved - "\${data.message}"\`, 'success');
              messageInput.value = '';
            } else {
              logToConsole(\`❌ Error: \${data.error}\`, 'error');
            }
          } catch (error) {
            logToConsole(\`❌ Network Error: \${error.message}\`, 'error');
          }
        }

        async function fetchMessage() {
          logToConsole('📥 Fetching last message...', 'info');
          
          try {
            const response = await fetch('/data');
            const data = await response.json();
            
            if (data.lastMessage) {
              logToConsole(\`📨 Last Message: "\${data.lastMessage}"\`, 'success');
            } else {
              logToConsole('📭 No messages stored yet', 'info');
            }
          } catch (error) {
            logToConsole(\`❌ Network Error: \${error.message}\`, 'error');
          }
        }

        // Allow Enter key to send message
        document.getElementById('messageInput').addEventListener('keypress', function(e) {
          if (e.key === 'Enter') {
            sendMessage();
          }
        });
      </script>
    </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});
