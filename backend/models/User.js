const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        // ===============================
        // BASIC USER DETAILS
        // ===============================

        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true
        },

        // ===============================
        // USER ROLE
        // ===============================

        role: {
            type: String,
            enum: ["student", "faculty", "company", "admin"],
            required: true
        },

        // ===============================
        // STUDENT DETAILS
        // ===============================

        rollNo: String,

        branch: String,

        cgpa: Number,

        backlogs: {
            type: Number,
            default: 0
        },

        // ===============================
        // STUDENT APPROVAL
        // ===============================

        approved: {
            type: Boolean,
            default: false
        },
        placed: {
    type: Boolean,
    default: false
},

        // ===============================
        // FACULTY MENTOR
        // ===============================

        mentor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);