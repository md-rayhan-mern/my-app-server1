import { Router } from "express";
import {
  addComment,
  getPostComments,
} from "../controller/comment.controller.js";
import {
  verifyJWT,
  optionalVerifyJWT,
} from "../middleware/authMiddleware/auth.middleware.js";

export const commentRouter = Router();

// কমেন্ট বা রিপ্লাই করতে লগইন বাধ্যতামূলক
commentRouter.route("/").post(verifyJWT, addComment);
// কমেন্ট ও রিপ্লাই দেখতে লগইন ঐচ্ছিক (Guest + Logged-in)
commentRouter.route("/:postId").get(optionalVerifyJWT, getPostComments);
