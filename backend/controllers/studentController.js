const User = require("../models/User");
const Job = require("../models/Job");

// ========================================
// GET ELIGIBLE JOBS
// ========================================

const getEligibleJobs = async (req, res) => {
    try {
        const student = await User.findById(req.user.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        if (student.role !== "student") {
            return res.status(403).json({
                message: "Only students can access jobs"
            });
        }

        if (!student.approved) {
            return res.status(403).json({
                message: "Student profile is not approved by Faculty"
            });
        }

        if (!student.branch) {
            return res.status(400).json({
                message: "Student branch is missing"
            });
        }

        if (
            student.cgpa === undefined ||
            student.cgpa === null ||
            student.cgpa === ""
        ) {
            return res.status(400).json({
                message: "Student CGPA is missing"
            });
        }

        const studentCGPA = Number(student.cgpa);

        const studentBacklogs =
            student.backlogs === undefined ||
            student.backlogs === null ||
            student.backlogs === ""
                ? 0
                : Number(student.backlogs);

        if (Number.isNaN(studentCGPA)) {
            return res.status(400).json({
                message: "Student CGPA must be a number"
            });
        }

        const studentBranch = student.branch.trim();

        const escapedBranch = studentBranch.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

        const jobs = await Job.find({
    approved: true,
    closed: false,

    minimumCGPA: {
        $lte: studentCGPA
    },

    allowedBranches: {
        $elemMatch: {
            $regex: new RegExp(
                `^${escapedBranch}$`,
                "i"
            )
        }
    },

    maxBacklogs: {
        $gte: studentBacklogs
    }
})
            .populate("company", "name email")
            .sort({ createdAt: -1 });

        res.json({
            jobs
        });

    } catch (error) {
        console.error(
            "Get eligible jobs error:",
            error
        );

        res.status(500).json({
            message: error.message
        });
    }
};


// ========================================
// GET STUDENT PROFILE
// ========================================

const getStudentProfile = async (req, res) => {
    try {
        const student = await User.findOne({
            _id: req.user.id,
            role: "student"
        })
            .select("-password")
            .populate(
                "mentor",
                "name email"
            );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({
            profile: student
        });

    } catch (error) {
        console.error(
            "Get student profile error:",
            error
        );

        res.status(500).json({
            message: error.message
        });
    }
};


// ========================================
// UPDATE STUDENT PROFILE
// ========================================

const updateStudentProfile = async (req, res) => {
    try {
        const student = await User.findOne({
            _id: req.user.id,
            role: "student"
        });

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        const {
            name,
            email,
            rollNo,
            branch,
            cgpa,
            backlogs
        } = req.body;

        // ========================================
        // BASIC VALIDATION
        // ========================================

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Name is required"
            });
        }

        if (!email || !email.trim()) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        if (!rollNo || !rollNo.trim()) {
            return res.status(400).json({
                message: "Roll number is required"
            });
        }

        if (!branch || !branch.trim()) {
            return res.status(400).json({
                message: "Branch is required"
            });
        }

        // ========================================
        // CGPA VALIDATION
        // ========================================

        const numericCGPA = Number(cgpa);

        if (
            cgpa === undefined ||
            cgpa === null ||
            cgpa === "" ||
            Number.isNaN(numericCGPA) ||
            numericCGPA < 0 ||
            numericCGPA > 10
        ) {
            return res.status(400).json({
                message:
                    "CGPA must be a number between 0 and 10"
            });
        }

        // ========================================
        // BACKLOG VALIDATION
        // ========================================

        const numericBacklogs =
            backlogs === undefined ||
            backlogs === null ||
            backlogs === ""
                ? 0
                : Number(backlogs);

        if (
            Number.isNaN(numericBacklogs) ||
            numericBacklogs < 0 ||
            !Number.isInteger(numericBacklogs)
        ) {
            return res.status(400).json({
                message:
                    "Backlogs must be a non-negative whole number"
            });
        }

        // ========================================
        // EMAIL DUPLICATE CHECK
        // ========================================

        const normalizedEmail =
            email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail,
            _id: {
                $ne: student._id
            }
        });

        if (existingUser) {
            return res.status(409).json({
                message:
                    "Email is already registered to another account"
            });
        }

        // ========================================
        // UPDATE ALLOWED FIELDS
        // ========================================

        student.name = name.trim();

        student.email =
            normalizedEmail;

        student.rollNo =
            rollNo.trim();

        student.branch =
            branch.trim();

        student.cgpa =
            numericCGPA;

        student.backlogs =
            numericBacklogs;

        // ========================================
        // SAVE
        // ========================================

        await student.save();

        // ========================================
        // RETURN UPDATED PROFILE
        // ========================================

        const updatedStudent =
            await User.findById(student._id)
                .select("-password")
                .populate(
                    "mentor",
                    "name email"
                );

        res.json({
            message:
                "Profile updated successfully",
            profile: updatedStudent
        });

    } catch (error) {
        console.error(
            "Update student profile error:",
            error
        );

        // Handle MongoDB duplicate email error
        if (error.code === 11000) {
            return res.status(409).json({
                message:
                    "Email is already registered to another account"
            });
        }

        res.status(500).json({
            message: error.message
        });
    }
};


// ========================================
// EXPORT CONTROLLERS
// ========================================

module.exports = {
    getEligibleJobs,
    getStudentProfile,
    updateStudentProfile
};