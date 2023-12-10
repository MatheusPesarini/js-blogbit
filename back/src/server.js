const express = require('express');
const cors = require('cors');
const { Client } = require('pg');

const app = express();
const port = 3000;

app.use(cors());

const config = { // Configuração de acesso ao banco de dados
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '4435',
    port: 5432,
};

// Cria um cliente PostgreSQL
const client = new Client(config);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-origin", "*")
    res.setHeader('Access-Control-Allow-Methods', "GET,POST,OPTIONS")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next();
})

// Conecta ao banco de dados PostgreSQL
client.connect()
    .then(() => console.log('Conexão bem-sucedida com o PostgreSQL'))
    .catch(err => console.error('Erro de conexão com o PostgreSQL', err));

app.get('/', (req, res) => {
    res.json({ message: 'Hello World!'});
});

app.get('/posts', async(req, res) => {
    const posts = await client.query('SELECT * FROM posts'); // Consultando a tabela posts do banco de dados
    res.send(posts.rows);
}); 

app.post("/upload-post", (req, res) => {
    console.log("informacoes post estao sendo enviadas", req.body);
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta http://localhost:${port}`); // configurando o link com a porta do servidor
});