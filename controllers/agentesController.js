const agentesRepository = require('../repositories/agentesRepository');
function getAllAgentes(req, res) {

    const agentes = agentesRepository.findAll();
    res.json(agentes);

}

module.exports = {
    getAllAgentes
};