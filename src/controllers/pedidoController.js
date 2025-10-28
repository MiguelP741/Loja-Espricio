const { pedidoModel } = require("../models/pedidoModel");
const { clienteModel } = require("../models/clienteModel");
const { produtoModel } = require("../models/produtoModel");

const pedidoController = {
    /**
     * Controlador que lista todos os pedidos do banco de dados
     *
     * @async
     * @function listarPedidos
     * @param {object} req - Objeto da requisição (recebido do cliente HTTP)
     * @param {object} res - Objeto da resposta (enviado ao cliente HTTP)
     * @returns {Promise<void>} Retorna uma resposta JSON com a lista de pedidos.
     * @throws Mostra no console e retorna erro 500 se ocorrer falha ao buscar pedidos.
     */
    listarPedidos: async (req, res) => {
        try {
            const pedidos = await pedidoModel.buscarTodos();

            res.status(200).json(pedidos);
        } catch (error) {
            console.error("Erro ao listar pedidos:", error);
            res.status(500).json({ erro: "Erro interno no servidor ao listar pedidos!" });
        }
    },

    criarPedido: async (req, res) => {
        try {

            const { idCliente, dataPedido, statusPagamento, itens } = req.body;

            if (idCliente == undefined || dataPedido == undefined || statusPagamento == undefined || itens.length < 1) {
                return res.status(400).json({ erro: "Campos obrigatórios não preenchidos!" })
            }

            if (idCliente.length != 36) {
                return res.status(400).json({ erro: "Id do Cliente inválido" });
            }

            // Validação da data
            const data = new Date(dataPedido);
            if (isNaN(data.getTime())) {
                return res.status(400).json({ erro: "Data do pedido inválida!" });
            }

            const cliente = await clienteModel.buscarUm(idCliente);

            if (!cliente || cliente.length != 1) {
                return res.status(404).json({ erro: "Cliente não encontrado!" })
            }

            for (const item of itens) {
                const { idProduto, qtdItem } = item;

                if (idProduto == undefined || qtdItem == undefined) {
                    return res.status(400).json({ erro: "Campos obrigatórios não preenchidos!" });
                }

                if (idProduto.length != 36) {
                    return res.status(400).json({ erro: "Id do produto inválido!" })
                }

                if (!Number.isInteger(qtdItem) || qtdItem <= 0) {
                    return res.status(400).json({ erro: "Quantidade do item deve ser um número inteiro positivo!" });
                }

                const produto = await produtoModel.buscarUm(idProduto);

                if (!produto || produto.length != 1) {
                    return res.status(404).json({ erro: "Produto não encontrado!" });
                }

            }

            const idPedido = await pedidoModel.inserirPedido(idCliente, dataPedido, statusPagamento, { itens });

            res.status(201).json({ message: "Pedido cadastrado com sucesso!", idPedido });

        } catch (error) {
            console.error("Erro ao cadastrar pedido:", error);
            res.status(500).json({ erro: "Erro interno no servidor ao cadastrar pedido!" });
        }
    }
}

module.exports = { pedidoController }