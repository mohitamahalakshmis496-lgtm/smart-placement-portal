const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser
} = require("../controllers/authController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");


router.post("/register", registerUser);

router.post("/login", loginUser);


// Any logged-in user
router.get("/profile", protect, (req, res) => {
    res.json({
        message: "You are authorized",
        user: req.user
    });
});


// Admin only
router.get(
    "/admin-test",
    protect,
    authorize("admin"),
    (req, res) => {
        res.json({
            message: "Welcome Admin!"
        });
    }
);


module.exports = router;