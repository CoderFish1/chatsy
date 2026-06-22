import express from "express";
import {
  registerUser,
  authUser,
  allUsers,
} from "../controllers/userControllers.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/signup").post(registerUser);
router.post("/login", authUser);
router.get("/", protect, allUsers); // ← protect runs first, then allUsers(so basically when we make request protect verifies and doesnt shows us)

export default router;
