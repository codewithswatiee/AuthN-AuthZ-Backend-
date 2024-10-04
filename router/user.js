const express = require("express");
const router = express.Router();


const {login, signup} = require("../controller/Auth");
const {auth, isStudent, isAdmin} = require("../middleware/auth");


router.post("/login", login);
router.post("/signup", signup);

router.get("/test", auth, (req, res) => {
    res.json({
        success: true,
        message: "testing done!!!"
    });
})
// protected routes:
router.get("/student", isStudent, auth, (req, res) => {
    res.json({
        success: true,
        message: "Hello Student!"
    });
})

router.get("/admin", auth, isAdmin, (req, res) => {
    res.json({
        success: true,
        message: "Hello Student!"
    });
})
module.exports = router;