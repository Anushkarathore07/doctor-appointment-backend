const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) return res.status(400).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ token, role: "admin" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Try deleting from Patients first
    let user = await Patient.findById(userId);
    if (user) {
      await Patient.findByIdAndDelete(userId);
      return res.status(200).json({ message: "Patient deleted successfully" });
    }

    // Try deleting from Doctors
    user = await Doctor.findById(userId);
    if (user) {
      await Doctor.findByIdAndDelete(userId);
      return res.status(200).json({ message: "Doctor deleted successfully" });
    }

    return res.status(404).json({ message: "User not found" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
