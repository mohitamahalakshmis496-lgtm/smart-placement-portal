const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");
const Notification = require("../models/Notification");


// ========================================
// GET COMPANY APPLICANTS
// ========================================

const getApplicants = async (req, res) => {
    try {
        // First find jobs belonging to this company
        const companyJobs = await Job.find({
            company: req.user.id
        }).select("_id");

        const jobIds = companyJobs.map((job) => job._id);

        // Find applications only for those jobs
        const applications = await Application.find({
            job: { $in: jobIds }
        })
            .populate(
                "student",
                "name email rollNo branch cgpa backlogs approved placed"
            )
            .populate(
                "job",
                "title package location applicationDeadline company"
            )
            .sort({ createdAt: -1 });

        res.json({
            applications
        });

    } catch (error) {
        console.error("Get applicants error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};


// ========================================
// UPDATE APPLICATION STATUS
// ========================================

const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "Applied",
            "Shortlisted",
            "Rejected",
            "Selected"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid application status"
            });
        }

        // Find application and populate its job
        const application = await Application.findById(
            req.params.id
        ).populate("job");

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        // Security check:
        // application must belong to a job owned by logged-in company
        if (
            !application.job ||
            application.job.company.toString() !==
                req.user.id.toString()
        ) {
            return res.status(403).json({
                message: "You are not authorized to update this application"
            });
        }

        // Store previous status
        const previousStatus = application.status;

        // Update application status
        application.status = status;

        await application.save();


        // ========================================
        // CREATE NOTIFICATION FOR STUDENT
        // ========================================

        const notificationMessages = {
            Applied: {
                title: "Application Status Updated",
                message: `Your application for "${application.job.title}" is now marked as Applied.`
            },

            Shortlisted: {
                title: "Application Shortlisted",
                message: `Good news! You have been shortlisted for "${application.job.title}".`
            },

            Rejected: {
                title: "Application Update",
                message: `Your application for "${application.job.title}" has been rejected.`
            },

            Selected: {
                title: "Congratulations! You Have Been Selected",
                message: `Congratulations! You have been selected for "${application.job.title}".`
            }
        };

        const notification = notificationMessages[status];

        // Only create notification when status actually changes
        if (
            notification &&
            previousStatus !== status
        ) {
            await Notification.create({
                recipient: application.student,
                type: "application",
                title: notification.title,
                message: notification.message,
                link: "/student/applications"
            });
        }


        // ========================================
        // UPDATE STUDENT'S PLACEMENT STATUS
        // ========================================

        const student = await User.findById(
            application.student
        );

        if (student) {

            // If selected, mark student as placed
            if (status === "Selected") {

                student.placed = true;

                await student.save();

            } else {

                // Only mark false if the student has no other
                // selected application
                const selectedApplication =
                    await Application.findOne({
                        student: student._id,
                        status: "Selected",
                        _id: { $ne: application._id }
                    });

                if (!selectedApplication) {

                    student.placed = false;

                    await student.save();

                }
            }
        }


        // ========================================
        // GET UPDATED APPLICATION
        // ========================================

        const updatedApplication =
            await Application.findById(application._id)
                .populate(
                    "student",
                    "name email rollNo branch cgpa backlogs placed"
                )
                .populate(
                    "job",
                    "title package location"
                );


        res.json({
            message: `Application ${status.toLowerCase()} successfully`,
            application: updatedApplication
        });

    } catch (error) {

        console.error(
            "Update application status error:",
            error
        );

        res.status(500).json({
            message: error.message
        });
    }
};


// ========================================
// EXPORTS
// ========================================

module.exports = {
    getApplicants,
    updateApplicationStatus
};