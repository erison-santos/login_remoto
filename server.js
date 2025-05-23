const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 8083;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Servir HTML/CSS
app.use(express.static(__dirname));

// Servir os executáveis
app.use('/installs', express.static(path.join(__dirname, 'assets/installs')));

// Servir arquivos de download
app.use('/downloads', express.static(path.join(__dirname, 'public/downloads')));
app.use('/data', express.static(path.join(__dirname, 'data')));

// Página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Lógica de login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Login simples (substitua por seu banco de dados)
  const usuarioValido = 'suporte';
  const senhaValida = 'FAMA_53rv3r';

  if (username === usuarioValido && password === senhaValida) {
    res.redirect('/pages/ApplicationCenter/ApplicationCenter.html');
  } else {
    res.redirect('/?error=1');
  }
});

// Página not found
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'pages/notfound.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
