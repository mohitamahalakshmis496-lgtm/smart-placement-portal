const express = require("express");

const router = express.Router();

const {
    getPendingCompanies,
    approveCompany,
    getPendingJobs,
    approveJob,
    getAnalytics
} = require("../controllers/adminController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

router.get(
    "/pending-companies",
    protect,
    authorize("admin"),
    getPendingCompanies
);

router.put(
    "/approve-company/:id",
    protect,
    authorize("admin"),
    approveCompany
);

router.get(
    "/pending-jobs",
    protect,
    authorize("admin"),
    getPendingJobs
);

router.put(
    "/approve-job/:id",
    protect,
    authorize("admin"),
    approveJob
);
router.get(
    "/analytics",
    protect,
    authorize("admin"),
    getAnalytics
);

module.exports = router;