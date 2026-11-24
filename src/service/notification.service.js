import { Notification } from "../schema/notification.model.js";
import { AppError } from "../utils/customAppError/customAppError.js";

class NotificationService {
  // ১. ইউজারের সব নোটিফিকেশন এবং আনরিড কাউন্ট আনা
  async getUserNotifications({ userId, page = 1, limit = 20 }) {
    const skip = (page - 1) * limit;

    const [notifications, unreadCount, totalCount] = await Promise.all([
      Notification.find({ recipient: userId })
        .populate("sender", "name avatar username")
        .populate("postId", "content media")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Notification.countDocuments({ recipient: userId, isRead: false }),
      Notification.countDocuments({ recipient: userId }),
    ]);

    return {
      notifications,
      unreadCount,
      pagination: {
        total: totalCount,
        page,
        pages: Math.ceil(totalCount / limit),
      },
    };
  }

  // ২. নির্দিষ্ট একটি নোটিফিকেশন রিড (isRead: true) করা
  async markAsRead({ notificationId, userId }) {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { $set: { isRead: true } },
      { returnDocument: "after" },
    );

    if (!notification) {
      throw new AppError("Notification not found.", 404);
    }

    return notification;
  }

  // ৩. সব আনরিড নোটিফিকেশন একসাথে রিড করা
  async markAllAsRead({ userId }) {
    const result = await Notification.updateMany(
      { recipient: userId, isRead: false },
      { $set: { isRead: true } },
    );

    return { modifiedCount: result.modifiedCount };
  }
}

export const notificationService = new NotificationService();
