import { BD } from "../db.js";

class rotasSubcategorias {
    static async novaSubCategoria(req, res) {
        const { nome, id_categoria, gasto_fixo } = req.body;

        // // Validação opcional (boa prática)
        // if (!nome || !tipo_transacao || !gasto_fixo || !id_usuario) {
        //     return res.status(400).json({ error: "Todos os campos são obrigatórios" });
        // }

        try {
            const subcategorias = await BD.query(`INSERT INTO subcategorias
                 (nome, id_categoria, gasto_fixo) VALUES ($1, $2, $3) RETURNING *`,
                 [nome, id_categoria, gasto_fixo]);
            return res.status(201).json(subcategorias.rows[0]);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao criar SubCategoria", message: error.message });
        }
    }
    static async listarSubcategorias(req, res) {    
        try {
            const subcategorias = await BD.query(`select s.nome, c.nome as nome_categoria, s.gasto_fixo, s.ativo from subcategorias s
join categorias c on s.id_categoria = c.id_categoria`);
            return res.status(200).json(subcategorias.rows); //Retorna lista de usuarios
        } catch(error){
            return res.status(500).json({error: "Erro ao listar subresenhas", error: error.message});
        }
    }
    static async deletarSubcategoria(req, res) {
        const { id } = req.params;
        try {
            const query = `UPDATE subcategorias SET ativo = false WHERE id_subcategoria = $1`;
            const valores = [id];
            // Executar a query
            const subcategoria = await BD.query(query, valores)
            return res.status(200).json(subcategoria.rows[0])
        } catch(error){
            return res.status(500).json({error: "Erro ao atualizar dados da subcategoria", error: error.message});
        }
    }
    static async atualizartodosCampos(req, res) {
        const { id } = req.params;
        const { nome, id_categoria, gasto_fixo } = req.body;
        try {
            const subcategoria = await BD.query(`
                UPDATE subcategorias SET nome = $1, id_categoria = $2, gasto_fixo = $3 where id_subcategoria = $4`,
                [nome, id_categoria, gasto_fixo, id])
            const subcategoriaAtualizada = await BD.query(`
                SELECT * FROM subcategorias WHERE id_subcategoria = $1`, [id])
            return res.status(200).json(subcategoriaAtualizada)
    } catch(error){
        return res.status(500).json({error: "Erro ao atualizar dados da subcategoria", error: error.message});
    }
    }
    static async ListarporID(req, res) {
        const { id } = req.params;
        try {
            const subcategoria = await BD.query(`SELECT * FROM subcategorias WHERE id_subcategoria = $1`, [id]);
            // Verifica se a subcategoria foi encontrada
            if (subcategoria.rows.length === 0) {
                return res.status(404).json({ message: "Subcategoria não encontrada" });
            }
            return res.status(200).json(subcategoria.rows[0]); // Retorna a subcategoria encontrada
        } catch (error) {
            return res.status(500).json({ error: "Erro ao listar subcategoria", error: error.message });
        }
    }
    static async Atualizar(req, res){
        const { id } = req.params;
        const { nome, id_categoria, gasto_fixo } = req.body;
        try {
            // Inicializar arrays(vetores) para armazenar os campos e valores a serem atualizados
            const campos = []
            const valores = []
            // Verifica quais campos foram fornecidos
            if(nome !== undefined){
                campos.push(`nome = $${valores.length + 1}`)
                valores.push(nome)
            }
            if(id_categoria!== undefined){
                campos.push(`id_categoria = $${valores.length + 1}`)
                valores.push(id_categoria)
            }
            if(gasto_fixo!== undefined){
                campos.push(`gasto_fixo = $${valores.length + 1}`)
                valores.push(gasto_fixo)
            }
            if (campos.length === 0){
                return res.status(400).json({erro: "Informe os campos a serem atualizados"})
            }
           
            // Montar a query
            const query = `UPDATE subcategorias SET ${campos.join(',')}
            WHERE id_subcategoria = ${id} returning *`
           
            // Executar a query
            const subcategoria = await BD.query(query, valores)
   
            // Verifica se o usuario foi atualizado
            if(subcategoria.rows.length === 0){
                return res.status(404).json({erro: "subcategoria não encontrada"})
            }
            return res.status(200).json(subcategoria.rows[0])
        } catch(error){
            return res.status(500).json({error: "Erro ao atualizar dados da subcategoria", error: error.message});
        }
    }
}

export default rotasSubcategorias;