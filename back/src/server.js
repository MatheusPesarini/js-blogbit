const express = require('express');
const cors = require('cors');
const config = require('./database/config');

const app = express();
const port = 3000;

app.use(cors());

app.listen(port, () => {
    console.log(`Servidor rodando na porta http://localhost:${port}`);
});