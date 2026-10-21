const express = require("express");

const router = express.Router();

const {
    getEligibleJobs,
    getStudentProfile,
    updateStudentProfile
} = require("../controllers/studentController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

// Get eligible jobs
router.get(
    "/jobs",
    protect,
    authorize("student"),
    getEligibleJobs
);

// Get student profile
router.get(
    "/profile",
    protect,
    authorize("student"),
    getStudentProfile
);

// Update student profile
router.put(
    "/profile",
    protect,
    authorize("student"),
    updateStudentProfile
);

module.exports = router;