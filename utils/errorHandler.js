class APIerror extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

const errorHandler = (err, req, res, next) => {
    // Log do erro para desenvolvimento
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Erro interno do servidor';

    // Para erros 500, não expor detalhes internos
    const responseMessage = statusCode === 500 ? 'Erro interno do servidor' : message;

    res.status(statusCode).json({
        error: responseMessage,
        status: statusCode
    });
}

module.exports = { errorHandler, APIerror };