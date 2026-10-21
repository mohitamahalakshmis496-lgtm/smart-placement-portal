const express = require("express");

const router = express.Router();

const {
    createJob,
    getMyJobs,
    getCompanyProfile,
    closeJob
} = require("../controllers/companyController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");


// ========================================
// CREATE JOB
// ========================================

router.post(
    "/jobs",
    protect,
    authorize("company"),
    createJob
);


// ========================================
// GET MY JOBS
// ========================================

router.get(
    "/jobs",
    protect,
    authorize("company"),
    getMyJobs
);


// ========================================
// GET COMPANY PROFILE
// ========================================

router.get(
    "/profile",
    protect,
    authorize("company"),
    getCompanyProfile
);
router.put(
    "/jobs/:id/close",
    protect,
    authorize("company"),
    closeJob
);

module.exports = router;