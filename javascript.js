const { Client } = require('pg');
const express = require('express');

const app = express();
const port = 3000;

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'postgres', // Altere para o nome do seu banco de dados, se não for 'postgres'
  user: 'postgres',
  password: '4435',
  sslmode: 'prefer',
  connect_timeout: 10,
});

app.get('/', async (req, res) => {
  try {
    console.log('Tentando conectar ao banco de dados...');
    await client.connect();
    console.log('Conectado ao banco de dados com sucesso!');
    const dbRes = await client.query('SELECT $1::text as message', ['Hello world!']);
    res.send(`Message from database: ${dbRes.rows[0].message}`);
  } catch (err) {
    console.error('Erro na consulta:', err);
    res.status(500).send(`Erro interno do servidor: ${err.message}`);
  } finally {
    await client.end();
    console.log('Conexão encerrada.');
  }
});

app.listen(port, () => {
  console.log(`Aplicativo ouvindo em http://localhost:${port}`);
});