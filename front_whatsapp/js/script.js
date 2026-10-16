const API = "http://localhost:3001";

// Telas
const telaLogin = document.getElementById("telaLogin");
const telaCadastro = document.getElementById("telaCadastro");
const telaChat = document.getElementById("telaChat");

// Login
const formLogin = document.getElementById("formLogin");
const telefoneLogin = document.getElementById("telefoneLogin");
const senhaLogin = document.getElementById("senhaLogin");
const permanecerConectado = document.getElementById("permanecerConectado");

// Cadastro
const formCadastro = document.getElementById("formCadastro");
const apelidoCadastro = document.getElementById("apelidoCadastro");
const telefoneCadastro = document.getElementById("telefoneCadastro");
const senhaCadastro = document.getElementById("senhaCadastro");

// Contatos
const listaContatos = document.getElementById("listaContatos");
const pesquisaContato = document.getElementById("pesquisaContato");
const atualizarContatos = document.getElementById("atualizarContatos");
const sairConta = document.getElementById("sairConta");

// Conversa
const nomeContato = document.getElementById("nomeContato");
const telefoneContato = document.getElementById("telefoneContato");
const telefoneDestino = document.getElementById("telefoneDestino");
const mensagens = document.getElementById("mensagens");
const formMensagem = document.getElementById("formMensagem");
const textoMensagem = document.getElementById("textoMensagem");
const enviarMensagem = document.getElementById("enviarMensagem");

// Dados do usuário
let usuario = null;
let contatoSelecionado = null;
let contatos = [];
let intervaloMensagens = null;
let assinaturaMensagens = "";
let carregandoMensagens = false;
let numeroDaConversa = 0;

// Navegação entre telas
document.getElementById("mostrarCadastro").addEventListener("click", (evento) => {
    evento.preventDefault();

    telaLogin.classList.add("escondido");
    telaCadastro.classList.remove("escondido");
});

document.getElementById("voltarLogin").addEventListener("click", (evento) => {
    evento.preventDefault();

    telaCadastro.classList.add("escondido");
    telaLogin.classList.remove("escondido");
});

// Fazer login
formLogin.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const telefone = telefoneLogin.value.trim();
    const senha = senhaLogin.value;

    try {
        const resposta = await fetch(
            `${API}/auth?telefone=${encodeURIComponent(telefone)}&senha=${encodeURIComponent(senha)}`,
            { method: "POST" }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            alert(dados.mensagem || "Telefone ou senha incorretos.");
            return;
        }

        const respostaUsuario = await fetch(
            `${API}/utilizador?telefone=${encodeURIComponent(telefone)}`
        );

        if (!respostaUsuario.ok) {
            alert("Não foi possível carregar os dados do usuário.");
            return;
        }

        const dadosUsuario = await respostaUsuario.json();

        usuario = {
            telefone: dadosUsuario.telefone || telefone,
            apelido: dadosUsuario.apelido || telefone
        };

        if (permanecerConectado.checked) {
            localStorage.setItem("usuarioWhatsApp", JSON.stringify(usuario));
        } else {
            sessionStorage.setItem("usuarioWhatsApp", JSON.stringify(usuario));
        }

        abrirChat();
    } catch (erro) {
        console.error(erro);
        alert("Não foi possível conectar à API. Verifique se o backend está funcionando.");
    }
});

