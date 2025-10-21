const express = require("express");
const router = express.Router();
const { produtoController } = require("../controllers/produtoController");

//GET /produtos -> Lista todos os produtos
router.get("/produtos", produtoController.listarProdutos);

// POST /produtos -> Criar um novo produto
router.post("/produtos", produtoController.criarProduto);

// PUT /produtos/idProduto -> Atualizar um produto
router.put("/produtos/:idProduto", produtoController.atualizarProduto);

// DELETE /produtos/idProduto -> Deletar um produto
router.delete("/produtos/:idProduto", produtoController.deletarProduto)

module.exports = {produtoRoutes: router};
