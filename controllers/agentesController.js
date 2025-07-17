const agentesController = require('../repositories/agentesRepository');
function getAllAgentes(req, res) {

    const agentes = agentesController.findAll();
    res.json(agentes);

}

module.exports = {
    getAllAgentes
};