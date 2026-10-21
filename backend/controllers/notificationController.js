const Notification = require("../models/Notification");

// ========================================
// GET MY NOTIFICATIONS
// ========================================

const getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            recipient: req.user.id
        })
            .sort({ createdAt: -1 })
            .limit(50);

        const unreadCount = await Notification.countDocuments({
            recipient: req.user.id,
            read: false
        });

        res.json({
            notifications,
            unreadCount
        });

    } catch (error) {
        console.error(
            "Get notifications error:",
            error
        );

        res.status(500).json({
            message: error.message
        });
    }
};


// ========================================
// MARK ONE NOTIFICATION AS READ
// ========================================

const markNotificationAsRead = async (req, res) => {
    try {
        const notification =
            await Notification.findOne({
                _id: req.params.id,
                recipient: req.user.id
            });

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        notification.read = true;

        await notification.save();

        res.json({
            message: "Notification marked as read",
            notification
        });

    } catch (error) {
        console.error(
            "Mark notification read error:",
            error
        );

        res.status(500).json({
            message: error.message
        });
    }
};


// ========================================
// MARK ALL AS READ
// ========================================

const markAllNotificationsAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            {
                recipient: req.user.id,
                read: false
            },
            {
                $set: {
                    read: true
                }
            }
        );

        res.json({
            message: "All notifications marked as read"
        });

    } catch (error) {
        console.error(
            "Mark all notifications error:",
            error
        );

        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    getMyNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
};