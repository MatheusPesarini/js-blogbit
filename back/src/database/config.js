const { Client } = require('pg');

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

module.exports = {
    HOST:"localhost",
    USER:"postgres",
    PASSWORD:"4435",
    DB:"BlogBIT",
    dialect:"postgres",
    
}   
