require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

// ROUTES
const linksRouter = require("./routes/links");
const redirectRouter = require("./routes/redirect");
const healthRouter = require("./routes/health");

const app = express();  
const PORT = process.env.PORT || 4000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);  

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Allow access to io inside routes (req.app.get("io"))
app.set("io", io);

// ROUTES
app.use("/api/links", linksRouter);
app.use("/healthz", healthRouter);
app.use("/", redirectRouter);

// START SERVER
server.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
