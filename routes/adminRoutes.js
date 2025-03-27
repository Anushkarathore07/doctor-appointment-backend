const express = require("express");
const { loginAdmin, deleteUser } = require("../controllers/adminController");
const { authenticateUser, adminOnly } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/login", loginAdmin); // Only login, no signup for admins
router.get("/dashboard", authenticateUser, adminOnly, (req, res) => {
    res.json({ message: "Welcome to the admin dashboard", user: req.user });
});

router.delete("/delete-user/:userId", authenticateUser, adminOnly, deleteUser);

module.exports = router;
