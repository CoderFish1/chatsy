import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import expressAsyncHandler from "express-async-handler";

const protect = expressAsyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 1. Extract token from "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];

      // 2. Verify + decode the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Find user from DB and attach to req (exclude password)
      req.user = await User.findById(decoded.id).select("-password");

      next(); // 4. Pass control to the actual route handler
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export default protect;
