async function carregarTabelaUsuarios() {
    const container = document.getElementById("containerTableUsers");
    try {
        const response = await fetch("../../assets/utils/TableUsers/TableUsers.html");
        const html = await response.text();
        let listaUsuarios = []
        container.innerHTML = html;

        // Buscar dados
        const responseUsuarios = await fetch("/api/usuarios");

        listaUsuarios = await responseUsuarios.json()

        renderizarTabela(listaUsuarios)

        document.getElementById("pesquisaUsuarios").addEventListener("input", (e) => {
            const termo = e.target.value.toLowerCase()

            const filtrados = listaUsuarios.filter(u =>
                u.username.toLowerCase().includes(termo) ||
                u.nome.toLowerCase().includes(termo)
            );
            renderizarTabela(filtrados)
        })


    } catch (err) {
        console.error("erro ao carregar a tabela:", err);
        alert(`Erro da tabela: ${err.message}`);
    }
}

carregarTabelaUsuarios();

async function editarUsuario(username) {
    const container = document.getElementById("containerTableUsers") || document.getElementById("main-content");

    try {
        const response = await fetch("../../../assets/utils/NewUser/newUser.html");
        const html = await response.text();
        container.innerHTML = html;

        // Busca dados do usuário
        const responseUsuario = await fetch(`/api/usuarios/${username}`);
        const usuario = await responseUsuario.json();

        // Preenche o form
        document.getElementById('usuario').value = usuario.usuario;
        document.getElementById('nome').value = usuario.nome;
        document.getElementById('senha').value = ""; // senha não preenche
        document.getElementById('checkbox-permissao').checked = usuario.permissao;
        document.getElementById('checkbox-status').checked = usuario.status;

        // Ao salvar, faz PUT em vez de POST
        document.getElementById('formNovoUsuario').addEventListener('submit', async (e) => {
            e.preventDefault();

            const nome = document.getElementById('nome').value.trim();
            const senha = document.getElementById('senha').value;
            const permissao = document.getElementById('checkbox-permissao').checked;
            const status = document.getElementById('checkbox-status').checked;

            const dadosAtualizados = { nome, senha, permissao, status };

            const res = await fetch(`/api/usuarios/${username}`, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosAtualizados)
            });

            if (res.ok) {
                alert("Usuário atualizado com sucesso");
                carregarTabelaUsuarios();
            } else {
                alert("Erro ao atualizar usuário");
            }
        });

    } catch (err) {
        console.error("Erro ao editar usuário:", err);
    }
}


async function removerUsuario(username) {
    if (confirm(`Tem certeza que deseja remover o usuário ${username}?`)) {
        try {
            const response = await fetch(`/api/usuarios/${username}`, {
                method: "DELETE"
            });

            if (response.ok) {
                alert("Usuário removido com sucesso!");
                carregarTabelaUsuarios(); // atualiza a tabela
            } else {
                const erro = await response.json();
                alert("Erro ao remover usuário: " + erro.message);
            }
        } catch (err) {
            console.error("Erro ao remover usuário:", err);
            alert("Erro inesperado.");
        }
    }
}

async function ativarUsuario(username) {
    try {
        const response = await fetch(`/api/usuarios/${username}/ativar`, {
            method: "PUT"
        });

        if (response.ok) {
            alert("Usuário ativado com sucesso!");
            carregarTabelaUsuarios(); // atualiza a tabela
        } else {
            const erro = await response.json();
            alert("Erro ao ativar usuário: " + erro.message);
        }
    } catch (err) {
        console.error("Erro ao ativar usuário:", err);
        alert("Erro inesperado.");
    }
}

function renderizarTabela(usuarios) {
    // Aguardando renderização...
    setTimeout(() => {
        const tbody = document.getElementById("tbody-users");
        tbody.innerHTML = ""; // Limpar antes de renderizar

        usuarios.forEach((usuario) => {

            const tr = document.createElement("tr");

            // Username
            const tdUsername = document.createElement("td");
            tdUsername.textContent = usuario.username;

            // Nome
            const tdNome = document.createElement("td");
            tdNome.textContent = usuario.nome;

            // Permissão
            const tdPermissao = document.createElement("td");
            tdPermissao.textContent = usuario.permissao === true ? 'Admin' : 'User';

            // Status
            const tdStatus = document.createElement("td");
            tdStatus.textContent = usuario.status === true ? 'Ativo' : 'Inativo';

            // Ações
            const tdAcoes = document.createElement("td");

            // Botão Editar
            const btnEditar = document.createElement("button");
            btnEditar.type = "button";
            btnEditar.className = "btn btn-outline-primary";
            btnEditar.innerHTML = '<span class="material-icons">edit</span>';
            btnEditar.addEventListener("click", () => editarUsuario(usuario.username));

            // Botão Remover
            const btnRemover = document.createElement("button");
            btnRemover.type = "button";
            btnRemover.className = "btn btn-outline-danger ms-2";
            btnRemover.innerHTML = '<span class="material-icons">delete</span>';
            btnRemover.addEventListener("click", () => removerUsuario(usuario.username));

            tdAcoes.appendChild(btnEditar);
            tdAcoes.appendChild(btnRemover);

            // Botão Ativar (condicional)
            if (usuario.status === false) {
                const btnAtivar = document.createElement("button");
                btnAtivar.type = "button";
                btnAtivar.className = "btn btn-outline-success ms-2";
                btnAtivar.innerHTML = '<span class="material-icons">check_circle</span>';
                btnAtivar.addEventListener("click", () => ativarUsuario(usuario.username));
                tdAcoes.appendChild(btnAtivar);
            }

            // Monta a linha
            tr.appendChild(tdUsername);
            tr.appendChild(tdNome);
            tr.appendChild(tdPermissao);
            tr.appendChild(tdStatus);
            tr.appendChild(tdAcoes);

            tbody.appendChild(tr);
        });

        // Botão adicionar novo usuário
        document.getElementById("btnAddUser").addEventListener("click", async () => {
            const container = document.getElementById("containerTableUsers") || document.getElementById("main-content");

            try {
                const response = await fetch("../../../assets/utils/NewUser/newUser.html");
                const html = await response.text();
                container.innerHTML = html;
            } catch (err) {
                console.error("Erro ao carregar o formulário de novo usuário:", err);
            }
        });

    }, 0);
}

async function salvarNovoUsuario(usuario) {
    const response = await fetch("/api/usuarios", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(usuario),
    });

    const resultado = await response.json();
    console.log(resultado.message);
}
