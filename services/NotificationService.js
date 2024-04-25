const Notification = require('../models/Notification'); // Adjust the path as necessary

class NotificationService {
    constructor() {}

    // Store a notification in the database
    async addNotification(userId, message) {
        try {
            const notification = new Notification({
                userId,
                message
            });
            await notification.save();
            console.log(`Notification added for user ${userId}`);
        } catch (error) {
            console.error('Failed to add notification:', error);
        }
    }

    // Retrieve all notifications for a user
    async getNotifications(userId) {
        try {
            return await Notification.find({ userId: userId, read: false });
        } catch (error) {
            console.error('Failed to retrieve notifications:', error);
            return [];
        }
    }

    // Mark a notification as read
    async markAsRead(notificationId) {
        try {
            await Notification.findByIdAndUpdate(notificationId, { read: true });
            console.log(`Notification ${notificationId} marked as read`);
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    }
}

module.exports = NotificationService;
