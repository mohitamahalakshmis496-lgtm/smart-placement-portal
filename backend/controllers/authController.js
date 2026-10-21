const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ===============================
// REGISTER USER
// ===============================
const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role,
            rollNo,
            branch,
            cgpa,
            backlogs,
            adminCode
        } = req.body;

        // Basic validation
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message: "Name, email, password and role are required"
            });
        }

        // Validate role
        const allowedRoles = ["student", "faculty", "company", "admin"];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                message: "Invalid account type"
            });
        }

        // Admin accounts require a registration code.
        if (role === "admin" && adminCode !== process.env.ADMIN_REGISTER_CODE) {
            return res.status(403).json({
                message: "Invalid Admin registration code"
            });
        }

        // Student validation
        if (role === "student") {
            if (!rollNo || !branch || cgpa === undefined || cgpa === null) {
                return res.status(400).json({
                    message:
                        "Roll number, branch and CGPA are required for students"
                });
            }
        }

        // Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "Email is already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Base user data
        const userData = {
            name,
            email,
            password: hashedPassword,
            role,
            // Students and companies require approval.
            // Faculty and admin accounts are trusted at registration.
            approved: role === "faculty" || role === "admin"
        };

        // Add student-specific data
        if (role === "student") {
            userData.rollNo = rollNo;
            userData.branch = branch.trim();
            userData.cgpa = Number(cgpa);
            userData.backlogs =
                backlogs === undefined ||
                backlogs === ""
                    ? 0
                    : Number(backlogs);
        }

        // Create user
        const user = await User.create(userData);

        res.status(201).json({
            message: "User registered successfully",
            user
        });

    } catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};


// ===============================
// LOGIN USER
// ===============================
const loginUser = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn:
                    process.env.JWT_EXPIRES_IN || "1d"
            }
        );

        res.json({
            message: "Login successful",
            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                rollNo: user.rollNo,
                branch: user.branch,
                cgpa: user.cgpa,
                backlogs: user.backlogs,
                approved: user.approved
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};


// ===============================
// EXPORT
// ===============================
module.exports = {
    registerUser,
    loginUser
};