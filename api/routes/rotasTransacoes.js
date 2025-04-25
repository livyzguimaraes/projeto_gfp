import { BD } from "../db.js";


class RotasTransacoes {
    static async criarTransacao(req, res) {
        const {valor, descricao, data_transacao, data_vencimento, data_pagamento, tipo_transacao, id_local_transacao, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual} = req.body;
        try{
            const transacao = await BD.query(`
                INSERT INTO transacoes
                (valor, descricao, data_transacao, data_vencimento, data_pagamento, tipo_transacao,
                id_local_transacao, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
            [valor, descricao, data_transacao, data_vencimento, data_pagamento, tipo_transacao, id_local_transacao, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual]);
            return res.status(201).json(transacao[0]);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao criar transação", message: error.message });
        }
    }  
    static async listarTransacoes(req, res) {
        try {
            const transacoes = await BD.query(`
                select t.valor as valor_transacao, t.descricao, t.data_transacao, t.data_vencimento,
                t.tipo_transacao, l.nome as nome_local_transacao, c.nome as nome_categoria, s.nome as nome_subcategoria,
                u.nome as nome_usuario from transacoes t
                join local_transacao l on t.id_local_transacao = l.id_local_transacao
                join categorias c on t.id_categoria = c.id_categoria
                join subcategorias s on t.id_subcategoria = s.id_subcategoria
                join usuarios u on t.id_usuario = u.id_usuario`);
            return res.status(200).json(transacoes.rows); // Retorna lista de transações
        }
        catch (error) {
            return res.status(500).json({ error: "Erro ao listar transações", message: error.message });
        }
    }
    static async atualizarTodosCampos(req, res) {
        const { id } = req.params;
        const { valor, descricao, data_transacao, data_vencimento, data_pagamento, tipo_transacao, id_local_transacao, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual } = req.body;
        try{
            const transacao = await BD.query(`UPDATE transacoes SET valor = $1, descricao = $2, data_transacao = $3, data_vencimento = $4,
                data_pagamento = $5, tipo_transacao = $6, id_local_transacao = $7, id_categoria = $8,
                id_subcategoria = $9, id_usuario = $10, num_parcelas = $11, parcela_atual = $12 WHERE id_transacao = $13 RETURNING *`,
                [valor, descricao, data_transacao, data_vencimento, data_pagamento, tipo_transacao, id_local_transacao, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual, id]);
                return res.status(200).json(transacao[0]);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao atualizar transação", message: error.message });
        }
    }
    static async AtualizarTransacao(req, res) {
        const { id } = req.params;
        const {valor, descricao, data_transacao, data_vencimento, data_pagamento, tipo_transacao, id_local_transacao, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual} = req.body;
    try {
        // Inicializar arrays(vetores) para armazenar os campos e valores a serem atualizados
        const campos = []
        const valores = []
        // Verifica quais campos foram fornecidos
        if(valor !== undefined){
            campos.push(`valor = $${valores.length + 1}`)
            valores.push(valor)
        }
        if(descricao!== undefined){
            campos.push(`descricao = $${valores.length + 1}`)
            valores.push(descricao)
        }
        if(data_transacao!== undefined){
            campos.push(`data_transacao = $${valores.length + 1}`)
            valores.push(data_transacao)
        }
        if(data_vencimento!== undefined){
            campos.push(`data_vencimento = $${valores.length + 1}`)
            valores.push(data_vencimento)
        }
        if(data_pagamento!== undefined){
            campos.push(`data_pagamento = $${valores.length + 1}`)
            valores.push(data_pagamento)
        }
        if(tipo_transacao!== undefined){
            campos.push(`tipo_transacao = $${valores.length + 1}`)
            valores.push(tipo_transacao)
            }
        if(id_local_transacao!== undefined){
            campos.push(`id_local_transacao = $${valores.length + 1}`)
            valores.push(id_local_transacao)
        }
        if(id_categoria!== undefined){
            campos.push(`id_categoria = $${valores.length + 1}`)
            valores.push(id_categoria)
        }
        if(id_subcategoria!== undefined){
            campos.push(`id_subcategoria = $${valores.length + 1}`)
            valores.push(id_subcategoria)
        }
        if (campos.length === 0){
            return res.status(400).json({erro: "Informe os campos a serem atualizados"})
        }
        if (id_usuario !== undefined){
            campos.push(`id_usuario = $${valores.length + 1}`)
            valores.push(id_usuario)
        }
        if (num_parcelas !== undefined){
            campos.push(`num_parcelas = $${valores.length + 1}`)
            valores.push(num_parcelas)
        }
        if (valor_parcela !== undefined){
            campos.push(`valor_parcela = $${valores.length + 1}`)
            valores.push(valor_parcela)
       
        // Montar a query
        const query = `UPDATE local_transacao SET ${campos.join(',')}
        WHERE id_local_transacao = ${id} returning *`
       
        // Executar a query
        const transacao = await BD.query(query, valores)

        // Verifica se a transacao foi atualizada
        if(transacao.rows.length === 0){
            return res.status(404).json({erro: "transacao não encontrada"})
        }
        return res.status(200).json(transacao.rows[0])
    }
    } catch(error){
        return res.status(500).json({error: "Erro ao atualizar dados da transacao", error: error.message});
    }
}
    static async deletarTransacao(req, res) {
        const { id } = req.params;
        try {
            const transacao = await BD.query(`update transacoes set ativo = false WHERE id_transacao = $1 RETURNING *`, [id]);
            if(transacao.rows.length === 0){
                return res.status(404).json({erro: "transacao não encontrada"})
                }
                return res.status(200).json(transacao.rows[0]) // Retorna a transacao deletada
                } catch (error) {
                    return res.status(500).json({ error: "Erro ao deletar transacao", message: error.message });
                }
                }
    static async listarporId(req, res) {
        const { id } = req.params;
        try{
            const transacoes = await BD.query(`
                select t.valor as valor_transacao, t.descricao, t.data_transacao, t.data_vencimento,
                t.tipo_transacao, l.nome as nome_local_transacao, c.nome as nome_categoria, s.nome as nome_subcategoria,
                u.nome as nome_usuario from transacoes t
                join local_transacao l on t.id_local_transacao = l.id_local_transacao
                join categorias c on t.id_categoria = c.id_categoria
                join subcategorias s on t.id_subcategoria = s.id_subcategoria
                join usuarios u on t.id_usuario = u.id_usuario where id_transacao = $1`, [id]);
        } catch(error){
            return res.status(500).json({error: "Erro ao listar transacao", message: error.message});
        }
    }
}

export default RotasTransacoes;
