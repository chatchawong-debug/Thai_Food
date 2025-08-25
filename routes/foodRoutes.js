// routes/foodRoutes.js - กำหนดเส้นทางสำหรับหน้ารายการอาหาร
const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController')
router.get('/',foodController.getFoodPage)//method
module.exports = router;