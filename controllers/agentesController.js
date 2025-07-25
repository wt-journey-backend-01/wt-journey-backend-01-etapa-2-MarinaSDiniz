const agentesRepository = require('../repositories/agentesRepository');
const { v4: uuidv4 } = require('uuid');
const { APIerror } = require('../utils/errorHandler');

// Função para validar formato de data e se não está no futuro
function isValidDate(dateString) {
    // Verifica formato YYYY/MM/DD ou YYYY-MM-DD
    const regex = /^\d{4}[/-]\d{2}[/-]\d{2}$/;
    if (!regex.test(dateString)) return false;
    
    const date = new Date(dateString.replace(/\//g, '-'));
    const now = new Date();
    now.setHours(23, 59, 59, 999); // Permite datas de hoje
    
    return date instanceof Date && !isNaN(date) && date <= now;
}

// Função para validar se o cargo é válido
function isValidCargo(cargo) {
    const validCargos = ['delegado', 'investigador', 'perito', 'agente', 'auxiliar'];
    return validCargos.includes(cargo.toLowerCase());
}

const getAllAgentes = (req, res, next) => {
    try {
        const { cargo, ordenar, busca } = req.query;
        let agentes = agentesRepository.findAll();
        
        // Filtrar por cargo se fornecido
        if (cargo) {
            agentes = agentes.filter(agente => 
                agente.cargo.toLowerCase() === cargo.toLowerCase()
            );
        }
        
        // Busca por nome se fornecido
        if (busca) {
            agentes = agentes.filter(agente => 
                agente.nome.toLowerCase().includes(busca.toLowerCase())
            );
        }
        
        // Ordenar por data de incorporação se solicitado
        if (ordenar === 'dataIncorporacao' || ordenar === 'data') {
            agentes.sort((a, b) => new Date(a.dataDeIncorporacao) - new Date(b.dataDeIncorporacao));
        } else if (ordenar === 'nome') {
            agentes.sort((a, b) => a.nome.localeCompare(b.nome));
        }
        
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
        
        // Validação de campos obrigatórios
        if (!nome || !dataDeIncorporacao || !cargo) {
            throw new APIerror('Campos obrigatórios: nome, dataDeIncorporacao, cargo', 400);
        }
        
        // Validação do formato e lógica da data
        if (!isValidDate(dataDeIncorporacao)) {
            throw new APIerror('dataDeIncorporacao inválida ou no futuro. Use formato YYYY-MM-DD ou YYYY/MM/DD', 400);
        }
        
        // Validação do cargo
        if (!isValidCargo(cargo)) {
            throw new APIerror('Cargo inválido. Valores permitidos: delegado, investigador, perito, agente, auxiliar', 400);
        }
        
        const novoAgente = {
            id: uuidv4(),
            nome: nome.trim(),
            dataDeIncorporacao,
            cargo: cargo.toLowerCase()
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
        
        // Impedir alteração do ID
        if (dadosAtualizados.id) {
            throw new APIerror('Não é permitido alterar o ID do agente', 400);
        }
        
        // Validar campos se fornecidos
        if (dadosAtualizados.dataDeIncorporacao && !isValidDate(dadosAtualizados.dataDeIncorporacao)) {
            throw new APIerror('dataDeIncorporacao inválida ou no futuro. Use formato YYYY-MM-DD ou YYYY/MM/DD', 400);
        }
        
        if (dadosAtualizados.cargo && !isValidCargo(dadosAtualizados.cargo)) {
            throw new APIerror('Cargo inválido. Valores permitidos: delegado, investigador, perito, agente, auxiliar', 400);
        }
        
        // Limpar e padronizar dados
        if (dadosAtualizados.nome) {
            dadosAtualizados.nome = dadosAtualizados.nome.trim();
        }
        if (dadosAtualizados.cargo) {
            dadosAtualizados.cargo = dadosAtualizados.cargo.toLowerCase();
        }
        
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
        
        // Impedir alteração do ID
        if (dadosAtualizados.id) {
            throw new APIerror('Não é permitido alterar o ID do agente', 400);
        }
        
        // Validar campos se fornecidos
        if (dadosAtualizados.dataDeIncorporacao && !isValidDate(dadosAtualizados.dataDeIncorporacao)) {
            throw new APIerror('dataDeIncorporacao inválida ou no futuro. Use formato YYYY-MM-DD ou YYYY/MM/DD', 400);
        }
        
        if (dadosAtualizados.cargo && !isValidCargo(dadosAtualizados.cargo)) {
            throw new APIerror('Cargo inválido. Valores permitidos: delegado, investigador, perito, agente, auxiliar', 400);
        }
        
        // Limpar e padronizar dados
        if (dadosAtualizados.nome) {
            dadosAtualizados.nome = dadosAtualizados.nome.trim();
        }
        if (dadosAtualizados.cargo) {
            dadosAtualizados.cargo = dadosAtualizados.cargo.toLowerCase();
        }
        
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