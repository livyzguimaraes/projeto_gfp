import { BD } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY = "secret-key"; // Chave secreta para assinar o token JWT
class rotasUsuarios{
    static async Novousuario(req, res){
        const {nome, email, senha, tipo_acesso} = req.body;

        const saltRounds = 10;
        const senhaCriptografada = await bcrypt.hash(senha, saltRounds);
        try {
            // const usuario = await BD.query(`
            //     INSERT INTO usuarios (nome, email, senha, tipo_acesso)
            //     VALUES ($1, $2, $3, $4)`,
            //     [nome, email, senhaCriptografada, tipo_acesso]);

            const query = `INSERT INTO usuarios (nome, email, senha, tipo_acesso)
                            VALUES ($1, $2, $3, $4) RETURNING *`;
            const valores = [nome, email, senhaCriptografada, tipo_acesso];
            const resposta = await BD.query(query, valores);
           res.status(201).json("Usuário cadastrado com sucesso");
        } catch (error) {
            console.error("Erro ao cadastrar usuário:", error);
            return res.status(500).json({ error: "Erro ao cadastrar usuário" });
        }
    }
    static async Listar(req, res){
        try {
        const usuarios = await BD.query(`SELECT * FROM usuarios where ativo = true`);
        return res.json(usuarios.rows);
        }catch (error) {
            console.error("Erro ao listar usuários:", error);
        }
    }
    static async ListarporID(req, res){
        const {id} = req.params;
        try {
            const usuario = await BD.query(`SELECT * FROM usuarios WHERE id_usuario = $1`, [id]);
            return res.json(usuario.rows[0]);
        }catch (error) {
            console.error("Erro ao listar usuário:", error);
        }
    }
    static async AtualizartodosCampos(req, res){
        const id = req.params.id;
        const {nome, email, senha, tipo_acesso} = req.body;
        try {
            const usuario = await BD.query(`UPDATE usuarios SET nome = $1, email = $2, senha = $3, tipo_acesso = $4 WHERE id_usuario = $5`,
            [nome, email, senha, tipo_acesso, id]);
            return res.json(usuario.rows[0]);
        }catch (error) {
            console.error("Erro ao atualizar usuário:", error);
        }
    }
    static async Deletar(req, res){
        const { id } = req.params;
        try {
            const query = `UPDATE usuarios SET ativo = false WHERE id_usuario = $1`;
            const valores = [id];
            // Executar a query
            const usuario = await BD.query(query, valores)
            return res.status(200).json(usuario.rows[0])
        } catch(error){
            return res.status(500).json({error: "Erro ao atualizar dados do usuário", error: error.message});
        }
    }
    static async Atualizar(req, res){
        const { id } = req.params;
        const {nome, email, senha, tipo_acesso} = req.body;
        try {
            // Inicializar arrays(vetores) para armazenar os campos e valores a serem atualizados
            const campos = []
            const valores = []
            // Verifica quais campos foram fornecidos
            if(nome !== undefined){
                campos.push(`nome = $${valores.length + 1}`)
                valores.push(nome)
            }
            if(email!== undefined){
                campos.push(`email = $${valores.length + 1}`)
                valores.push(email)
            }
            if(senha!== undefined){
                campos.push(`senha = $${valores.length + 1}`)
                valores.push(senha)
            }
            if(tipo_acesso!== undefined){
                campos.push(`tipo_acesso = $${valores.length + 1}`)
                valores.push(tipo_acesso)
            }
            if (campos.length === 0){
                return res.status(400).json({erro: "Informe os campos a serem atualizados"})
            }
           
            // Montar a query
            const query = `UPDATE usuarios SET ${campos.join(',')}
            WHERE id_usuario = ${id} returning *`
           
            // Executar a query
            const usuario = await BD.query(query, valores)

            // Verifica se o usuario foi atualizado
            if(usuario.rows.length === 0){
                return res.status(404).json({erro: "Usuário não encontrado"})
            }
            return res.status(200).json(usuario.rows[0])
        } catch(error){
            return res.status(500).json({error: "Erro ao atualizar dados do usuário", error: error.message});
        }
    }
    static async Login(req,res){
        const { email, senha } = req.body;
        try {
            const usuario = await BD.query(`SELECT * FROM usuarios WHERE email = $1`, [email]);
            if (usuario.rows.length === 0) {
                return res.status(401).json({ error: "Usuário não encontrado" });
            }
            const usuarioEncontrado = usuario.rows[0];
            const senhaCorreta = await bcrypt.compare(senha, usuarioEncontrado.senha);
            if (!senhaCorreta) {
                return res.status(401).json({ error: "Senha incorreta" });
            }

            //gerar um token JWT para o usuário
            const token = jwt.sign(
                //payload
                {id: usuario.id_usuario, nome: usuario.nome, email: usuario.email},
                //signature
                SECRET_KEY,
                {expiresIn: '1h'}
            )

            return res.status(200).json({message: 'Login executado com sucesso', token});
            // return res.status(200).json({ message: "Login bem-sucedido" })

        } catch (error) {
            console.error("Erro ao fazer login:", error);
            res.status(500).json({ error: "Erro ao fazer login" });
        }
    }
}

// middleware(função) para proteger rotas privadas
export function autenticarToken(req, res, next){
    // Extrair do token o cabeçalho da requisição
    // const token = req.headers.authorization?.replace('Bearer ', '')
    const token = req.headers['Authorization']

    // Verificar se o token foi fornecido
    if(!token) return res.status(401).json({error: "Token não fornecido"})

    // Verificar a validade do token
    // jwt.verify que verifica se o token é legitimo
    jwt.verify(token.split(' ')[1], SECRET_KEY, (error, usuario) => {
        if(error) return res.status(error).json({error: "Token Invalido"})

        // Se o token for válido, adiciona os dados do usuario(decodificados no token)
        // Tornando essas informações disponiveis nas rotas que precisam de autenticação
        req.usuario = usuario
        next()
    })
   
}

export default rotasUsuarios;
