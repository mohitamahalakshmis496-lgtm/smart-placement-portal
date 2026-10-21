const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        location: {
            type: String,
            required: true
        },

        package: {
            type: Number,
            required: true
        },

        minimumCGPA: {
            type: Number,
            required: true
        },

        allowedBranches: {
            type: [String],
            required: true
        },

        maxBacklogs: {
            type: Number,
            default: 0
        },

        applicationDeadline: {
            type: Date,
            required: true
        },

        approved: {
            type: Boolean,
            default: false
        },
        closed: {
    type: Boolean,
    default: false
},
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Job", jobSchema);