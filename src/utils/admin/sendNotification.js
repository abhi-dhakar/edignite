import dbConnect from "@/lib/dbConnect";
import Notification from "@/models/Notification.model";

/**
 * Send notification to a single user or multiple users
 * @param {Object} options
 * @param {String|Array} options.userId - Single user ID or array of user IDs
 * @param {String} options.title - Notification title
 * @param {String} options.message - Notification message
 * @param {String} options.type - 'info', 'success', 'warning', 'error'
 * @param {String} options.link - Optional link to navigate to
 */
export async function sendNotification({
  userId,
  title,
  message,
  type = "info",
  link = null,
}) {
  try {
    await dbConnect();

    // Handle array of user IDs
    if (Array.isArray(userId)) {
      const notifications = userId.map((id) => ({
        user: id,
        title,
        message,
        type,
        link,
        isRead: false,
      }));

      await Notification.insertMany(notifications);
      return { success: true, count: notifications.length };
    }

    // Handle single user ID
    const notification = new Notification({
      user: userId,
      title,
      message,
      type,
      link,
      isRead: false,
    });

    await notification.save();
    return { success: true, notification };
  } catch (error) {
    console.error("Send Notification Error:", error);
    throw error;
  }
}
