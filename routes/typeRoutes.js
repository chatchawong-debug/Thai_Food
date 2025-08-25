// routes/foodRoutes.js - กำหนดเส้นทางสำหรับหน้ารายการอาหาร
const express = require('express');
const router = express.Router();
const typeController = require('../controllers/typeController')
router.get('/',typeController.getTypePage)//method
module.exports = router;