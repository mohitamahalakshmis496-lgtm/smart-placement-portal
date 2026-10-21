const express = require("express");

const router = express.Router();

const {
    getPendingStudents,
    approveStudent,
    getUnassignedStudents,
    pickStudent,
    getMyMentees
} = require("../controllers/facultyController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");


// ========================================
// GET PENDING STUDENTS
// ========================================

router.get(
    "/pending-students",
    protect,
    authorize("faculty"),
    getPendingStudents
);


// ========================================
// APPROVE STUDENT
// ========================================

router.put(
    "/approve-student/:id",
    protect,
    authorize("faculty"),
    approveStudent
);


// ========================================
// GET UNASSIGNED STUDENTS
// ========================================

router.get(
    "/unassigned-students",
    protect,
    authorize("faculty"),
    getUnassignedStudents
);


// ========================================
// PICK STUDENT
// ========================================

router.put(
    "/pick-student/:id",
    protect,
    authorize("faculty"),
    pickStudent
);


// ========================================
// GET MY MENTEES
// ========================================

router.get(
    "/my-mentees",
    protect,
    authorize("faculty"),
    getMyMentees
);


module.exports = router;