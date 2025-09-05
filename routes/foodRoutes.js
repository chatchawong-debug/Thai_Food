// routes/foodRoutes.js - กำหนดเส้นทางสำหรับหน้ารายการอาหาร
const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController')

////// Get method //////
router.get('/',foodController.getFoodPage)
router.get('/add',foodController.addFoodPage)
router.get('/edit/:id', foodController.editFoodPage);
router.get('/delete/:id', foodController.deleteFoodItem);

////// Post method //////
router.post('/add',foodController.addFoodItem);
router.post('/edit/:id', foodController.editFoodItem);
module.exports = router;