// Cadastrar usuário
formCadastro.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const novoUsuario = {
        apelido: apelidoCadastro.value.trim(),
        telefone: telefoneCadastro.value.trim(),
        senha: senhaCadastro.value
    };

    try {
        const resposta = await fetch(`${API}/registrar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(novoUsuario)
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            alert(dados.mensagem || "Não foi possível realizar o cadastro.");
            return;
        }

        alert("Cadastro realizado com sucesso!");

        telefoneLogin.value = novoUsuario.telefone;
        senhaLogin.value = "";
        formCadastro.reset();

        telaCadastro.classList.add("escondido");
        telaLogin.classList.remove("escondido");
    } catch (erro) {
        console.error(erro);
        alert("Erro ao cadastrar. Verifique se a API está funcionando.");
    }
});

// Abrir a tela principal
function abrirChat() {
    telaLogin.classList.add("escondido");
    telaCadastro.classList.add("escondido");
    telaChat.classList.remove("escondido");

    document.getElementById("nomeUsuarioLogado").textContent =
    usuario.apelido || usuario.telefone;

    document.getElementById("avatarUsuario").textContent =
    (usuario.apelido || usuario.telefone).charAt(0).toUpperCase();


    nomeContato.textContent = "Selecione uma conversa";
    telefoneContato.textContent = "";
    telefoneDestino.value = "";

    mensagens.innerHTML = `
        <p class="mensagemInicial">
            Selecione um contato para começar a conversar.
        </p>
    `;

    textoMensagem.disabled = true;
    enviarMensagem.disabled = true;

    carregarContatos();
}

// Carregar contatos cadastrados na API
async function carregarContatos() {
    listaContatos.innerHTML = "<p>Carregando contatos...</p>";

    try {
        const resposta = await fetch(`${API}/utilizadores`);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar contatos");
        }

        const dados = await resposta.json();

        // Não mostrar o próprio usuário na lista
        contatos = dados.filter(
            (contato) => contato.telefone !== usuario.telefone
        );

        mostrarContatos();
    } catch (erro) {
        console.error(erro);
        listaContatos.innerHTML = `
            <p style="padding: 15px;">
                Não foi possível carregar os contatos.
                Verifique se a API está funcionando.
            </p>
        `;
    }
}

// Mostrar contatos na tela
function mostrarContatos() {
    const pesquisa = pesquisaContato.value.trim().toLowerCase();

    const contatosFiltrados = contatos.filter((contato) => {
        return (
            String(contato.apelido || "")
                .toLowerCase()
                .includes(pesquisa) ||
            String(contato.telefone || "")
                .toLowerCase()
                .includes(pesquisa)
        );
    });

    listaContatos.innerHTML = "";

    if (contatosFiltrados.length === 0) {
        listaContatos.innerHTML = `
            <p style="padding: 15px;">
                Nenhum contato encontrado.
            </p>
        `;
        return;
    }

    contatosFiltrados.forEach((contato) => {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "contato";

        if (
            contatoSelecionado &&
            contatoSelecionado.telefone === contato.telefone
        ) {
            botao.classList.add("selecionado");
        }

        const avatar = document.createElement("div");
        avatar.className = "avatarContato";
        avatar.textContent = String(contato.apelido || "?")
            .charAt(0)
            .toUpperCase();

        const dados = document.createElement("div");
        dados.className = "dadosContato";

        const nome = document.createElement("p");
        nome.className = "nomeContatoLista";
        nome.textContent = contato.apelido || contato.telefone;

        const telefone = document.createElement("p");
        telefone.className = "telefoneContatoLista";
        telefone.textContent = contato.telefone;

        dados.appendChild(nome);
        dados.appendChild(telefone);

        botao.appendChild(avatar);
        botao.appendChild(dados);

        botao.addEventListener("click", () => {
            selecionarContato(contato);
        });

        listaContatos.appendChild(botao);
    });
}

// Selecionar um contato
function selecionarContato(contato) {
    contatoSelecionado = contato;
    telefoneDestino.value = contato.telefone;

    nomeContato.textContent = contato.apelido || contato.telefone;
    telefoneContato.textContent = contato.telefone;

    textoMensagem.disabled = false;
    enviarMensagem.disabled = false;

    assinaturaMensagens = "";
    numeroDaConversa++;

    mostrarContatos();
    carregarMensagens();
    textoMensagem.focus();
}

// Buscar mensagens da conversa selecionada
async function carregarMensagens() {
    if (carregandoMensagens || !contatoSelecionado || !usuario) {
        return;
    }

    carregandoMensagens = true;

    const numeroAtual = numeroDaConversa;
    const telefoneDoContato = contatoSelecionado.telefone;

    try {
        const url =
            `${API}/chat?telefone=${encodeURIComponent(usuario.telefone)}` +
            `&telefone_destino=${encodeURIComponent(telefoneDoContato)}`;

        const resposta = await fetch(url);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar mensagens");
        }

        const dados = await resposta.json();

        // Evita mostrar mensagens de um contato que já foi trocado
        if (numeroAtual !== numeroDaConversa) {
            return;
        }

        const novaAssinatura = JSON.stringify(dados);

        if (novaAssinatura === assinaturaMensagens) {
            return;
        }

        assinaturaMensagens = novaAssinatura;
        mostrarMensagens(dados);
    } catch (erro) {
        console.error(erro);
    } finally {
        carregandoMensagens = false;
    }
}

// Mostrar as mensagens na conversa
function mostrarMensagens(lista) {
    mensagens.innerHTML = "";

    if (lista.length === 0) {
        mensagens.innerHTML = `
            <p class="mensagemInicial">
                Nenhuma mensagem ainda. Envie a primeira!
            </p>
        `;
        return;
    }

    lista.forEach((mensagem) => {
        const enviada =
            mensagem.telefone_remetente === usuario.telefone;

        const balao = document.createElement("div");
        balao.className = enviada
            ? "balaoMensagem mensagemEnviada"
            : "balaoMensagem mensagemRecebida";

        const texto = document.createElement("p");
        texto.className = "textoMensagem";
        texto.textContent = mensagem.mensagem;

        const horario = document.createElement("span");
        horario.className = "dataMensagem";

        if (mensagem.data_envio) {
            const data = new Date(mensagem.data_envio);

            horario.textContent = Number.isNaN(data.getTime())
                ? ""
                : data.toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit"
                });
        }

        balao.appendChild(texto);
        balao.appendChild(horario);

        mensagens.appendChild(balao);
    });

    mensagens.scrollTop = mensagens.scrollHeight;
}

// Enviar mensagem
formMensagem.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const texto = textoMensagem.value.trim();

    if (!texto || !contatoSelecionado || !usuario) {
        return;
    }

    enviarMensagem.disabled = true;

    try {
        const url =
            `${API}/chat?telefone=${encodeURIComponent(usuario.telefone)}` +
            `&senha_hash=${encodeURIComponent("5f4dcc3b5aa765d61d8327deb882cf99")}`;

        const resposta = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                telefone: contatoSelecionado.telefone,
                mensagem: texto
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            alert(dados.mensagem || "Não foi possível enviar a mensagem.");
            return;
        }

        textoMensagem.value = "";
        assinaturaMensagens = "";

        await carregarMensagens();
        textoMensagem.focus();
    } catch (erro) {
        console.error(erro);
        alert("Erro ao enviar mensagem. Verifique se a API está funcionando.");
    } finally {
        enviarMensagem.disabled = !contatoSelecionado;
    }
});

// Pesquisar contatos
pesquisaContato.addEventListener("input", mostrarContatos);

// Atualizar lista de contatos
atualizarContatos.addEventListener("click", carregarContatos);

// Atualização automática das mensagens
intervaloMensagens = setInterval(() => {
    if (contatoSelecionado && !carregandoMensagens) {
        carregarMensagens();
    }
}, 3000);

// Sair da conta
sairConta.addEventListener("click", () => {
    localStorage.removeItem("usuarioWhatsApp");
    sessionStorage.removeItem("usuarioWhatsApp");

    usuario = null;
    contatoSelecionado = null;
    assinaturaMensagens = "";

    telaChat.classList.add("escondido");
    telaCadastro.classList.add("escondido");
    telaLogin.classList.remove("escondido");

    formLogin.reset();
    pesquisaContato.value = "";
});

// Restaurar sessão salva
async function restaurarSessao() {
    const sessao =
        localStorage.getItem("usuarioWhatsApp") ||
        sessionStorage.getItem("usuarioWhatsApp");

    if (!sessao) {
        return;
    }

    try {
        usuario = JSON.parse(sessao);

        // Confirma se o usuário ainda existe na API
        const resposta = await fetch(
            `${API}/utilizador?telefone=${encodeURIComponent(usuario.telefone)}`
        );

        if (!resposta.ok) {
            usuario = null;
            localStorage.removeItem("usuarioWhatsApp");
            sessionStorage.removeItem("usuarioWhatsApp");
            return;
        }

        usuario = await resposta.json();
        abrirChat();
    } catch (erro) {
        console.error("Não foi possível restaurar a sessão:", erro);
        usuario = null;
    }
}



const mostrarSenha = document.getElementById("mostrarSenha");

mostrarSenha.addEventListener("click", () => {
    const senhaVisivel = senhaLogin.type === "text";

    senhaLogin.type = senhaVisivel ? "password" : "text";

    mostrarSenha.textContent = senhaVisivel ? "👁️" : "🙈";
    mostrarSenha.setAttribute(
        "aria-label",
        senhaVisivel ? "Mostrar senha" : "Ocultar senha"
    );
});

restaurarSessao();