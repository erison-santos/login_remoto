const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Caminho absoluto para o diretório e arquivo
const dirPath = path.join(__dirname, '../../data/usuarios.json');
const filePath = path.join(dirPath, '../../data/usuarios.json');

// Garante que o diretório e o arquivo existam ao iniciar o app
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, '[]', 'utf-8');
}

// Rota POST para salvar novo usuário
router.post('/', (req, res) => {
  try {
    const novoUsuario = req.body;

    // Lê o arquivo atual
    const usuarios = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // Adiciona o novo usuário
    usuarios.push(novoUsuario);

    // Salva novamente o arquivo
    fs.writeFileSync(filePath, JSON.stringify(usuarios, null, 2), 'utf-8');

    res.json({ success: true, message: 'Usuário salvo com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar usuário:', error);
    res.status(500).json({ success: false, message: 'Erro interno ao salvar usuário.' });
  }
});

// Rota GET para retornar os usuários
router.get('/', (req, res) => {
  try {
    const usuarios = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // Retorna apenas os campos necessários para a tabela
    const usuariosFiltrados = usuarios.map(u => ({
      username: u.usuario,
      nome: u.nome,
      permissao: u.permissao,
      status: u.status
    }));

    res.json(usuariosFiltrados);
  } catch (error) {
    console.error('Erro ao ler usuários:', error);
    res.status(500).json({ error: 'Erro ao carregar usuários' });
  }
});

module.exports = router;
