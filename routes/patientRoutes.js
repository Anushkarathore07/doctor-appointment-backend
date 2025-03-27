const express = require("express");
const { signupPatient, loginPatient } = require("../controllers/patientController");
const { authenticateUser, patientOnly } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/signup", signupPatient);
router.post("/login", loginPatient);
router.get("/dashboard", authenticateUser, patientOnly, (req, res) => {
    res.json({ message: "Welcome to the patient dashboard", user: req.user });
});

module.exports = router;
