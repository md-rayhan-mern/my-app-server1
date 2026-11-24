import { Router } from "express";
import { createPost, getNewsfeed } from "../controller/post.controller.js";
import {
  verifyJWT,
  optionalVerifyJWT,
} from "../middleware/authMiddleware/auth.middleware.js";

export const post_feed = Router();

post_feed
  .route("/")
  .post(verifyJWT, createPost) // পোস্ট তৈরি করতে লগইন বাধ্যতামূলক
  .get(optionalVerifyJWT, getNewsfeed); // ফিড দেখতে লগইন ঐচ্ছিক (Guest + Logged-in)
