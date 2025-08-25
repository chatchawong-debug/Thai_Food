// routes/homeRoutes.js - กำหนดเส้นทางสำหรับหน้าหลัก
const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
router.get("/", homeController.getHomePage);
module.exports = router;