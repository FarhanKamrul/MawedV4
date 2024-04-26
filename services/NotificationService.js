const mongoose = require('mongoose');
const Notification = require('../models/Notification');

class NotificationService {
    constructor() {}

    _ensureObjectId(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid ID format');
        }
        return new mongoose.Types.ObjectId(id);
    }

    async addNotification(userId, message) {
        try {
            userId = this._ensureObjectId(userId); // Corrected usage
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

    async getNotifications(userId) {
        try {
            userId = this._ensureObjectId(userId);
            return await Notification.find({ userId: userId, read: false });
        } catch (error) {
            console.error('Failed to retrieve notifications:', error);
            return [];
        }
    }

    async markAsRead(notificationId) {
        try {
            notificationId = this._ensureObjectId(notificationId);
            await Notification.findByIdAndUpdate(notificationId, { read: true });
            console.log(`Notification ${notificationId} marked as read`);
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    }
}

module.exports = NotificationService;
