const { clienteModel } = require("../models/clienteModel");

const clienteController = {
    // ---------------------
    //listar todos os produtos
    //GET /produtos
    //----------------------

    listarClientes: async (req, res) => {
        try {
            const { idCliente } = req.query;

            if (idCliente) {
                if (idCliente.length != 36) {
                    return res.status(400).json({ erro: "id do cliente inválido" })
                }
                const cliente = await clienteModel.buscarUm(idCliente);

                res.status(200).json(cliente);
            }

            const clientes = await clienteModel.buscarTodos();

            res.status(200).json(clientes);
        } catch (error) {
            console.error('Erro ao listar clientes:', error);
            res.status(500).json({ erro: 'Erro ao buscar cliente.' });
        }
    },

    criarCliente: async (req, res) => {
        try {

            const { nomeCliente, cpfCliente } = req.body;

            if (nomeCliente == undefined || cpfCliente == undefined) {
                return res.status(400).json({ erro: 'Campos obrigatórios não preenchidos!' });
            }

            const result = await clienteModel.buscarPorCpf(cpfCliente);

            if (result.length > 0) {
                return res.status(409).json({ erro: "CPF já existente!" });
            }

            await clienteModel.inserirCliente(nomeCliente, cpfCliente);

            res.status(201).json({ message: 'Sua conta foi cadastrada com sucesso!' });

        } catch (error) {

            console.error('Erro ao cadastrar cliente:', error);
            res.status(500).json({ erro: 'Erro no servidor ao cadastrar cliente!' });
        }
    }
}


module.exports = { clienteController };