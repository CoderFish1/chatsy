import express from "express";
import { registerUser } from "../controllers/userControllers.js";
import { authUser } from "../controllers/userControllers.js";

const router = express.Router();

// router.route is another way of using this router funcationality, basically in this we chain the all the https methods(rest apis)
router.route("/signup").post(registerUser);

router.post('/login', authUser)

export default router
