const express = require('express');
const cors = require('cors');
const { Client } = require('pg');
const bodyParser = require('body-parser');

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

app.listen(port, () => {
    console.log(`Servidor rodando na porta http://localhost:${port}`); // configurando o link com a porta do servidor
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-origin", "*")
    res.setHeader('Access-Control-Allow-Methods', "GET, PUT, POST, DELETE, PATCH, OPTIONS")
    res.header("Access-Control-Allow-Headers", "X-PINGOTHER, Content-Type, Authorization, Origin, X-Auth-Token")
    app.use(cors());
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

app.get('/delete/:id', (req, res) => {
    client.query('DELETE FROM public.posts WHERE id = $1', [parseInt(req.params.id)]) // ESSE TIPO DE LEITURA DE DADOS SÓ FUNCIONA EM PORTAS GET, POIS NÃO EXISTE BODY NA REQUISIÇÃO (EXISTE APENAS EM REQUISICOES POST)
    res.status(200).send("Post removido com sucesso!");
})

app.use(bodyParser.json());
app.post("/create", async (req, res) => {
    let {title, texto} = req.body;

    /*
    if(!title || !texto){
        res.status(500).send("Preencha todos os campos!");
    }
    if(title.length < 2){
        res.status(500).send("O título necessita ter ao menos dois caracteres!");
    }
    */
   
    if(title && texto){
        const dbquery = await client.query(`INSERT INTO public.posts (titulo, texto) 
            VALUES ($1, $2)
            RETURNING id`, 
            [title, texto]
        );

        console.log("Novo post inserido!"); // Resposta na API!
        res.status(200).send("Post inserido com sucesso!"); // Resposta para o cliente!
    } else {
        res.status(500).send("Preencha todos os campos!");
    }
})

app.use(bodyParser.json());
app.post("/edit", async (req, res) => {
    let {id, title, texto} = req.body;

    /*
    if(!title || !texto){
        res.status(500).send("Preencha todos os campos!");
    }
    if(title.length < 2){
        res.status(500).send("O título necessita ter ao menos dois caracteres!");
    }
    */
   
    if(id && title && texto){
        const dbquery = await client.query(`UPDATE public.posts SET titulo = $1, texto = $2 
            WHERE id = $3`, 
            [title, texto, id]
        );

        console.log("Post editado com sucesso!"); // Resposta na API!
        res.status(200).send("Post editado com sucesso!"); // Resposta para o cliente!
    } else {
        console.log("Erro!");
        res.status(500).send("Preencha todos os campos!");
    }
})

app.post("/upload-post", (req, res) => {    
    console.log("informacoes post estao sendo enviadas", req.body);
    res.sendStatus(200);
});
