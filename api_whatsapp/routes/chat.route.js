const { Router } = require("express");
const conn = require("../db/connection.js");

const router = Router();

// Enviar mensagem
router.post("/chat", async (req, res) => {
    const { telefone, senha_hash } = req.query;
    const { telefone: telefone_destino, mensagem } = req.body;

    if (!telefone || !senha_hash || !telefone_destino || !mensagem) {
        return res.status(400).json({
            mensagem: "Preencha todos os campos"
        });
    }

    try {
        await conn.query(
            `INSERT INTO mensagens
            (telefone_remetente, telefone_destino, mensagem)
            VALUES (?, ?, ?)`,
            [telefone, telefone_destino, mensagem]
        );

        res.json({
            mensagem: "Mensagem enviada com sucesso"
        });
    } catch (erro) {
        console.log(erro);

        res.status(500).json({
            mensagem: "Erro ao enviar mensagem"
        });
    }
});

// Buscar conversa entre dois telefones
router.get("/chat", async (req, res) => {
    const { telefone, telefone_destino } = req.query;

    if (!telefone || !telefone_destino) {
        return res.status(400).json({
            mensagem: "Informe o telefone do usuário e do contato"
        });
    }

    try {
        const [mensagens] = await conn.query(
            `SELECT *
             FROM mensagens
             WHERE (telefone_remetente = ? AND telefone_destino = ?)
                OR (telefone_remetente = ? AND telefone_destino = ?)
             ORDER BY data_envio ASC`,
            [telefone, telefone_destino, telefone_destino, telefone]
        );

        res.json(mensagens);
    } catch (erro) {
        console.log(erro);

        res.status(500).json({
            mensagem: "Erro ao buscar mensagens"
        });
    }
});

module.exports = router;