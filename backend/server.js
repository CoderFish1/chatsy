import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
import connectDB from "./config/db.js";
import colors from "colors";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { Server } from "socket.io";

const app = express();

const getAllowedOrigins = () => [
  "http://localhost:5173",
  process.env.CLIENT_URL, // ← the FRONTEND's URL (e.g. Vercel)
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = getAllowedOrigins();
      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials: true,
  }),
);

connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is Running");
});

app.use("/api/user", userRoutes); 
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server started on PORT ${PORT}`.yellow.bold),
);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: (origin, callback) => {
      const allowed = getAllowedOrigins();
      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log("User Setup: ", userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined room : " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  // FIX: Standardized to "new message"
  socket.on("new message", (newMessageReceived) => {
    let chat = newMessageReceived.chat;

    // FIX: Check for chat.users, not chat.user
    if (!chat || !chat.users) return console.log("chat.users not defined");

    // FIX: Removed .array (it's already an array)
    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  // FIX: Handle disconnect properly at the root connection level
  socket.on("disconnect", () => {
    console.log("User disconnected");
    // Socket.io automatically handles leaving rooms on disconnect
  });
});
