import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
    openapi: '3.0.4',
    info: {
        title: 'API do Gestor Financeiro Pessoal',
        version: '1.0.0',
        description: `API para gerenciamento financeiro pessoal desenvolvida no curso Técnico de Desenvolvimento de Sistemas do SENAI`
    },
    servers: [
        {
            url: 'http://localhost:3000/',
            description: 'Servidor Local'
        },
        {
            url: 'https://192.168.0.237:3000',
            description: 'Servidor de API do Douglas'
        }
    ],
    tags: [
        {
            name: 'Usuarios',
            description: 'Rotas para cadastro, login, atualização e desativação de usuários'
        },
        {
            name: 'Categorias',
            description: 'Rotas para cadastro, leitura, atualização e exclusão de categorias'
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    paths: {
        '/usuarios': {
            post: {
                tags: ['Usuarios'],
                summary: 'Cadastrar novo usuário',
                description: 'Método utilizado para cadastrar novos usuários',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nome', 'email', 'senha', 'tipo_acesso'],
                                properties: {
                                    nome: { type: 'string', example: 'João Silva' },
                                    email: { type: 'string', example: 'joao@example.com' },
                                    senha: { type: 'string', example: '123' },
                                    tipo_acesso: { type: 'string', example: 'adm' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Usuário cadastrado com sucesso'
                    },
                    '400': {
                        description: 'Erro ao cadastrar usuário'
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            },
            get: {
                tags: ['Usuarios'],
                summary: 'Listar todos os usuários',
                description: 'Método utilizado para listar todos os usuários cadastrados',
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                responses: {
                    '200': {
                        description: 'Lista de usuários',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id_usuario: { type: 'integer', example: 1 },
                                            nome: { type: 'string', example: 'João Silva' },
                                            email: { type: 'string', example: 'joao@example.com' },
                                            senha: { type: 'string', example: '123' },
                                            tipo_acesso: { type: 'string', example: 'adm' },
                                            ativo: { type: 'boolean', example: true },
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            },
            put: {
                tags: ["Usuarios"],
                summary: "Atualizar usuário",
                description: "Método utilizado para atualizar um usuário",
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                parameters: [
                    {
                        name: "id_usuario",
                        in: "path",
                        required: true,
                        description: "ID do usuário a ser atualizado",
                        schema: {
                            type: "integer"
                        }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    nome: { type: "string", example: "João Silva" },
                                    email: { type: "string", example: "joao@example.com" },
                                    senha: { type: "string", example: "123" },
                                    tipo_acesso: { type: "string", example: "adm" },
                                    ativo: { type: "boolean", example: true },
                                },
                            },
                        }
                    }
                },
            },
        },
        '/usuarios/{id_usuario}': {
            delete: {
                tags: ['Usuarios'],
                summary: 'Desativar usuario',
                description: 'Rota para desativar usuario',
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                parameters: [
                    {
                        name: 'id_usuario',
                        in: 'path', // caso queira passar como query in: 'query'
                        required: true,
                        schema: {
                            type: 'integer',
                        }

                    }

                ],
                responses: {
                    '200': { description: 'Usuário desativado com sucesso' },
                    '500': { description: 'Erro ao desativar usuario' }
                }
            }
        },




        '/usuarios/login': {
            post: {
                tags: ['Usuarios'],
                summary: 'Login do usuário',
                description: 'Método utilizado para efetuar o login do usuário e gerar o token',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'senha'],
                                properties: {
                                    email: { type: 'string', example: 'sesia@sesi.br' },
                                    senha: { type: 'string', example: '123' },
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Usuário encontrado',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            token: { type: 'string', example: 'jkdnaskjdbaskjndlaksnmmlmcaj21lekn1lkn213n12jb3kj 21' },
                                            id_usuario: { type: 'integer', example: 1 },
                                            nome: { type: 'string', example: 'João Silva' },
                                            email: { type: 'string', example: 'joao@example.com' },
                                            senha: { type: 'string', example: '123' },
                                            tipo_acesso: { type: 'string', example: 'adm' },
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Erro ao encontrar usuário'
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            },
        },

        '/categorias': {
            post: {
                tags: ['Categorias'],
                summary: 'Nova categoria',
                description: 'Rota para cadastrar nova categoria',
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nome', 'tipo_transacao', 'gasto_fixo', 'id_usuario'],
                                properties: {
                                    nome: { type: 'string', example: 'Alimentação' },
                                    tipo_transacao: { type: 'string', example: 'ENTRADA OU SAIDA' },
                                    gasto_fixo: { type: 'boolean', example: true },
                                    id_usuario: { type: 'integer', example: 1 },
                                    cor: { type: 'string', example: '#fff' },
                                    icone: { type: 'string', example: 'save' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Categoria cadastrada',
                    },
                    '400': {
                        description: 'Erro ao cadastrar categoria'
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            },
            get: {
                tags: ['Categorias'],
                summary: 'Listar categorias',
                description: 'Rota para listar categorias',
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nome', 'tipo_transacao', 'gasto_fixo', 'id_usuario'],
                                properties: {
                                    nome: { type: 'string', example: 'Alimentação' },
                                    tipo_transacao: { type: 'string', example: 'ENTRADA OU SAIDA' },
                                    gasto_fixo: { type: 'boolean', example: true },
                                    id_usuario: { type: 'integer', example: 1 },
                                    cor: { type: 'string', example: '#fff' },
                                    icone: { type: 'string', example: 'save' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Categorias listadas',
                    },
                    '400': {
                        description: 'Erro ao listar categorias'
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            },
            put: {
                tags: ["Categorias"],
                summary: "Atualizar categoria",
                description: "Método utilizado para atualizar uma categoria",
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                parameters: [
                    {
                        name: "id_categoria",
                        in: "path",
                        required: true,
                        description: "ID da categoria a ser atualizada",
                        schema: {
                            type: "integer"
                        }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    nome: { type: "string", example: "João Silva" },
                                    email: { type: "string", example: "joao@example.com" },
                                    senha: { type: "string", example: "123" },
                                    tipo_acesso: { type: "string", example: "adm" },
                                    ativo: { type: "boolean", example: true },
                                },
                            },
                        }
                    }
                },
            },
        },


        '/categorias/{id_categoria}': {
            delete: {
                tags: ['Categorias'],
                summary: 'Desativar categoria',
                description: 'Rota para desativar categoria',
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                parameters: [
                    {
                        name: 'id_categoria',
                        in: 'path', // caso queira passar como query in: 'query'
                        required: true,
                        schema: {
                            type: 'integer',
                        }

                    }

                ],
                responses: {
                    '200': { description: 'categoria desativada com sucesso' },
                    '500': { description: 'Erro ao desativar categoria' }
                }
            }
        },


        '/subcategorias': {
             post: {
                tags: ['Subcategorias'],
                summary: 'Cadastrar nova subcategoria',
                description: 'Método utilizado para cadastrar novos subcategorias',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nome', 'email', 'senha', 'tipo_acesso'],
                                properties: {
                                    nome: { type: 'string', example: 'João Silva' },
                                    email: { type: 'string', example: 'joao@example.com' },
                                    senha: { type: 'string', example: '123' },
                                    tipo_acesso: { type: 'string', example: 'adm' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'subcategoria cadastrado com sucesso'
                    },
                    '400': {
                        description: 'Erro ao cadastrar subcategoria'
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            },
            get: {
                tags: ['Subcategorias'],
                summary: 'Listar todos os subcategorias',
                description: 'Método utilizado para listar todos os subcategorias cadastrados',
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                responses: {
                    '200': {
                        description: 'Lista de subcategorias',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id_usuario: { type: 'integer', example: 1 },
                                            nome: { type: 'string', example: 'João Silva' },
                                            email: { type: 'string', example: 'joao@example.com' },
                                            senha: { type: 'string', example: '123' },
                                            tipo_acesso: { type: 'string', example: 'adm' },
                                            ativo: { type: 'boolean', example: true },
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            },
            put: {
                tags: ["Subcategorias"],
                summary: "Atualizar subcategoria",
                description: "Método utilizado para atualizar uma subcategoria",
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                parameters: [
                    {
                        name: "id_subcategoria",
                        in: "path",
                        required: true,
                        description: "ID da subcategoria a ser atualizado",
                        schema: {
                            type: "integer"
                        }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    nome: { type: "string", example: "João Silva" },
                                    email: { type: "string", example: "joao@example.com" },
                                    senha: { type: "string", example: "123" },
                                    tipo_acesso: { type: "string", example: "adm" },
                                    ativo: { type: "boolean", example: true },
                                },
                            },
                        }
                    }
                },
            },
        },
        '/subcategorias/{id_subcategoria}': {
            delete: {
                tags: ['Subcategorias'],
                summary: 'Desativar subcategoria',
                description: 'Rota para desativar subcategoria',
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                parameters: [
                    {
                        name: 'id_subcategoria',
                        in: 'path', // caso queira passar como query in: 'query'
                        required: true,
                        schema: {
                            type: 'integer',
                        }

                    }

                ],
                responses: {
                    '200': { description: 'subcategoria desativada com sucesso' },
                    '500': { description: 'Erro ao desativar subcategoria' }
                }
            }
        },

        '/contas': {
             post: {
                tags: ['Contas'],
                summary: 'Cadastrar nova Conta',
                description: 'Método utilizado para cadastrar novas contas',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nome', 'email', 'senha', 'tipo_acesso'],
                                properties: {
                                    nome: { type: 'string', example: 'João Silva' },
                                    email: { type: 'string', example: 'joao@example.com' },
                                    senha: { type: 'string', example: '123' },
                                    tipo_acesso: { type: 'string', example: 'adm' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Conta cadastrado com sucesso'
                    },
                    '400': {
                        description: 'Erro ao cadastrar Conta'
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            },
            get: {
                tags: ['Contas'],
                summary: 'Listar todos as contas',
                description: 'Método utilizado para listar todos as contas cadastrados',
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                responses: {
                    '200': {
                        description: 'Lista de contas',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id_usuario: { type: 'integer', example: 1 },
                                            nome: { type: 'string', example: 'João Silva' },
                                            email: { type: 'string', example: 'joao@example.com' },
                                            senha: { type: 'string', example: '123' },
                                            tipo_acesso: { type: 'string', example: 'adm' },
                                            ativo: { type: 'boolean', example: true },
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            },
            put: {
                tags: ["Contas"],
                summary: "Atualizar Conta",
                description: "Método utilizado para atualizar um usuário",
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                parameters: [
                    {
                        name: "id_usuario",
                        in: "path",
                        required: true,
                        description: "ID do usuário a ser atualizado",
                        schema: {
                            type: "integer"
                        }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    nome: { type: "string", example: "João Silva" },
                                    email: { type: "string", example: "joao@example.com" },
                                    senha: { type: "string", example: "123" },
                                    tipo_acesso: { type: "string", example: "adm" },
                                    ativo: { type: "boolean", example: true },
                                },
                            },
                        }
                    }
                },
            },
        },

        '/contas/{id_contas}': {
            delete: {
                tags: ['Contas'],
                summary: 'Desativar contas',
                description: 'Rota para desativar contas',
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                parameters: [
                    {
                        name: 'id_contas',
                        in: 'path', // caso queira passar como query in: 'query'
                        required: true,
                        schema: {
                            type: 'integer',
                        }

                    }

                ],
                responses: {
                    '200': { description: 'conta desativada com sucesso' },
                    '500': { description: 'Erro ao desativar conta' }
                }
            }
        },
        
        '/transacoes': {
            post: {
                tags: ['Transacoes'],
                summary: 'Cadastrar nova transacao',
                description: 'Método utilizado para cadastrar novas transacoes',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nome', 'email', 'senha', 'tipo_acesso'],
                                properties: {
                                    nome: { type: 'string', example: 'João Silva' },
                                    email: { type: 'string', example: 'joao@example.com' },
                                    senha: { type: 'string', example: '123' },
                                    tipo_acesso: { type: 'string', example: 'adm' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'transacao cadastrada com sucesso'
                    },
                    '400': {
                        description: 'Erro ao cadastrar transacao'
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            },
            get: {
                tags: ['Transacoes'],
                summary: 'Listar todos as transacoes',
                description: 'Método utilizado para listar todos as transacoes cadastradas',
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                responses: {
                    '200': {
                        description: 'Lista de transacoes',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id_usuario: { type: 'integer', example: 1 },
                                            nome: { type: 'string', example: 'João Silva' },
                                            email: { type: 'string', example: 'joao@example.com' },
                                            senha: { type: 'string', example: '123' },
                                            tipo_acesso: { type: 'string', example: 'adm' },
                                            ativo: { type: 'boolean', example: true },
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': {
                        description: 'Erro interno do servidor'
                    }
                }
            },
        },

        '/transacoes/{id_transacao}': {
         delete: {
                tags: ['Transacoes'],
                summary: 'Desativar transacao',
                description: 'Rota para desativar transacao',
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                parameters: [
                    {
                        name: 'id_transacao',
                        in: 'path', // caso queira passar como query in: 'query'
                        required: true,
                        schema: {
                            type: 'integer',
                        }

                    }

                ],
                responses: {
                    '200': { description: 'transacao desativada com sucesso' },
                    '500': { description: 'Erro ao desativar transacao' }
                }
            }
        },
    }
 }


const options = {
    swaggerDefinition,
    apis: [] //
}

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;