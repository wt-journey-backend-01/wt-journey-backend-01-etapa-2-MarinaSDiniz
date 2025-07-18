const casosRepository = require("../repositories/casosRepository")
const { v4: uuidv4 } = require('uuid');

class APIerror extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

const getAllCasos = (req, res, next) => {
    try {
        const casos = casosRepository.findAll();
        res.status(200).json(casos);
    } catch (error) {
        next(error);
    }
}

const getCasoById = (req, res, next) => {
    try {
        const { id } = req.params;
        const caso = casosRepository.findById(id);
        
        if (!caso) {
            throw new APIerror('Caso não encontrado', 404);
        }
        
        res.status(200).json(caso);
    } catch (error) {
        next(error);
    }
}

const createCaso = (req, res, next) => {
    try {
        const { titulo, descricao, status, agente_id } = req.body;
        
        if (!titulo || !descricao || !agente_id) {
            throw new APIerror('Campos obrigatórios: titulo, descricao, agente_id', 400);
        }
        
        const novoCaso = {
            id: uuidv4(),
            titulo,
            descricao,
            status: status || 'aberto',
            agente_id
        };
        
        const casoCreated = casosRepository.create(novoCaso);
        res.status(201).json(casoCreated);
    } catch (error) {
        next(error);
    }
}

const updateCaso = (req, res, next) => {
    try {
        const { id } = req.params;
        const dadosAtualizados = req.body;
        
        const casoAtualizado = casosRepository.update(id, dadosAtualizados);
        
        if (!casoAtualizado) {
            throw new APIerror('Caso não encontrado', 404);
        }
        
        res.status(200).json(casoAtualizado);
    } catch (error) {
        next(error);
    }
}

const deleteCaso = (req, res, next) => {
    try {
        const { id } = req.params;
        const casoRemovido = casosRepository.deleteById(id);
        
        if (!casoRemovido) {
            throw new APIerror('Caso não encontrado', 404);
        }
        
        res.status(200).json({ message: 'Caso removido com sucesso', caso: casoRemovido });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllCasos,
    getCasoById,
    createCaso,
    updateCaso,
    deleteCaso
}