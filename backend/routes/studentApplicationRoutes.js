const express = require("express");

const router = express.Router();

const {
    getMyApplications
} = require("../controllers/studentApplicationController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

router.get(
    "/applications",
    protect,
    authorize("student"),
    getMyApplications
);

module.exports = router;