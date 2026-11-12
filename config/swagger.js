const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Opciones de configuración de Swagger / OpenAPI 3.0
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Instituciones Educativas',
            version: '1.0.0',
            description: 'Documentación de la API para gestión de instituciones educativas, usuarios y perfiles',
            contact: {
                name: 'Soporte API',
                email: 'support@api.com'
            }
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 5000}`,
                description: 'Servidor local de desarrollo'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Token JWT en formato: Bearer <token>'
                }
            },
            schemas: {
                ErrorEnvelope: {
                    type: 'object',
                    required: ['error'],
                    properties: {
                        error: {
                            type: 'object',
                            required: ['code', 'message'],
                            properties: {
                                code: {
                                    type: 'string',
                                    example: 'BAD_REQUEST',
                                    description: 'Código de error estandarizado'
                                },
                                message: {
                                    type: 'string',
                                    example: 'Descripción del error ocurrido',
                                    description: 'Mensaje legible del error'
                                }
                            }
                        }
                    }
                },
                Pagination: {
                    type: 'object',
                    required: ['total', 'page', 'limit', 'totalPages'],
                    properties: {
                        total: {
                            type: 'integer',
                            example: 50,
                            description: 'Total de registros disponibles'
                        },
                        page: {
                            type: 'integer',
                            example: 1,
                            description: 'Página actual'
                        },
                        limit: {
                            type: 'integer',
                            example: 10,
                            description: 'Límite de registros por página'
                        },
                        totalPages: {
                            type: 'integer',
                            example: 5,
                            description: 'Total de páginas calculadas'
                        }
                    }
                }
            },
            responses: {
                BadRequestError: {
                    description: 'Solicitud inválida o parámetros incorrectos',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorEnvelope' }
                        }
                    }
                },
                UnauthorizedError: {
                    description: 'No autenticado o token ausente/inválido',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorEnvelope' }
                        }
                    }
                },
                ForbiddenError: {
                    description: 'Acceso no autorizado para el rol del usuario',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorEnvelope' }
                        }
                    }
                },
                NotFoundError: {
                    description: 'Recurso no encontrado',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorEnvelope' }
                        }
                    }
                }
            }
        }
    },
    apis: ['./routes/*.js', './models/schemas/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

module.exports = setupSwagger;
module.exports.swaggerDocs = swaggerDocs;