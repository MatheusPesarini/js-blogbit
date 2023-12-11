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

app.use(function (req, res, next) { // configurando o acesso ao servidor
    res.header("Access-Control-Allow-origin", "*")
    res.setHeader('Access-Control-Allow-Methods', "GET, PUT, POST, DELETE, PATCH, OPTIONS")
    res.header("Access-Control-Allow-Headers", "X-PINGOTHER, Content-Type, Authorization, Origin, X-Auth-Token")
    next();
})

// Conecta ao banco de dados PostgreSQL
client.connect()
    .then(() => console.log('Conexão bem-sucedida com o PostgreSQL'))
    .catch(err => console.error('Erro de conexão com o PostgreSQL', err));

app.get('/', (req, res) => { // configurando a rota principal
    res.json({ message: 'Hello World!'});
});

app.get('/posts', async(req, res) => {
    const posts = await client.query('SELECT * FROM posts'); // Consultando a tabela posts do banco de dados
    res.send(posts.rows);
}); 

app.get('/delete/:id', async (req, res) => { // Rota para deletar um post
    try {
        const postId = req.params.id;
    
        if (isNaN(postId)) {
            throw new Error('ID inválido');
        }
    
        const result = client.query('DELETE FROM public.posts WHERE id = $1', [parseInt(req.params.id)]) // ESSE TIPO DE LEITURA DE DADOS SÓ FUNCIONA EM PORTAS GET, POIS NÃO EXISTE BODY NA REQUISIÇÃO (EXISTE APENAS EM REQUISICOES POST)
        res.status(200).send("Post removido com sucesso!");
    } catch (error) {
        console.error('Erro ao remover post:', error);
        res.status(500).send('Erro ao remover post');
    }
})

app.use(bodyParser.json());
app.post("/create", async (req, res) => { // Rota para criar um novo post
    let {title, texto, tags} = req.body;
   
    if(title && texto){
        const dbquery = await client.query(`INSERT INTO public.posts (titulo, texto, tags) 
            VALUES ($1, $2, $3)
            RETURNING id`, 
            [title, texto, tags]
        );

        console.log("Novo post inserido!"); // Resposta na API do node!
        res.status(200).send("Post inserido com sucesso!"); // Resposta para o cliente!
    } else {
        res.status(500).send("Preencha todos os campos!");
    }
})

app.post("/edit", async (req, res) => { // Rota para editar um post
    let {id, title, texto} = req.body;
   
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
