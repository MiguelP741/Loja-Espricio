const express = require("express");
const router = express.Router();
const { clienteController } = require("../controllers/clienteController");

//GET /cliente -> Lista todos os clientes
router.get("/clientes", clienteController.listarClientes);

//POST /cliente -> Cadastra um cliente
router.post("/clientes", clienteController.criarCliente);

module.exports = {clienteRoutes: router}