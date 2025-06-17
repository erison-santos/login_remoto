document.getElementById('formNovoUsuario').addEventListener('submit', async (e) => {
  e.preventDefault();

  const usuario = document.getElementById('usuario').value.trim();
  const nome = document.getElementById('nome').value.trim();
  const senha = document.getElementById('senha').value;
  const checkboxpermissao = document.getElementById('checkbox-permissao').value;
  const checkboxstatus = document.getElementById('checkbox-status').value;

  const permissao = checkboxpermissao.checked ? false : true
  const status = checkboxstatus.checked ? false : true

  const salt = dcodeIO.bcrypt.genSaltSync(10);
  const passwordHash = dcodeIO.bcrypt.hashSync(senha, salt);

  const novoUsuario = {
    usuario,
    nome,
    permissao,
    status,
    passwordHash
  };

  try {
    const response = await fetch('/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoUsuario)
    });

    const resultado = await response.json();
    document.getElementById('mensagem').textContent = resultado.message || 'Usuário cadastrado com sucesso!';
  } catch (err) {
    console.error('Erro ao cadastrar usuário:', err);
    document.getElementById('mensagem').textContent = 'Erro ao cadastrar usuário.';
  }
});