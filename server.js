const express = require('express');
const app = express();
app.use(express.json()) // <== Essencial para aceitar JSON no req.body

const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs')
const session = require('express-session')
const bcrypt = require('bcrypt')

const rotaUsuarios = require('./assets/routes/usuarios')
app.use('/api/usuarios', rotaUsuarios)
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
app.use('/data', express.static(path.join(__dirname, 'data')));

// Sessão
app.use(session({
    secret: 'FAMA_53rv3r',
    resave: false,
    saveUnititialized: false
}))

// Página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Lógica de login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!fs.existsSync(usuariosPath)) {
            return res.redirect('/?error=1');
        }

        const usuarios = JSON.parse(fs.readFileSync(usuariosPath, 'utf-8'));
        const usuario = usuarios.find(u => u.username === username);

        if (!usuario) {
            return res.redirect('/?error=1');
        }

        const senhaValida = await bcrypt.compare(password, usuario.passwordHash);
        if (!senhaValida) {
            return res.redirect('/?error=1');
        }

        req.session.usuario = {
            username: usuario.username,
            nome: usuario.nome,
            permissao: usuario.permissao,
            status: usuario.status
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
