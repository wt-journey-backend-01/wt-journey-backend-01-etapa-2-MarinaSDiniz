const agentesRepository = require('../repositories/agentesRepository');
const { v4: uuidv4 } = require('uuid');

class APIerror extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

const getAllAgentes = (req, res, next) => {
    try {
        const agentes = agentesRepository.findAll();
        res.status(200).json(agentes);
    } catch (error) {
        next(error);
    }
}

const getAgenteById = (req, res, next) => {
    try {
        const { id } = req.params;
        const agente = agentesRepository.findById(id);
        
        if (!agente) {
            throw new APIerror('Agente não encontrado', 404);
        }
        
        res.status(200).json(agente);
    } catch (error) {
        next(error);
    }
}

const createAgente = (req, res, next) => {
    try {
        const { nome, dataDeIncorporacao, cargo } = req.body;
        
        if (!nome || !dataDeIncorporacao || !cargo) {
            throw new APIerror('Campos obrigatórios: nome, dataDeIncorporacao, cargo', 400);
        }
        
        const novoAgente = {
            id: uuidv4(),
            nome,
            dataDeIncorporacao,
            cargo
        };
        
        const agenteCreated = agentesRepository.create(novoAgente);
        res.status(201).json(agenteCreated);
    } catch (error) {
        next(error);
    }
}

const updateAgente = (req, res, next) => {
    try {
        const { id } = req.params;
        const dadosAtualizados = req.body;
        
        const agenteAtualizado = agentesRepository.update(id, dadosAtualizados);
        
        if (!agenteAtualizado) {
            throw new APIerror('Agente não encontrado', 404);
        }
        
        res.status(200).json(agenteAtualizado);
    } catch (error) {
        next(error);
    }
}

const patchAgente = (req, res, next) => {
    try {
        const { id } = req.params;
        const dadosAtualizados = req.body;
        
        const agenteAtualizado = agentesRepository.update(id, dadosAtualizados);
        
        if (!agenteAtualizado) {
            throw new APIerror('Agente não encontrado', 404);
        }
        
        res.status(200).json(agenteAtualizado);
    } catch (error) {
        next(error);
    }
}

const deleteAgente = (req, res, next) => {
    try {
        const { id } = req.params;
        const agenteRemovido = agentesRepository.deleteById(id);
        
        if (!agenteRemovido) {
            throw new APIerror('Agente não encontrado', 404);
        }
        
        res.status(200).json({ message: 'Agente removido com sucesso', agente: agenteRemovido });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllAgentes,
    getAgenteById,
    createAgente,
    updateAgente,
    patchAgente,
    deleteAgente
};