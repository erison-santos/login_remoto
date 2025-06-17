const express = require('express');
const app = express();
app.use(express.json()) // <== Essencial para aceitar JSON no req.body

const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs')
const session = require('express-session')
const bcrypt = require('bcrypt')

app.use(express.static(path.join(__dirname, 'public')))

const PORT = 8083;
const usuariosPath = path.join(__dirname, 'data/usuarios.json')
const usuariosRoute = require('./assets/routes/usuarios')

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Servir HTML/CSS
app.use(express.static(__dirname));

// Rotas
app.use('/api/usuarios', usuariosRoute)

// Servir os executáveis
app.use('/installs', express.static(path.join(__dirname, 'assets/installs')));

// Servir arquivos de download
app.use('/downloads', express.static(path.join(__dirname, 'public/downloads')));
app.get('/api/debug/usuarios', (req, res) => {
    const usuarios = JSON.parse(fs.readFileSync(usuariosPath, 'utf-8'));
    res.json(usuarios);
});

// Sessão
app.use(session({
    secret: 'FAMA_53rv3r',
    resave: false,
    saveUninitialized: false
}))

// Página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Lógica de login
app.post('/login', async (req, res) => {
    const { usuario, senha } = req.body;

    try {
        if (!fs.existsSync(usuariosPath)) {
            return res.redirect('/?error=1');
        }

        const usuarios = JSON.parse(fs.readFileSync(usuariosPath, 'utf-8'));
        const user = usuarios.find(u => u.usuario === usuario);

        if (!user) {
            return res.redirect('/?error=1'); // Erro 1 Usuário não encontrado
        }

        // Checar se está desativado
        if (user.status === false || user.status === 'false') {
            return res.redirect('/?error=2') // Usuário desativado
        }

        const senhaValida = await bcrypt.compare(senha, user.passwordHash);
        if (!senhaValida) {
            return res.redirect('/?error=3'); // Erro 3 Senha incorreta
        }

        req.session.usuario = {
            usuario: user.usuario,
            nome: user.nome,
            permissao: user.permissao,
            status: user.status
        };

        res.redirect('/pages/ApplicationCenter/ApplicationCenter.html');

    } catch (err) {
        console.error('Erro no login:', err);
        res.redirect('/?error=1');
    }
});

// Rota protegida exemplo (pode ser adaptada conforme necessário)
app.get('/dashboard', (req, res) => {
    if (!req.session.usuario) {
        return res.redirect('/');
    }
    res.send(`Bem-vindo, ${req.session.usuario.nome}`);
});

// Página not found
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'pages/NotFound/notfound.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
