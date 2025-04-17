import express from 'express';
import { testarConexao } from './db.js';
import cors from 'cors';
import rotasUsuarios from './routes/rotasUsuarios.js';
import rotasCategorias from './routes/rotasCategorias.js';
import rotasSubcategorias from './routes/rotasSubcategorias.js';
import rotasLocalTransacoes from './routes/rotasLocalTransacoes.js';

const app = express();
testarConexao();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("API funcionando!")
})

// Rotas usuarios
app.post('/usuarios', rotasUsuarios.Novousuario)
app.get('/usuarios',rotasUsuarios.Listar)
app.get('/usuarios/:id', rotasUsuarios.ListarporID)
app.put('/usuarios/:id', rotasUsuarios.AtualizartodosCampos)
app.delete('/usuarios/:id',  rotasUsuarios.Deletar)
app.patch('/usuarios/:id', rotasUsuarios.Atualizar)
app.post('/login', rotasUsuarios.Login)


// Rotas categorias
app.post('/categorias', rotasCategorias.novaCategoria)
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

//Rotas local Transacao
app.post('/localTransacao', rotasLocalTransacoes.NovasLocalTransacao);
app.get('/localTransacao', rotasLocalTransacoes.ListarTodas);
app.get('/localTransacao/:id_localTransacao', rotasLocalTransacoes.BuscarId);
app.patch('/localTransacao/:id_localTransacao', rotasLocalTransacoes.AtualizarLocalTransacao);
app.put('/localTransacao/:id_localTransacao', rotasLocalTransacoes.atualizarTodosCampos);
app.delete('/localTransacao/:id_localTransacao', rotasLocalTransacoes.deletar);

// // Rotas Transacoes
// app.post('/transacao', rotasTransacoes.nova);
// app.get('/transacao', rotasTransacoes.listar);
// app.get('/transacao/:id_transacao', rotasTransacoes.listarPorId);
// app.patch('/transacao/:id_transacao', rotasTransacoes.atualizar);
// app.put('/transacao/:id_transacao', rotasTransacoes.atualizarTodos);
// app.delete('/transacao/:id_transacao', rotasTransacoes.deletar);


const porta = 3000;
app.listen(porta, () => {
    console.log(`Api http://localhost:${porta}`)
})