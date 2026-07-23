const express = require("express");

const router = express.Router();

const {
    register,
    login,
    sendCode,
    verifyCode
} = require("../controllers/authController");

router.post("/verify-code", verifyCode);


router.post("/login", login);

router.post("/register", register);

router.post("/send-code", sendCode);

module.exports = router;