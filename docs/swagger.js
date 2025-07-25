const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API do Departamento de Polícia',
      version: '1.0.0',
      description: 'API para gerenciamento de agentes e casos do departamento de polícia',
      contact: {
        name: 'Marina Diniz',
        email: 'marina@departamento.gov.br'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento'
      }
    ],
    components: {
      schemas: {
        Agente: {
          type: 'object',
          required: ['nome', 'dataDeIncorporacao', 'cargo'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único do agente',
              example: '401bccf5-cf9e-489d-8412-446cd169a0f1'
            },
            nome: {
              type: 'string',
              description: 'Nome completo do agente',
              example: 'Rommel Carneiro'
            },
            dataDeIncorporacao: {
              type: 'string',
              format: 'date',
              description: 'Data de incorporação do agente',
              example: '1992/10/04'
            },
            cargo: {
              type: 'string',
              enum: ['delegado', 'investigador', 'perito', 'agente', 'auxiliar'],
              description: 'Cargo do agente',
              example: 'delegado'
            }
          }
        },
        Caso: {
          type: 'object',
          required: ['titulo', 'descricao', 'agente_id'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único do caso',
              example: 'f5fb2ad5-22a8-4cb4-90f2-8733517a0d46'
            },
            titulo: {
              type: 'string',
              description: 'Título do caso',
              example: 'homicidio'
            },
            descricao: {
              type: 'string',
              description: 'Descrição detalhada do caso',
              example: 'Disparos foram reportados às 22:33 do dia 10/07/2007 na região do bairro União'
            },
            status: {
              type: 'string',
              enum: ['aberto', 'fechado', 'em_andamento'],
              description: 'Status atual do caso',
              example: 'aberto',
              default: 'aberto'
            },
            agente_id: {
              type: 'string',
              format: 'uuid',
              description: 'ID do agente responsável pelo caso',
              example: '401bccf5-cf9e-489d-8412-446cd169a0f1'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error'
            },
            statusCode: {
              type: 'integer',
              example: 404
            },
            message: {
              type: 'string',
              example: 'Recurso não encontrado'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'], // Caminho para os arquivos que contêm as anotações do Swagger
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs
};
