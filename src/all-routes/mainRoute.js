import { Router } from "express";
import { userCreateRouter } from "./user/userCreate.js";
import { loginRouter } from "./user/login.js";
import { post_feed } from "./post.routes.js";
import { reactionRouter } from "./reaction.route.js";
import { commentRouter } from "./comment.route.js";
import { notificationRouter } from "./notification.route.js";

export const mainRoute = Router();
const moduleRoutes = [
  {
    path: "/api/v1/",
    router: userCreateRouter,
  },
  {
    path: "/api/v1/",
    router: loginRouter,
  },
  {
    path: "/api/v1/posts",
    router: post_feed,
  },
  {
    path: "/api/v1/reactions",
    router: reactionRouter,
  },
  {
    path: "/api/v1/comments",
    router: commentRouter,
  },
  {
    path: "/api/v1/notifications",
    router: notificationRouter,
  },
];
moduleRoutes.forEach((route) => {
  mainRoute.use(route.path, route.router);
});
