const Job = require("../models/Job");
const User = require("../models/User");

// ========================================
// CREATE JOB
// ========================================

const createJob = async (req, res) => {
    try {
        const company = await User.findOne({
            _id: req.user.id,
            role: "company"
        });

        if (!company) {
            return res.status(404).json({
                message: "Company not found"
            });
        }

        if (!company.approved) {
            return res.status(403).json({
                message: "Company is not approved by Admin"
            });
        }

        const {
            title,
            description,
            location,
            package: salaryPackage,
            minimumCGPA,
            allowedBranches,
            maxBacklogs,
            applicationDeadline
        } = req.body;

        if (
            !title ||
            !description ||
            !location ||
            salaryPackage === undefined ||
            minimumCGPA === undefined ||
            !allowedBranches ||
            !applicationDeadline
        ) {
            return res.status(400).json({
                message: "Please provide all required job details"
            });
        }

        const job = await Job.create({
            company: company._id,
            title: title.trim(),
            description: description.trim(),
            location: location.trim(),
            package: Number(salaryPackage),
            minimumCGPA: Number(minimumCGPA),
            allowedBranches,
            maxBacklogs:
                maxBacklogs === undefined ||
                maxBacklogs === ""
                    ? 0
                    : Number(maxBacklogs),
            applicationDeadline
        });

        res.status(201).json({
            message: "Job created successfully. Waiting for Admin approval.",
            job
        });

    } catch (error) {
        console.error("Create job error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};


// ========================================
// GET MY JOBS
// ========================================

const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({
            company: req.user.id
        })
            .sort({ createdAt: -1 });

        res.json({
            jobs
        });

    } catch (error) {
        console.error("Get company jobs error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};


// ========================================
// GET COMPANY PROFILE
// ========================================

const getCompanyProfile = async (req, res) => {
    try {
        const company = await User.findOne({
            _id: req.user.id,
            role: "company"
        })
            .select("-password")
            .populate("mentor", "name email");

        if (!company) {
            return res.status(404).json({
                message: "Company not found"
            });
        }

        res.json({
            profile: company
        });

    } catch (error) {
        console.error("Get company profile error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};
// ========================================
// CLOSE JOB
// ========================================
const closeJob = async (req, res) => {
    try {
        const job = await Job.findOne({
            _id: req.params.id,
            company: req.user.id
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found or you are not authorized"
            });
        }

        if (job.closed) {
            return res.status(400).json({
                message: "Job is already closed"
            });
        }

        job.closed = true;

        await job.save();

        res.json({
            message: "Job closed successfully",
            job
        });
    } catch (error) {
        console.error("Close job error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    createJob,
    getMyJobs,
    getCompanyProfile,
    closeJob
};
