const express = require("express");
const { signupDoctor, loginDoctor } = require("../controllers/doctorController");
const { authenticateUser, doctorOnly } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/signup", signupDoctor);
router.post("/login", loginDoctor);
router.get("/dashboard", authenticateUser, doctorOnly, (req, res) => {
    res.json({ message: "Welcome to the doctor dashboard", user: req.user });
});
module.exports = router;
