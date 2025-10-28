const { sql, getConnection } = require("../config/db");

const pedidoModel = {
    /**
     * Busca todos os pedidos e seus respectivos itens no banco de dados.
     * 
     * @async
     * @function buscarTodos
     * @returns {Promise<Array>} Retorna uma lista com todos os pedidos e seus respectivos itens.
     * @throws Mostra no console e propaga o erro caso a busca falhe.
     */
    buscarTodos: async () => {
        try {

            const pool = await getConnection();

            const querySQL = `
                SELECT 
	                CL.nomeCliente, 
	                PD.dataPedido, 
	                PD.statusPagamento,
	                PR.nomeProduto,
	                IT.qtdItem
                FROM Pedidos PD 
	                INNER JOIN Clientes CL 
	                ON CL.idCliente = PD.idCliente
	                INNER JOIN ItemPedido IT
	                ON IT.idPedido = PD.idPedido
	                INNER JOIN Produtos PR
	                ON PR.idProduto = IT.idProduto
            `;

            const result = await pool.request().query(querySQL);

            return result.recordset;
        } catch (error) {
            console.error("Erro ao buscar pedidos:", error);
            throw error;
        }
    },

    inserirPedido: async (idCliente, dataPedido, statusPagamento, { itens }) => {
        // {itens} realiza a desestruturação do objeto itens

        const pool = await getConnection();

        const transaction = new sql.Transaction(pool);
        await transaction.begin(); //Inicia a transação

        try {
            let querySQL = `
                INSERT INTO Pedidos (idCliente, dataPedido, statusPagamento)
                OUTPUT INSERTED.idPedido
                VALUES (@idCliente, @dataPedido, @statusPagamento)
            `

            const result = await transaction.request().input("idCliente", sql.UniqueIdentifier, idCliente)
                .input("dataPedido", sql.Date, dataPedido)
                .input("statusPagamento", sql.Bit, statusPagamento)
                .query(querySQL)

            const idPedido = result.recordset[0].idPedido;

            for (const item of itens) {
                const {idProduto, qtdItem} = item;

                querySQL = `
                    INSERT INTO ItemPedido (idPedido, idProduto, qtdItem)
                    VALUES (@idPedido, @idProduto, @qtdItem)
                `

                await transaction.request()
                    .input("idPedido", sql.UniqueIdentifier, idPedido)
                    .input("idProduto", sql.UniqueIdentifier, idProduto)
                    .input("qtdItem", sql.Int, qtdItem)
                    .query(querySQL)

            }

            await transaction.commit(); // Confirma a transação após inserções bem-sucedidas

            return idPedido; // Retorna o ID do pedido inserido

        } catch (error) {
            await transaction.rollback(); // Desfaz tudo caso dê erro
            console.error("Erro ao inserir pedido:", error);
            throw error;
        }
    }
};

module.exports = { pedidoModel }