const { sql, getConnection } = require("../config/db");

const clienteModel = {
    buscarTodos: async ()=>{
        try {

         const pool = await getConnection(); // Cria conexão com o BD

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
    buscarUm: async (idCliente) =>{
        try {
            const pool = await getConnection();

            const querySQL = 'SELECT * FROM Clientes WHERE idCliente = @idCliente';

            const result = await pool
                .request()
                .input('idCliente', sql.UniqueIdentifier, idCliente)
                .query(querySQL);

                return result.recordset;
        } catch (error) {
            console.error('Erro ao buscar cliente', error);
            throw error;
        }
    },
    buscarPorCpf: async (cpfCliente) => {
        try {
            const pool = await getConnection();

            const querySQL = 'SELECT * FROM Clientes WHERE cpfCliente = @cpfCliente;';

            const result = await pool.request()
            .input ('cpfCliente', sql.Char(14), cpfCliente)
            .query(querySQL);

            return result.recordset;

        } catch (error) {
            console.error('Erro ao verificar o CPF', error);
            throw error;
        }
    }
}

module.exports = { clienteModel }