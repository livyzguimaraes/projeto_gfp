import { BD } from "../db.js";

class rotasCategorias {
    static async novaCategoria(req, res) {
        const { nome, tipo_transacao, gasto_fixo, id_usuario } = req.body;

        // // Validação opcional (boa prática)
        // if (!nome || !tipo_transacao || !gasto_fixo || !id_usuario) {
        //     return res.status(400).json({ error: "Todos os campos são obrigatórios" });
        // }

        try {
            const categorias = await BD.query(`INSERT INTO categorias
                 (nome, tipo_transacao, gasto_fixo, id_usuario) VALUES ($1, $2, $3, $4) RETURNING *`,
                 [nome, tipo_transacao, gasto_fixo, id_usuario]);
            return res.status(201).json(categorias.rows[0]);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao criar Categoria", message: error.message });
        }
    }

    //filtrar por tipo de categoria
    static async filtrarCategoria(req, res) {
        // o valor sera enviado por parametro na url, deve ser enviado dessa maneira
        // ?tipo_transacao=entrada
        const { tipo_transacao } = req.query;

        try {
            const filtros = []
            const valores = []

            if (tipo_transacao) {
                filtros.push(`tipo_transacao = $${valores.length + 1}`)
                valores.push(tipo_transacao)
            }
            const query = `
            SELECT * FROM categorias
            ${filtros.length ? `WHERE ${filtros.join(" AND ")}` : ""} and ativo = true
            ORDER BY id_categoria DESC
            `
            const resultado = await BD.query(query, valores)
        }catch (error) {

        }
    }

    static async listarTodas(req, res){
        try {
            const categorias = await BD.query(`select c.nome, c.tipo_transacao, c.gasto_fixo, c.ativo, u.nome as nome_usuario from
            categorias c join usuarios u on c.id_usuario = u.id_usuario where c.ativo = true`);
            return res.status(200).json(categorias.rows); //Retorna lista de usuarios
        } catch(error){
            return res.status(500).json({error: "Erro ao listar", error: error.message});
        }
    }
    static async Deletar(req, res){
        const { id } = req.params;
        try {
            const query = `UPDATE categorias SET ativo = false WHERE id_categoria = $1`;
            const valores = [id];
            // Executar a query
            const categoria = await BD.query(query, valores)
            return res.status(200).json(categoria.rows[0])
        } catch(error){
            return res.status(500).json({error: "Erro ao atualizar dados do usuário", error: error.message});
        }
    }
    static async atualizarTodosCampos (req, res){
        const { id } = req.params;
        const { nome, tipo_transacao, gasto_fixo, id_usuario } = req.body;
        try {
            const categoria = await BD.query(`
                UPDATE categorias SET nome = $1, tipo_transacao = $2, gasto_fixo = $3, id_usuario = $4 WHERE id_categoria = $5`
                , [nome, tipo_transacao, gasto_fixo, id_usuario, id])
            const categoriaAtualizada = await BD.query(`
                SELECT * FROM categorias WHERE id_categoria = $1`, [id])
            return res.status(200).json(categoriaAtualizada)
    } catch(error){
        return res.status(500).json({error: "Erro ao atualizar dados da categoria", error: error.message});
    }
}
static async Atualizar(req, res){
    const { id } = req.params;
    const { nome, tipo_transacao, gasto_fixo, id_usuario } = req.body;
    try {
        // Inicializar arrays(vetores) para armazenar os campos e valores a serem atualizados
        const campos = []
        const valores = []
        // Verifica quais campos foram fornecidos
        if(nome !== undefined){
            campos.push(`nome = $${valores.length + 1}`)
            valores.push(nome)
        }
        if(tipo_transacao!== undefined){
            campos.push(`tipo_transacao = $${valores.length + 1}`)
            valores.push(tipo_transacao)
        }
        if(gasto_fixo!== undefined){
            campos.push(`gasto_fixo = $${valores.length + 1}`)
            valores.push(gasto_fixo)
        }
        if(id_usuario!== undefined){
            campos.push(`id_usuario = $${valores.length + 1}`)
            valores.push(id_usuario)
        }
        if (campos.length === 0){
            return res.status(400).json({erro: "Informe os campos a serem atualizados"})
        }
       
        // Montar a query
        const query = `UPDATE categorias SET ${campos.join(',')}
        WHERE id_categoria = ${id} returning *`
       
        // Executar a query
        const categoria = await BD.query(query, valores)

        // Verifica se o usuario foi atualizado
        if(categoria.rows.length === 0){
            return res.status(404).json({erro: "Categoria não encontrada"})
        }
        return res.status(200).json(categoria.rows[0])
    } catch(error){
        return res.status(500).json({error: "Erro ao atualizar dados da categoria", error: error.message});
    }
}  
    static async ListarporID(req, res) {
        const { id } = req.params;
        try {
            const categoria = await BD.query(`SELECT * FROM categorias WHERE ativo = true AND id_categoria = $1`, [id]);
            // Verifica se a categoria foi encontrada
            if (categoria.rows.length === 0) {
                return res.status(404).json({ message: "Categoria não encontrada" });
            }
            return res.status(200).json(categoria.rows[0]); // Retorna a categoria encontrada
        }
        catch (error) {
            return res.status(500).json({ error: "Erro ao listar categoria", error: error.message });
        }
}

    static async filtrarCategoria (req, res){
        const { tipo_transacao } = req.query;

        try {
            const query = `
                SELECT * FROM categorias
                WHERE tipo_transacao = $1 AND ativo = true
                ORDER BY nome DESC
            `
            const valores = [tipo_transacao]

            const resposta = await BD.query(query, valores)

            return res.status(200).json(resposta.rows)
        }catch (error) {

        }
    }
}

export default rotasCategorias;