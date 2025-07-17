const express = require('express')
const router = express.Router();
const agentesController = require('../controllers/agentesController');

// define a rota para /agentes usando o método GET
router.get('/agentes', agentesController.seuMetodo)

module.exports = router;