//server.js 

const express = require('express');
const app = express();
const agentesRouter = require("./routes/agentesRouter")

app.use(agentesRouter);

app.listen(PORT, () => {
    console.log(`Servidor do Departamento de Polícia rodando em http://localhost:${PORT} em modo de desenvolvimento`);
}); 