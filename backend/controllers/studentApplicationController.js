const Application = require("../models/Application");

const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({
            student: req.user.id
        })
            .populate("job", "title company location package applicationDeadline")
            .populate("job.company", "name email");

        res.json({
            applications
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getMyApplications
};