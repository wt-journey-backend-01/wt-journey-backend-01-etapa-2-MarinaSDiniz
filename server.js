//server.js 

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const app = express();
const agentesRouter = require("./routes/agentesRoutes")
const casosRouter = require("./routes/casosRoutes")
const errorHandler = require("./utils/errorHandler")
const PORT = 3000;

app.use(express.json());

// Rota para servir a documentação da API
app.get('/api-docs', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs', 'api-documentation.html'));
});

// Rota básica de informações da API
app.get('/', (req, res) => {
    res.json({
        message: 'API do Departamento de Polícia',
        version: '1.0.0',
        documentation: 'http://localhost:3000/api-docs',
        endpoints: {
            agentes: 'http://localhost:3000/agentes',
            casos: 'http://localhost:3000/casos'
        }
    });
});

app.use(agentesRouter);
app.use(casosRouter);

// Middleware de tratamento de erros deve ser o último
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Servidor do Departamento de Polícia rodando em http://localhost:${PORT} em modo de desenvolvimento`);
    console.log(`📚 Documentação da API disponível em: http://localhost:${PORT}/api-docs`);
}); 