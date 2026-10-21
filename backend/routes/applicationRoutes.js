const express = require("express");

const router = express.Router();

const {
    applyForJob
} = require("../controllers/applicationController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

router.post(
    "/apply/:jobId",
    protect,
    authorize("student"),
    applyForJob
);

module.exports = router;