const casosRepository = require("../repositories/casosRepository")
function getAllCasos(req, res) {

        const casos = casosRepository.findAll()
        res.json(casos)
}

module.exports = {
   getAllCasos
}