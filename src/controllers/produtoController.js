const { produtoModel } = require("../models/produtoModel");

const produtoController = {
    // ---------------------
    //listar todos os produtos
    //GET /produtos
    //----------------------

    listarProdutos: async (req, res) => {
        try {
            const { idProduto } = req.query
            const produtos = await produtoModel.buscarTodos();

            if (idProduto) {
                if (idProduto.length != 36) {
                    return res.status(404).json({ erro: "ID inválido!" })
                }

            const umProduto = await produtoModel.buscarUm(idProduto);

            return res.status(200).json(umProduto);
            }

            res.status(200).json(produtos);

        } catch (error) {
            console.error('Erro ao listar produtos:', error);
            res.status(500).json({ erro: 'Erro ao buscar produtos.' });
        }
    },

    //---------------------
    //CRIAR UM NOVO PRODUTO
    // POST /produtos
    /*
        {
        "nomeProduto": "valor",
        "precoProduto": 0.00
        }
    */
    //---------------------


    criarProduto: async (req, res) => {
        try {

            const { nomeProduto, precoProduto } = req.body;

            if (nomeProduto == undefined || precoProduto == undefined || isNaN(precoProduto) || precoProduto <= 0) {
                return res.status(400).json({ erro: 'Campos obrigatórios não preenchidos ou preço inválido!' });
            }

            await produtoModel.inserirProduto(nomeProduto, precoProduto);

            res.status(201).json({ message: 'Produto cadastrado com sucesso!' });

        } catch (error) {

            console.error('Erro ao cadastrar produto:', error);
            res.status(500).json({ erro: 'Erro no servidor ao cadastrar produto!' });
        }
    },

    //---------------------
    //ATUALIZAR UM NOVO PRODUTO
    // PUT /produtos/idProduto são opcionais
    /*
        {
        "nomeProduto": "valor",
        "precoProduto": 0.00
        }
    */
    //---------------------

    atualizarProduto: async (req, res) => {
        try {
            const { idProduto } = req.params;
            const { nomeProduto, precoProduto } = req.body;
            if (idProduto.length != 36) {
                return res.status(400).json({ erro: 'id do produto invalido' })
            }

            const produto = await produtoModel.buscarUm(idProduto);

            if (!produto || produto.length != 1) {
                return res.status(404).json({ erro: 'Produto não encontrado!' })
            }

            const produtoAtual = produto[0];

            const nomeAtualizado = nomeProduto ?? produtoAtual.nomeProduto;
            const precoAtualizado = precoProduto ?? produtoAtual.precoProduto;

            if (precoAtualizado <= 0 || isNaN(precoAtualizado)) {
                return res.status(400).json({ erro: 'Preço do produto deve ser um número positivo!' });
            }

            await produtoModel.atualizarProdutos(idProduto, nomeAtualizado, precoAtualizado)

            res.status(200).json({ message: 'Produto atualizado com sucesso!' });
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            res.status(500).json({ erro: "Erro no servidor ao atualizar produto." });
        }
    },
    deletarProduto: async (req, res) => {
        try {
            const { idProduto } = req.params;

            if (idProduto.length != 36) {
                return res.status(400).json({ erro: 'id do produto invalido' })
            }

            const produto = await produtoModel.buscarUm(idProduto);

            if (!produto || produto.length != 1) {
                return res.status(404).json({ erro: 'Produto não encontrado!' })
            }
            await produtoModel.deletarProduto(idProduto);

            res.status(200).json({ message: "Produto deletado com sucesso!" });
        } catch (error) {
            console.error('Erro ao deletar produto:', error);
            res.status(500).json({ erro: "Erro no servidor ao deletar produto." });
        }
    }
}

module.exports = { produtoController };       