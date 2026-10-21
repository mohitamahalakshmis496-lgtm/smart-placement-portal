require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
connectDB();
app.use(
    cors({
        origin: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());
const adminRoutes = require("./routes/adminRoutes");
const companyRoutes = require("./routes/companyRoutes");
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const companyApplicationRoutes = require("./routes/companyApplicationRoutes");
const studentApplicationRoutes = require("./routes/studentApplicationRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

app.use("/api/student", studentApplicationRoutes);
app.use("/api/company", companyApplicationRoutes);
app.use("/api/student", applicationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/faculty", facultyRoutes);

app.get("/", (req, res) => {
    res.send("Smart Placement Portal API is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


