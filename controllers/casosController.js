const casosRepository = require("../repositories/casosRepository")
const agentesRepository = require("../repositories/agentesRepository")
const { v4: uuidv4 } = require('uuid');
const { APIerror } = require('../utils/errorHandler');

// Função para validar status
function isValidStatus(status) {
    const validStatus = ['aberto', 'fechado', 'solucionado'];
    return validStatus.includes(status.toLowerCase());
}

const getAllCasos = (req, res, next) => {
    try {
        const { status, agente_id, keyword, ordenar } = req.query;
        let casos = casosRepository.findAll();
        
        // Filtrar por status se fornecido
        if (status) {
            casos = casos.filter(caso => 
                caso.status.toLowerCase() === status.toLowerCase()
            );
        }
        
        // Filtrar por agente responsável se fornecido
        if (agente_id) {
            casos = casos.filter(caso => caso.agente_id === agente_id);
        }
        
        // Busca por keyword no título ou descrição
        if (keyword) {
            casos = casos.filter(caso =>
                caso.titulo.toLowerCase().includes(keyword.toLowerCase()) ||
                caso.descricao.toLowerCase().includes(keyword.toLowerCase())
            );
        }
        
        // Ordenar se solicitado
        if (ordenar === 'data') {
            casos.sort((a, b) => new Date(b.dataOcorrencia) - new Date(a.dataOcorrencia)); // Mais recentes primeiro
        } else if (ordenar === 'titulo') {
            casos.sort((a, b) => a.titulo.localeCompare(b.titulo));
        }
        
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
        
        // Validação de campos obrigatórios
        if (!titulo || !descricao || !agente_id) {
            throw new APIerror('Campos obrigatórios: titulo, descricao, agente_id', 400);
        }
        
        // Validar se o agente existe
        const agenteExiste = agentesRepository.findById(agente_id);
        if (!agenteExiste) {
            throw new APIerror('Agente não encontrado para o agente_id informado', 404);
        }
        
        // Validar status se fornecido
        const statusFinal = status || 'aberto';
        if (!isValidStatus(statusFinal)) {
            throw new APIerror('Status inválido. Valores permitidos: aberto, fechado, solucionado', 400);
        }
        
        const novoCaso = {
            id: uuidv4(),
            titulo: titulo.trim(),
            descricao: descricao.trim(),
            status: statusFinal.toLowerCase(),
            agente_id,
            dataOcorrencia: new Date().toISOString().split('T')[0] // YYYY-MM-DD
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
        
        // Impedir alteração do ID
        if (dadosAtualizados.id) {
            throw new APIerror('Não é permitido alterar o ID do caso', 400);
        }
        
        // Se agente_id está sendo atualizado, validar se existe
        if (dadosAtualizados.agente_id) {
            const agenteExiste = agentesRepository.findById(dadosAtualizados.agente_id);
            if (!agenteExiste) {
                throw new APIerror('Agente não encontrado para o agente_id informado', 404);
            }
        }
        
        // Validar status se fornecido
        if (dadosAtualizados.status && !isValidStatus(dadosAtualizados.status)) {
            throw new APIerror('Status inválido. Valores permitidos: aberto, fechado, solucionado', 400);
        }
        
        // Limpar e padronizar dados
        if (dadosAtualizados.titulo) {
            dadosAtualizados.titulo = dadosAtualizados.titulo.trim();
        }
        if (dadosAtualizados.descricao) {
            dadosAtualizados.descricao = dadosAtualizados.descricao.trim();
        }
        if (dadosAtualizados.status) {
            dadosAtualizados.status = dadosAtualizados.status.toLowerCase();
        }
        
        const casoAtualizado = casosRepository.update(id, dadosAtualizados);
        
        if (!casoAtualizado) {
            throw new APIerror('Caso não encontrado', 404);
        }
        
        res.status(200).json(casoAtualizado);
    } catch (error) {
        next(error);
    }
}

const patchCaso = (req, res, next) => {
    try {
        const { id } = req.params;
        const dadosAtualizados = req.body;
        
        // Impedir alteração do ID
        if (dadosAtualizados.id) {
            throw new APIerror('Não é permitido alterar o ID do caso', 400);
        }
        
        // Se agente_id está sendo atualizado, validar se existe
        if (dadosAtualizados.agente_id) {
            const agenteExiste = agentesRepository.findById(dadosAtualizados.agente_id);
            if (!agenteExiste) {
                throw new APIerror('Agente não encontrado para o agente_id informado', 404);
            }
        }
        
        // Validar status se fornecido
        if (dadosAtualizados.status && !isValidStatus(dadosAtualizados.status)) {
            throw new APIerror('Status inválido. Valores permitidos: aberto, fechado, solucionado', 400);
        }
        
        // Limpar e padronizar dados
        if (dadosAtualizados.titulo) {
            dadosAtualizados.titulo = dadosAtualizados.titulo.trim();
        }
        if (dadosAtualizados.descricao) {
            dadosAtualizados.descricao = dadosAtualizados.descricao.trim();
        }
        if (dadosAtualizados.status) {
            dadosAtualizados.status = dadosAtualizados.status.toLowerCase();
        }
        
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
    patchCaso,
    deleteCaso
}