import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { errorHandler } from "./middleware/errorHandler";
import { logger } from "./utils/logger";
import authRouter from "./routes/auth";
import sessionsRouter from "./routes/sessions";
import activitiesRouter from "./routes/activities";
import { connectDB } from "./utils/db";
import { setupSocketIO } from "./services/socket.service"; // ⬅️ NOUVEAU

dotenv.config();

const app = express();
const httpServer = createServer(app); // ⬅️ NOUVEAU
const io = new Server(httpServer, {  // ⬅️ NOUVEAU
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.use("/auth", authRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/activities", activitiesRouter);

// Error handling
app.use(errorHandler);

// Setup WebSocket
setupSocketIO(io); // ⬅️ NOUVEAU

// Start server
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 3001;
    httpServer.listen(PORT, () => { // ⬅️ MODIFIÉ (httpServer au lieu de app)
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();