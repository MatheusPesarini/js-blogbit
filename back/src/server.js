const express = require('express');
const cors = require('cors');
const { Client } = require('pg');

const app = express();
const port = 3000;

app.use(cors());

const config = {
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '4435',
    port: 5432,
};

// Cria um cliente PostgreSQL
const client = new Client(config);

// Conecta ao banco de dados PostgreSQL
client.connect()
    .then(() => console.log('Conexão bem-sucedida com o PostgreSQL'))
    .catch(err => console.error('Erro de conexão com o PostgreSQL', err));

app.get('/', (req, res) => {
    res.json({ message: 'Hello World!'});
});

app.get('/posts', async(req, res) => {
    const posts = await client.query('SELECT * FROM posts');
    res.send(posts.rows);
    //const {posts} = await client.query('SELECT * FROM posts', res.send(posts));
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta http://localhost:${port}`);
});