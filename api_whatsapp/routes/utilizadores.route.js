const { Router } = require("express");
const conn = require("../db/connection.js");

const router = Router();

// Listar os contatos cadastrados
router.get("/utilizadores", async (req, res) => {
    try {
        const [usuarios] = await conn.query(
            "SELECT id, apelido, telefone FROM utilizadores ORDER BY apelido ASC"
        );

        res.json(usuarios);
    } catch (erro) {
        console.log(erro);

        res.status(500).json({
            mensagem: "Erro ao buscar contatos."
        });
    }
});

// Verifica se o telefone já está cadastrado
router.get("/verificar-telefone", async (req, res) => {
    const telefone = req.query.telefone;

    if (!telefone) {
        return res.status(400).json({
            mensagem: "Informe o telefone."
        });
    }

    try {
        const [usuarios] = await conn.query(
            "SELECT id FROM utilizadores WHERE telefone = ?",
            [telefone]
        );

        res.json({
            cadastrado: usuarios.length > 0
        });
    } catch (erro) {
        console.log(erro);

        res.status(500).json({
            mensagem: "Erro ao verificar telefone."
        });
    }
});

// Busca o apelido de um usuário pelo telefone
router.get("/utilizador", async (req, res) => {
    const telefone = req.query.telefone;

    if (!telefone) {
        return res.status(400).json({
            mensagem: "Informe o telefone."
        });
    }

    try {
        const [usuarios] = await conn.query(
            "SELECT apelido, telefone FROM utilizadores WHERE telefone = ?",
            [telefone]
        );

        if (usuarios.length === 0) {
            return res.status(404).json({
                mensagem: "Usuário não encontrado."
            });
        }

        res.json(usuarios[0]);
    } catch (erro) {
        console.log(erro);

        res.status(500).json({
            mensagem: "Erro ao buscar usuário."
        });
    }
});

// Cadastro de usuário
router.post("/registrar", async (req, res) => {
    const { apelido, telefone, senha } = req.body;

    if (!apelido || !telefone || !senha) {
        return res.status(400).json({
            mensagem: "Preencha todos os campos."
        });
    }

    try {
        const [existentes] = await conn.query(
            "SELECT id FROM utilizadores WHERE telefone = ?",
            [telefone]
        );

        if (existentes.length > 0) {
            return res.status(409).json({
                mensagem: "Esse telefone já está cadastrado."
            });
        }

        await conn.query(
            "INSERT INTO utilizadores (apelido, telefone, senha) VALUES (?, ?, ?)",
            [apelido, telefone, senha]
        );

        res.status(201).json({
            mensagem: "Usuário registrado com sucesso."
        });
    } catch (erro) {
        console.log(erro);

        res.status(500).json({
            mensagem: "Erro ao registrar usuário."
        });
    }
});

module.exports = router;
