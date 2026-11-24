import { asyncWrapper } from "../utils/asyncWrapper/asyncWrapper.js";
import { apiResponse } from "../utils/apiRespons/apiResponse.js";
import { notificationService } from "../service/notification.service.js";

// ইউজারের নোটিফিকেশন লিস্ট দেখা
export const getNotifications = asyncWrapper(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const result = await notificationService.getUserNotifications({
    userId: req.user._id,
    page: Number(page),
    limit: Number(limit),
  });

  return res
    .status(200)
    .json(new apiResponse(200, result, "Notifications fetched successfully"));
});

// একটি নোটিফিকেশন রিড মার্ক করা
export const markNotificationRead = asyncWrapper(async (req, res) => {
  const { notificationId } = req.params;

  const notification = await notificationService.markAsRead({
    notificationId,
    userId: req.user._id,
  });

  return res
    .status(200)
    .json(new apiResponse(200, notification, "Notification marked as read"));
});

// সব নোটিফিকেশন একসাথে রিড মার্ক করা
export const markAllNotificationsRead = asyncWrapper(async (req, res) => {
  const result = await notificationService.markAllAsRead({
    userId: req.user._id,
  });

  return res
    .status(200)
    .json(new apiResponse(200, result, "All notifications marked as read"));
});
