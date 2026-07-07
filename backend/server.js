import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import dns from "node:dns"; // <--: Import DNS module(nodejs inbuilt dns manager)

// Force Google DNS to bypass ISP blocking
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import { chats } from "./data/data.js";
import connectDB from "./config/db.js";
import colors from "colors";
import userRoutes from "./routes/userRoutes.js"
import chatRoutes from "./routes/chatRoutes.js"
import messageRoutes from "./routes/messageRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

 
const app = express();

app.use(cors());
   
connectDB();

app.use(express.json()) // middleware to accept json data

app.get("/", (req, res) => {
  res.send("API is Running");
});

// app.get("/api/chat", (req, res) => {
//   res.send(chats); 
// });

// app.get("/api/chat/:id", (req, res) => {
//   // console.log(req.params.id)
//   const singleChat = chats.find((c) => c._id === req.params.id);
//   res.send(singleChat);
// });

app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on PORT ${PORT}`.yellow.bold));
