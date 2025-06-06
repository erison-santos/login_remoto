async function carregarTabelaUsuarios() {
    const container = document.getElementById("containerTableUsers")
    try {
        const response = await fetch("../../assets/utils/TableUsers/TableUsers.html")
        const html = await response.text()
        container.innerHTML = html

        // Buscar dados
        const responseUsuarios = await fetch("/api/usuarios")
        const usuarios = await responseUsuarios.json()

        // Aguardando renderização...
        setTimeout(() => {
            const tbody = document.getElementById("tbody-users")
            usuarios.forEach((usuario) => {
                const tr = document.createElement("tr")
                tr.innerHTML = `
                    <td>${usuario.login}</td>
                    <td>${usuario.nome}</td>
                    <td>${usuario.permissao}</td>
                    <td>${usuario.status}</td>
                    <td>
                        <button
                            type="button"
                            class="btn btn-outline-danger"
                            onclick="editarUsuario('${usuario.login}')">Editar</button>
                        <button
                            type="button"
                            class="btn btn-outline-danger"
                            onclick="removerUsuario('${usuario.login}')">Remover</button>
                    </td>
                `;
                tbody.appendChild(tr)
            })

            // Botão adicionar novo usuário
            document.getElementById("btnAddUser").addEventListener("click", async () => {
                const container = document.getElementById("containerTableUsers") || document.getElementById("main-content")

                try {
                    const response = await fetch("../../../assets/utils/NewUser/newUser.html")
                    const html = await response.text()
                    container.innerHTML = html
                } catch (err) {
                    console.error("Erro ao carregar o formulário de novo usuário:", err)
                }
            })

        }, 0)

    } catch (err) {
        console.error("erro ao carregar a tabela:", err)
        alert(`Erro da tabela: ${err.message}`)
    }
}

carregarTabelaUsuarios()

// Funções para editar e remover
function editarUsuario(login) {
    alert(`Editar usuário: ${login}`)
}

function removerUsuario(login) {
    alert(`Remover usuário: ${login}`)
}

async function salvarNovoUsuario(usuario) {
    const response = await fetch("/api/usuarios", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(usuario),
    })

    const resultado = await response.json()
    console.log(resultado.message)
}