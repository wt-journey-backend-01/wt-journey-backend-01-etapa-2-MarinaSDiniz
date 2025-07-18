const express = require('express');
const router = express.Router();
const casosController = require('../controllers/casosController');

// GET /casos - Buscar todos os casos
router.get('/casos', casosController.getAllCasos);

// GET /casos/:id - Buscar caso por ID
router.get('/casos/:id', casosController.getCasoById);

// POST /casos - Criar novo caso
router.post('/casos', casosController.createCaso);

// PUT /casos/:id - Atualizar caso
router.put('/casos/:id', casosController.updateCaso);

// DELETE /casos/:id - Deletar caso
router.delete('/casos/:id', casosController.deleteCaso);

module.exports = router;