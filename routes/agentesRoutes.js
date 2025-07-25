const express = require('express')
const router = express.Router();
const agentesController = require('../controllers/agentesController');

/**
 * @swagger
 * tags:
 *   name: Agentes
 *   description: Gerenciamento de agentes do departamento de polícia
 */

/**
 * @swagger
 * /agentes:
 *   get:
 *     summary: Lista todos os agentes
 *     tags: [Agentes]
 *     responses:
 *       200:
 *         description: Lista de agentes retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Agente'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', agentesController.getAllAgentes);

/**
 * @swagger
 * /agentes/{id}:
 *   get:
 *     summary: Busca um agente por ID
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID único do agente
 *     responses:
 *       200:
 *         description: Agente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agente'
 *       404:
 *         description: Agente não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', agentesController.getAgenteById);

/**
 * @swagger
 * /agentes:
 *   post:
 *     summary: Cria um novo agente
 *     tags: [Agentes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - dataDeIncorporacao
 *               - cargo
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "João Silva"
 *               dataDeIncorporacao:
 *                 type: string
 *                 format: date
 *                 example: "2024/01/15"
 *               cargo:
 *                 type: string
 *                 enum: [delegado, investigador, perito, agente, auxiliar]
 *                 example: "agente"
 *     responses:
 *       201:
 *         description: Agente criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agente'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', agentesController.createAgente);

/**
 * @swagger
 * /agentes/{id}:
 *   put:
 *     summary: Atualiza um agente existente
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID único do agente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "João Silva Atualizado"
 *               dataDeIncorporacao:
 *                 type: string
 *                 format: date
 *                 example: "2024/01/15"
 *               cargo:
 *                 type: string
 *                 enum: [delegado, investigador, perito, agente, auxiliar]
 *                 example: "investigador"
 *     responses:
 *       200:
 *         description: Agente atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agente'
 *       404:
 *         description: Agente não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', agentesController.updateAgente);

/**
 * @swagger
 * /agentes/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um agente
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID único do agente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "João Silva"
 *               dataDeIncorporacao:
 *                 type: string
 *                 format: date
 *                 example: "2024/01/15"
 *               cargo:
 *                 type: string
 *                 example: "Agente"
 *     responses:
 *       200:
 *         description: Agente atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agente'
 *       404:
 *         description: Agente não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch('/:id', agentesController.patchAgente);

/**
 * @swagger
 * /agentes/{id}:
 *   delete:
 *     summary: Remove um agente
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID único do agente
 *     responses:
 *       200:
 *         description: Agente removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Agente removido com sucesso"
 *                 agente:
 *                   $ref: '#/components/schemas/Agente'
 *       404:
 *         description: Agente não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', agentesController.deleteAgente);

module.exports = router;