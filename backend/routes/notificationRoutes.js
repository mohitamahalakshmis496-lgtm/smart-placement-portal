const express = require("express");

const router = express.Router();

const {
    getMyNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
} = require("../controllers/notificationController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");


// ========================================
// GET MY NOTIFICATIONS
// ========================================

router.get(
    "/",
    protect,
    authorize(
        "student",
        "faculty",
        "company",
        "admin"
    ),
    getMyNotifications
);


// ========================================
// MARK ONE AS READ
// ========================================

router.put(
    "/:id/read",
    protect,
    authorize(
        "student",
        "faculty",
        "company",
        "admin"
    ),
    markNotificationAsRead
);


// ========================================
// MARK ALL AS READ
// ========================================

router.put(
    "/read-all",
    protect,
    authorize(
        "student",
        "faculty",
        "company",
        "admin"
    ),
    markAllNotificationsAsRead
);


module.exports = router;