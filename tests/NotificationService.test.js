const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const NotificationService = require('../services/NotificationService');
const Notification = require('../models/notification'); // Assume this is your notification model file

describe('NotificationService', () => {
    let mongoServer;
    let notificationService;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

        notificationService = new NotificationService(); // Instantiate your NotificationService
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        await Notification.deleteMany({}); // Clean the database before each test
    });

    test('addNotification should save a notification', async () => {
        const userId = new mongoose.Types.ObjectId();
        const message = "Test notification message";

        await notificationService.addNotification(userId, message);

        const savedNotification = await Notification.findOne({ userId: userId });
        expect(savedNotification).not.toBeNull();
        expect(savedNotification.message).toBe(message);
    });

    test('getNotifications should retrieve only unread notifications', async () => {
        const userId = new mongoose.Types.ObjectId();
        await Notification.create({ userId, message: "First message", read: false });
        await Notification.create({ userId, message: "Second message", read: true });

        const notifications = await notificationService.getNotifications(userId);
        expect(notifications.length).toBe(1);
        expect(notifications[0].message).toBe("First message");
    });

    test('markAsRead should mark a notification as read', async () => {
        const notification = await Notification.create({ userId: new mongoose.Types.ObjectId(), message: "Some message", read: false });

        await notificationService.markAsRead(notification._id);

        const updatedNotification = await Notification.findById(notification._id);
        expect(updatedNotification.read).toBe(true);
    });
});
