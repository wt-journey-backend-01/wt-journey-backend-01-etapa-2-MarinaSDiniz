const express = require('express');
const router = express.Router();
const casosController = require('../controllers/casosController');

// define a rota para /casos usando o método GET
router.get('/casos', casosController.getAllCasos);

module.exports = router;