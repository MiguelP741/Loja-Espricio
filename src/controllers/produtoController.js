const {produtoModel} = require("../models/produtoModel");

const produtoController = {
    // ---------------------
    //listar todos os produtos
    //GET /produtos
    //----------------------

    listarProdutos: async (req, res)=>{
        try {
            const produtos = await produtoModel.buscarTodos();

            res.status(200).json(produtos);
        } catch (error) {
            console.error('Erro ao lsitar produtos:', error);
            res.status(500).json({message: 'Erro ao buscar produtos.'});
        }
    }
}

module.exports = {produtoController};