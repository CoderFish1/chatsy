import mongoose from "mongoose";

const userModel = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      required: true,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/8/83/Default-Icon.jpg",
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userModel);

export default User;
