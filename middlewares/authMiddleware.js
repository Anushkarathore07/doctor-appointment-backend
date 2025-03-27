const jwt = require("jsonwebtoken");

// Middleware to authenticate any user (Patient, Doctor, or Admin)
exports.authenticateUser = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Store user info in request
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware to allow only Patients
exports.patientOnly = (req, res, next) => {
  if (req.user.role !== "patient") {
    return res.status(403).json({ message: "Access restricted to patients" });
  }
  next();
};

// Middleware to allow only Doctors
exports.doctorOnly = (req, res, next) => {
  if (req.user.role !== "doctor") {
    return res.status(403).json({ message: "Access restricted to doctors" });
  }
  next();
};

// Middleware to allow only Admins
exports.adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access restricted to admins" });
  }
  next();
};
