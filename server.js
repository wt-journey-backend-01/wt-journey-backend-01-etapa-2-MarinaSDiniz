//server.js 

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();
const agentesRouter = require("./routes/agentesRoutes")
const casosRouter = require("./routes/casosRoutes")
const errorHandler = require("./utils/errorHandler")
const PORT = 3000;

app.use(express.json());
app.use(agentesRouter);
app.use(casosRouter);

// Middleware de tratamento de erros deve ser o último
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Servidor do Departamento de Polícia rodando em http://localhost:${PORT} em modo de desenvolvimento`);
}); 