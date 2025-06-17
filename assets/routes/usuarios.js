const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt')

const router = express.Router();

const dirPath = path.join(__dirname, '../../data/usuarios.json');
const filePath = path.join(dirPath, '../../data/usuarios.json');

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, '[]', 'utf-8');
}

// Função auxiliar para ler usuários
function lerUsuarios() {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// Função auxiliar para salvar usuários
function salvarUsuarios(usuarios) {
  fs.writeFileSync(filePath, JSON.stringify(usuarios, null, 2), 'utf-8');
}

// GET: Lista todos os usuários
router.get('/', (req, res) => {
  try {
    const usuarios = lerUsuarios();
    const usuariosFiltrados = usuarios.map(u => ({
      username: u.usuario,
      nome: u.nome,
      permissao: u.permissao,
      status: u.status
    }));
    res.json(usuariosFiltrados);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao carregar usuários' });
  }
});

// GET: Buscar usuário específico
router.get('/:username', (req, res) => {
  try {
    const usuarios = lerUsuarios();
    const usuario = usuarios.find(u => u.usuario === req.params.username);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});

// POST: Criar novo usuário
router.post('/', (req, res) => {
  try {
    const novoUsuario = req.body;
    const usuarios = lerUsuarios();
    usuarios.push(novoUsuario);
    salvarUsuarios(usuarios);
    res.json({ success: true, message: 'Usuário salvo com sucesso!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao salvar usuário' });
  }
});

// PUT: Atualizar usuário existente
router.put('/:username', async (req, res) => {
  try {
    const usuarios = lerUsuarios();
    const index = usuarios.findIndex(u => u.usuario === req.params.username);

    if (index === -1) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Atualiza campos permitidos
    usuarios[index].nome = req.body.nome;
    usuarios[index].permissao = req.body.permissao;
    usuarios[index].status = req.body.status;

    // Se nova senha for enviado, re-hash
    if (req.body.senha && req.body.senha.trim() !== '') {
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(req.body.senha, salt)
      usuarios[index].passwordHash = hash
    }

    salvarUsuarios(usuarios);
    res.json({ success: true, message: 'Usuário atualizado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});

// PUT: Ativar usuário
router.put('/:username/ativar', (req, res) => {
  try {
    const usuarios = lerUsuarios();
    const usuario = usuarios.find(u => u.usuario === req.params.username);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    usuario.status = true;
    salvarUsuarios(usuarios);
    res.json({ success: true, message: 'Usuário ativado!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao ativar usuário' });
  }
});

// DELETE: Remover usuário
router.delete('/:username', (req, res) => {
  try {
    let usuarios = lerUsuarios();
    const index = usuarios.findIndex(u => u.usuario === req.params.username);
    if (index === -1) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    usuarios.splice(index, 1);
    salvarUsuarios(usuarios);
    res.json({ success: true, message: 'Usuário removido com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover usuário' });
  }
});

module.exports = router;
