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
            if (!isValidCargo(cargo)) {
                throw new APIerror('Cargo inválido. Valores permitidos: delegado, investigador, perito, agente, auxiliar', 400);
            }
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
        
        // Ordenar conforme solicitado
        if (ordenar) {
            switch (ordenar.toLowerCase()) {
                case 'data':
                case 'dataincorporacao':
                case 'data_asc':
                    agentes.sort((a, b) => new Date(a.dataDeIncorporacao) - new Date(b.dataDeIncorporacao));
                    break;
                case 'data_desc':
                case 'dataincorporacao_desc':
                    agentes.sort((a, b) => new Date(b.dataDeIncorporacao) - new Date(a.dataDeIncorporacao));
                    break;
                case 'nome':
                case 'nome_asc':
                    agentes.sort((a, b) => a.nome.localeCompare(b.nome));
                    break;
                case 'nome_desc':
                    agentes.sort((a, b) => b.nome.localeCompare(a.nome));
                    break;
                default:
                    throw new APIerror('Parâmetro de ordenação inválido. Use: data, data_desc, nome, nome_desc', 400);
            }
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
        
        // Verificar se o payload não está vazio
        if (!dadosAtualizados || Object.keys(dadosAtualizados).length === 0) {
            throw new APIerror('Payload vazio. Envie pelo menos um campo para atualizar.', 400);
        }
        
        // Impedir alteração do ID
        if (dadosAtualizados.id) {
            throw new APIerror('Não é permitido alterar o ID do agente', 400);
        }
        
        // Verificar se o agente existe antes de tentar atualizar
        const agenteExistente = agentesRepository.findById(id);
        if (!agenteExistente) {
            throw new APIerror('Agente não encontrado', 404);
        }
        
        // Validar campos obrigatórios para PUT (atualização completa)
        const { nome, dataDeIncorporacao, cargo } = dadosAtualizados;
        if (!nome || !dataDeIncorporacao || !cargo) {
            throw new APIerror('PUT requer todos os campos: nome, dataDeIncorporacao, cargo', 400);
        }
        
        // Validar campos se fornecidos
        if (dataDeIncorporacao && !isValidDate(dataDeIncorporacao)) {
            throw new APIerror('dataDeIncorporacao inválida ou no futuro. Use formato YYYY-MM-DD ou YYYY/MM/DD', 400);
        }
        
        if (cargo && !isValidCargo(cargo)) {
            throw new APIerror('Cargo inválido. Valores permitidos: delegado, investigador, perito, agente, auxiliar', 400);
        }
        
        // Validar tipos de dados
        if (nome && typeof nome !== 'string') {
            throw new APIerror('Campo nome deve ser uma string', 400);
        }
        if (cargo && typeof cargo !== 'string') {
            throw new APIerror('Campo cargo deve ser uma string', 400);
        }
        
        // Limpar e padronizar dados
        const dadosLimpos = {
            nome: nome.trim(),
            dataDeIncorporacao,
            cargo: cargo.toLowerCase()
        };
        
        const agenteAtualizado = agentesRepository.update(id, dadosLimpos);
        
        res.status(200).json(agenteAtualizado);
    } catch (error) {
        next(error);
    }
}

const patchAgente = (req, res, next) => {
    try {
        const { id } = req.params;
        const dadosAtualizados = req.body;
        
        // Verificar se o payload não está vazio
        if (!dadosAtualizados || Object.keys(dadosAtualizados).length === 0) {
            throw new APIerror('Payload vazio. Envie pelo menos um campo para atualizar.', 400);
        }
        
        // Impedir alteração do ID
        if (dadosAtualizados.id) {
            throw new APIerror('Não é permitido alterar o ID do agente', 400);
        }
        
        // Verificar se o agente existe antes de tentar atualizar
        const agenteExistente = agentesRepository.findById(id);
        if (!agenteExistente) {
            throw new APIerror('Agente não encontrado', 404);
        }
        
        // Validar campos se fornecidos
        if (dadosAtualizados.dataDeIncorporacao && !isValidDate(dadosAtualizados.dataDeIncorporacao)) {
            throw new APIerror('dataDeIncorporacao inválida ou no futuro. Use formato YYYY-MM-DD ou YYYY/MM/DD', 400);
        }
        
        if (dadosAtualizados.cargo && !isValidCargo(dadosAtualizados.cargo)) {
            throw new APIerror('Cargo inválido. Valores permitidos: delegado, investigador, perito, agente, auxiliar', 400);
        }
        
        // Validar tipos de dados
        if (dadosAtualizados.nome && typeof dadosAtualizados.nome !== 'string') {
            throw new APIerror('Campo nome deve ser uma string', 400);
        }
        if (dadosAtualizados.cargo && typeof dadosAtualizados.cargo !== 'string') {
            throw new APIerror('Campo cargo deve ser uma string', 400);
        }
        
        // Limpar e padronizar dados
        if (dadosAtualizados.nome) {
            dadosAtualizados.nome = dadosAtualizados.nome.trim();
        }
        if (dadosAtualizados.cargo) {
            dadosAtualizados.cargo = dadosAtualizados.cargo.toLowerCase();
        }
        
        const agenteAtualizado = agentesRepository.update(id, dadosAtualizados);
        
        res.status(200).json(agenteAtualizado);
    } catch (error) {
        next(error);
    }
}

const deleteAgente = (req, res, next) => {
    try {
        const { id } = req.params;
        
        // Verificar se o agente existe antes de tentar remover
        const agenteExistente = agentesRepository.findById(id);
        if (!agenteExistente) {
            throw new APIerror('Agente não encontrado', 404);
        }
        
        const agenteRemovido = agentesRepository.deleteById(id);
        
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