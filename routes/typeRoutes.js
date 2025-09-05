// routes/typeRoutes.js - กำหนดเส้นทางสำหรับหน้าประเภทอาหาร
const express = require('express');
const router = express.Router();
const typeController = require('../controllers/typeController')

////// Get method //////
router.get('/',typeController.getTypePage)
router.get('/add',typeController.addTypePage)
router.get('/edit/:id', typeController.editTypePage);

////// Post method //////
router.post('/add', typeController.addTypeItem);
router.post('/edit/:id', typeController.editTypeItem);
module.exports = router;