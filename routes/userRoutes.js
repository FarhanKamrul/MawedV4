// In routes/userRoutes.js
const express = require('express');
const router = express.Router();
const NotificationService = require('../services/NotificationService');
const notificationService = new NotificationService();

router.get('/:userId/notifications', async (req, res) => {
    const notifications = await notificationService.getNotifications(req.params.userId);
    res.json(notifications);
});

module.exports = router;
