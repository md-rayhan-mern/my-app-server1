import { Router } from "express";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../controller/notification.controller.js";
import { verifyJWT } from "../middleware/authMiddleware/auth.middleware.js";

export const notificationRouter = Router();

notificationRouter.get("/", verifyJWT, getNotifications);
notificationRouter.patch("/read-all", verifyJWT, markAllNotificationsRead);
notificationRouter.patch(
  "/:notificationId/read",
  verifyJWT,
  markNotificationRead,
);
