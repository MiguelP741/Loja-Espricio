const { sql, getConnection } = require("../config/db");

const clienteModel = {
    buscarTodos: async () => {
        try {

            const pool = await getConnection();//cria conexão com o bd

            let sql = 'SELECT * FROM Clientes';

            const result = await pool.request().query(sql);

            return result.recordset;

        } catch (error) {
            console.error('Erro ao procurar cliente', error);
            throw error;// passa o erro para o controller tratar
        }
    },


    inserirCliente: async (nomeCliente, cpfCliente) => {
        try {

            const pool = await getConnection();

            let querySQL = 'INSERT INTO Clientes(nomeCliente, cpfCliente) VALUES (@nomeCliente, @cpfCliente)';
            await pool.request()
                .input('nomeCliente', sql.VarChar(100), nomeCliente)
                .input('cpfCliente', sql.VarChar(14), cpfCliente)
                .query(querySQL);

        } catch (error) {
            console.error('Erro ao inserir cliente:', error);
            throw error;// passa o erro para o controller tratar
        }
    },
    verificarCpf: async (cpfCliente) => {
        try {
            const pool = await getConnection();

            const querySQL = 'SELECT * FROM Clientes WHERE cpfCliente = @cpfCliente;';

            const result = await pool.request()
            .input ('cpfCliente', sql.VarChar(14), cpfCliente)
            .query(querySQL);

            return result.recordset;
        } catch (error) {
            console.error('ERRO ao buscar cliente', error)
            throw error;
        }
    }
}

module.exports = { clienteModel }