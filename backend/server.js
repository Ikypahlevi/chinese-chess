import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { initializeDatabase } from "./src/config/database.js";
import app from "./src/app.js";
import { setupSockets } from "./src/sockets/socket.handler.js";

dotenv.config();

const frontendOrigin = (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/$/, "");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: frontendOrigin,
    credentials: true,
  },
});

// Setup WebSockets
setupSockets(io);

const PORT = process.env.PORT || 5000;

// Initialize Database and Start Server
initializeDatabase()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`CORS origin allowed: ${frontendOrigin}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server due to database initialization error:", err);
    process.exit(1);
  });
