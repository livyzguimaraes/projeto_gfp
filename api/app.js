import express from 'express';
import { testarConexao } from './db.js';
import cors from 'cors';
import rotasUsuarios, {autenticarToken} from './routes/rotasUsuarios.js';
import rotasCategorias from './routes/rotasCategorias.js';
import rotasSubcategorias from './routes/rotasSubcategorias.js';
import rotasTransacoes from './routes/rotasTransacoes.js';
import rotasContas from './routes/RotasContas.js';

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';

const app = express();
testarConexao();

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
    res.redirect('/api-docs');
})

// Rotas usuarios
app.post('/usuarios', rotasUsuarios.Novousuario)
app.get('/usuarios', autenticarToken, rotasUsuarios.Listar)
app.get('/usuarios/:id', rotasUsuarios.ListarporID)
app.put('/usuarios/:id', rotasUsuarios.AtualizartodosCampos)
app.delete('/usuarios/:id_usuario', autenticarToken,  rotasUsuarios.Deletar)
app.patch('/usuarios/:id_usuario', rotasUsuarios.Atualizar)
app.post('/usuarios/login', rotasUsuarios.Login)


// Rotas categorias
app.post('/categorias', autenticarToken, rotasCategorias.novaCategoria)
app.get ('/categorias/filtrarCategoria', rotasCategorias.filtrarCategoria)
app.get('/categorias', rotasCategorias.listarTodas)
app.delete('/categorias/:id', rotasCategorias.Deletar)
app.put('/categorias/:id', rotasCategorias.atualizarTodosCampos)
app.patch('/categorias/:id', rotasCategorias.Atualizar)
app.get('/categorias/:id', rotasCategorias.ListarporID)

// Rotas subcategorias
app.post('/subcategorias', rotasSubcategorias.novaSubCategoria)
app.delete('/subcategorias/:id', rotasSubcategorias.deletarSubcategoria)
app.get('/subcategorias', rotasSubcategorias.listarSubcategorias)
app.get('/subcategorias/:id', rotasSubcategorias.ListarporID)
app.put('/subcategorias/:id', rotasSubcategorias.atualizartodosCampos)
app.patch('/subcategorias/:id', rotasSubcategorias.Atualizar)

//Rotas Contas
app.post('/contas', rotasContas.NovasContas);
app.get ('/contas/filtrarContas', rotasContas.filtrarConta)
// app.get('/contas', rotasContas.ListarTodas);
// app.get('/contas/:id_conta', rotasContas.BuscarId);
// app.patch('/contas/:id_conta', rotasContas.AtualizarContas);
// app.put('/contas/:id_conta', rotasContas.atualizarTodosCampos);
// app.delete('/contas/:id_conta', rotasContas.deletar);

// // Rotas Transacoes
app.post('/transacao', rotasTransacoes.criarTransacao);
app.get('/transacao/somarTransacoes', rotasTransacoes.somarTransacoes);
app.get('/transacao/filtroData', rotasTransacoes.filtrarPorData);
app.get('/transacao/transacoesVencidas/:id_usuario', rotasTransacoes.transacoesVencidas);

app.get('/transacao', rotasTransacoes.listarTransacoes);
app.get('/transacao/:id_transacao', rotasTransacoes.listarporId);
app.patch('/transacao/:id_transacao', rotasTransacoes.AtualizarTransacao);
app.put('/transacao/:id_transacao', rotasTransacoes.atualizarTodosCampos);
app.delete('/transacao/:id_transacao', rotasTransacoes.deletarTransacao);


const porta = 3000;
app.listen(porta, () => {
    console.log(`Api http://localhost:${porta}`)
})