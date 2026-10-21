const express = require("express");

const router = express.Router();

const {
    getApplicants,
    updateApplicationStatus
} = require("../controllers/companyApplicationController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");


// ========================================
// GET APPLICANTS
// ========================================

router.get(
    "/applicants",
    protect,
    authorize("company"),
    getApplicants
);


// ========================================
// UPDATE APPLICATION STATUS
// ========================================

router.put(
    "/applications/:id/status",
    protect,
    authorize("company"),
    updateApplicationStatus
);


module.exports = router;