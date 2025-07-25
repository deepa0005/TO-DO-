const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);


//for getting the current user
router.get("/me", protect, (req, res) => {
  res.status(200).json(req.user);
});

module.exports = router;
