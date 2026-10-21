const Application = require("../models/Application");
const Job = require("../models/Job");

// APPLY FOR A JOB
const applyForJob = async (req, res) => {
    try {
        const studentId = req.user.id;
        const jobId = req.params.jobId;

        // Check job exists and is approved
        const job = await Job.findOne({
            _id: jobId,
            approved: true
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found or not approved"
            });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            student: studentId,
            job: jobId
        });

        if (existingApplication) {
            return res.status(400).json({
                message: "Already applied for this job"
            });
        }

        // Create application
        const application = await Application.create({
            student: studentId,
            job: jobId
        });

        res.status(201).json({
            message: "Application submitted successfully",
            application
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    applyForJob
};