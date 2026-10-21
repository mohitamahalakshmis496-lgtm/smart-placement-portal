const User = require("../models/User");
const Notification = require("../models/Notification");

// ========================================
// GET PENDING STUDENTS
// ========================================

const getPendingStudents = async (req, res) => {
    try {
        const students = await User.find({
            role: "student",
            approved: false
        })
            .select("-password")
            .sort({ createdAt: -1 });

        res.json({
            students
        });

    } catch (error) {
        console.error("Get pending students error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};


// ========================================
// APPROVE STUDENT
// ========================================

const approveStudent = async (req, res) => {
    try {
        const student = await User.findOne({
            _id: req.params.id,
            role: "student"
        });

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        if (student.approved) {
            return res.status(400).json({
                message: "Student is already approved"
            });
        }

        student.approved = true;
        await student.save();

        // Create notification for the student
        await Notification.create({
            recipient: student._id,
            type: "approval",
            title: "Account Approved",
            message: "Your student account has been approved by Faculty.",
            link: "/student"
        });

        res.json({
            message: "Student approved successfully"
        });

    } catch (error) {
        console.error("Approve student error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};


// ========================================
// GET UNASSIGNED STUDENTS
// ========================================

const getUnassignedStudents = async (req, res) => {
    try {
        const students = await User.find({
            role: "student",
            mentor: null
        })
            .select("-password")
            .sort({ createdAt: -1 });

        res.json({
            students
        });

    } catch (error) {
        console.error("Get unassigned students error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};


// ========================================
// PICK STUDENT AS MENTEE
// ========================================

const pickStudent = async (req, res) => {
    try {
        const student = await User.findOne({
            _id: req.params.id,
            role: "student",
            mentor: null
        });

        if (!student) {
            return res.status(404).json({
                message: "Student not found or already assigned"
            });
        }

        student.mentor = req.user.id;

        await student.save();

        res.json({
            message: "Student assigned successfully",
            student: {
                id: student._id,
                name: student.name,
                mentor: student.mentor
            }
        });

    } catch (error) {
        console.error("Pick student error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};


// ========================================
// GET MY MENTEES
// ========================================

const getMyMentees = async (req, res) => {
    try {
        const mentees = await User.find({
            role: "student",
            mentor: req.user.id
        })
            .select("-password")
            .sort({ name: 1 });

        res.json({
            mentees
        });

    } catch (error) {
        console.error("Get mentees error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    getPendingStudents,
    approveStudent,
    getUnassignedStudents,
    pickStudent,
    getMyMentees
};