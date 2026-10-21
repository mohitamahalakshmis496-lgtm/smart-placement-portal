const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Notification = require("../models/Notification");

// ========================================
// GET PENDING COMPANIES
// ========================================
const getPendingCompanies = async (req, res) => {
    try {
        const companies = await User.find({
            role: "company",
            approved: false
        }).select("-password");

        res.json({
            companies
        });

    } catch (error) {
        console.error("Get pending companies error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};


// ========================================
// APPROVE COMPANY
// ========================================
const approveCompany = async (req, res) => {
    try {
        const company = await User.findOne({
            _id: req.params.id,
            role: "company"
        });

        if (!company) {
            return res.status(404).json({
                message: "Company not found"
            });
        }

        if (company.approved) {
            return res.json({
                message: "Company is already approved"
            });
        }

        company.approved = true;

        await company.save();

        // Create notification for company
        await Notification.create({
            recipient: company._id,
            type: "approval",
            title: "Company Account Approved",
            message: "Your company account has been approved by Admin.",
            link: "/company"
        });

        res.json({
            message: "Company approved successfully"
        });

    } catch (error) {
        console.error("Approve company error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};


// ========================================
// GET PENDING JOBS
// ========================================
const getPendingJobs = async (req, res) => {
    try {
        const jobs = await Job.find({
            approved: false
        })
            .populate("company", "name email")
            .sort({ createdAt: -1 });

        res.json({
            jobs
        });

    } catch (error) {
        console.error("Get pending jobs error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// ========================================
// APPROVE JOB
// ========================================
const approveJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        if (job.approved) {
            return res.json({
                message: "Job is already approved",
                job
            });
        }

        job.approved = true;

        await job.save();

        // Create notification for the company
        await Notification.create({
            recipient: job.company,
            type: "job",
            title: "Job Approved",
            message: `Your job posting "${job.title}" has been approved by Admin.`,
            link: "/company/jobs"
        });

        res.json({
            message: "Job approved successfully",
            job
        });

    } catch (error) {
        console.error("Approve job error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};


// ========================================
// GET ANALYTICS
// ========================================
const getAnalytics = async (req, res) => {
    try {

        const totalStudents = await User.countDocuments({
            role: "student"
        });

        const placedStudents = await User.countDocuments({
            role: "student",
            placed: true
        });

        const totalCompanies = await User.countDocuments({
            role: "company",
            approved: true
        });

        const totalJobs = await Job.countDocuments({
            approved: true
        });

        const totalApplications = await Application.countDocuments();

        const placementPercentage =
            totalStudents > 0
                ? ((placedStudents / totalStudents) * 100).toFixed(2)
                : 0;


        // ========================================
        // BRANCH-WISE STUDENT BREAKDOWN
        // ========================================

        const branchBreakdown = await User.aggregate([
            {
                $match: {
                    role: "student"
                }
            },
            {
                $group: {
                    _id: "$branch",
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    branch: "$_id",
                    count: 1
                }
            },
            {
                $sort: {
                    count: -1
                }
            }
        ]);


        res.json({
            totalStudents,
            placedStudents,
            placementPercentage: Number(placementPercentage),
            totalCompanies,
            totalJobs,
            totalApplications,
            branchBreakdown
        });

    } catch (error) {
        console.error("Analytics error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    getPendingCompanies,
    approveCompany,
    getPendingJobs,
    approveJob,
    getAnalytics
};