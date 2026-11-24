import { Router } from "express";
import { toggleReaction } from "../controller/reaction.controller.js";
import { verifyJWT } from "../middleware/authMiddleware/auth.middleware.js";

export const reactionRouter = Router();

// রিঅ্যাক্ট দিতে, পরিবর্তন করতে বা তুলে নিতে লগইন বাধ্যতামূলক
reactionRouter.route("/toggle").post(verifyJWT, toggleReaction);
