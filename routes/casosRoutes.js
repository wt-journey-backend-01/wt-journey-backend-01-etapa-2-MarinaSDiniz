const express = require('express');
const router = express.Router();
const casosController = require('../controllers/casosController');

/**
 * @swagger
 * tags:
 *   name: Casos
 *   description: Gerenciamento de casos policiais
 */

/**
 * @swagger
 * /casos:
 *   get:
 *     summary: Lista todos os casos
 *     tags: [Casos]
 *     responses:
 *       200:
 *         description: Lista de casos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Caso'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', casosController.getAllCasos);

/**
 * @swagger
 * /casos/{id}:
 *   get:
 *     summary: Busca um caso por ID
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID único do caso
 *     responses:
 *       200:
 *         description: Caso encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
 *       404:
 *         description: Caso não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', casosController.getCasoById);

/**
 * @swagger
 * /casos:
 *   post:
 *     summary: Cria um novo caso
 *     tags: [Casos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - descricao
 *               - agente_id
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: "Roubo de veículo"
 *               descricao:
 *                 type: string
 *                 example: "Veículo furtado na região central durante a madrugada"
 *               status:
 *                 type: string
 *                 enum: [aberto, fechado, em_andamento]
 *                 example: "aberto"
 *                 default: "aberto"
 *               agente_id:
 *                 type: string
 *                 format: uuid
 *                 example: "401bccf5-cf9e-489d-8412-446cd169a0f1"
 *     responses:
 *       201:
 *         description: Caso criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', casosController.createCaso);

/**
 * @swagger
 * /casos/{id}:
 *   put:
 *     summary: Atualiza um caso existente
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID único do caso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: "Roubo de veículo - Atualizado"
 *               descricao:
 *                 type: string
 *                 example: "Descrição atualizada do caso"
 *               status:
 *                 type: string
 *                 enum: [aberto, fechado, em_andamento]
 *                 example: "em_andamento"
 *               agente_id:
 *                 type: string
 *                 format: uuid
 *                 example: "401bccf5-cf9e-489d-8412-446cd169a0f1"
 *     responses:
 *       200:
 *         description: Caso atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
 *       404:
 *         description: Caso não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// PUT /casos/:id - Atualizar caso completo
router.put('/:id', casosController.updateCaso);

// PATCH /casos/:id - Atualizar caso parcialmente
router.patch('/:id', casosController.patchCaso);

/**
 * @swagger
 * /casos/{id}:
 *   delete:
 *     summary: Remove um caso
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID único do caso
 *     responses:
 *       200:
 *         description: Caso removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Caso removido com sucesso"
 *                 caso:
 *                   $ref: '#/components/schemas/Caso'
 *       404:
 *         description: Caso não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', casosController.deleteCaso);

module.exports = router;