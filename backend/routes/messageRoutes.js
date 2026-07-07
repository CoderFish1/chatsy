import express from "express";
import { sendMessage, allMessages } from "../controllers/messageControllers.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/");

// Route 1: Sending a new message
router.route("/").post(protect, sendMessage);

// Route 2: Fetching all messages for a single chat
router.route("/:chatId").get(protect, allMessages);

export default router;
