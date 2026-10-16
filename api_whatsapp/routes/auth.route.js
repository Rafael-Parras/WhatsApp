const { Router } = require("express");
const conn = require("../db/connection.js");

const router = Router();

router.post("/auth", async (req, res) => {
    const { telefone, senha } = req.query;

    if (!telefone || !senha) {
        return res.status(400).json({
            mensagem: "Informe telefone e senha"
        });
    }

    try {
        const [usuarios] = await conn.query(
            "SELECT * FROM utilizadores WHERE telefone = ? AND senha = ?",
            [telefone, senha]
        );

        if (usuarios.length === 0) {
            return res.status(401).json({
                mensagem: "Telefone ou senha incorretos"
            });
        }

        res.json({
            mensagem: "Autenticado com sucesso"
        });

    } catch (erro) {
        console.log(erro);
        res.status(500).json({
            mensagem: "Erro ao autenticar usuario"
        });
    }
});

module.exports = router;