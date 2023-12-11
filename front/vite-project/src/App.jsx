import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';
import { Post } from './components/Post'
import { FilterPostsByTag } from './components/FilterPostsByTag';

function App() {
  const [posts, setPosts] = useState([])
  const [postTitle, setPostTitle] = useState("")
  const [postContent, setPostContent] = useState("")
  const [postTags, setPostTags] = useState("")
  const [tags, setTags] = useState([]);

  useEffect(() => { 
    axios.get('http://localhost:3000/posts').then((response) => { // conecta com o backend
      setPosts(response.data) // pega o dado posts do banco de dados e envia para o frontend
      const newTags = [];
      response.data.forEach((post) => { // O insercao dos dados no posts state não é instantanea, por isso usamos a propria resposta pra inserção
        post.tags.forEach((tag) => {
          if(!tags.includes(tag)){
            newTags.push(tag);
          }
        })
      });

      setTags(newTags);
    });
  }, [])

  const handleAddPost = () => {
    const tagsArray = postTags.split(",").map(tag => tag.trim())
    const tagsFiltered = postTags.split(",").filter(tag => tag.length >= 3 && tag.length == tag.replace(/ /g, "").length).map(tag => tag.trim())
    
    axios.post('http://localhost:3000/create', {
      title: postTitle, // Enviando a váriavel postTile como title para a api
      texto: postContent, // // Enviando a váriavel postContent como texto para a api
      tags: tagsFiltered,
    }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      if(response.status === 200){ // Resposta positiva (post foi inserido)
        /*
        setPosts((postsAnteriores) => {
          const lastId = postsAnteriores.length > 0 ? postsAnteriores[postsAnteriores.length - 1].id : 0;
          const novoComentario = { id: lastId + 1, titulo: postTitle, texto: postContent };
          return [...postsAnteriores, novoComentario];
        })
        */
        document.location.assign("/");
      }
    })
    .catch(error => {
      console.log(error)
    })
  }

  return (
    <>
      <div><img src="../favicon.ico" alt="BIT" style={{ width: '100px', height: 'auto' }}/></div>
      <h1>Posts</h1>
      <input type="text" className = "Titulo" placeholder="Digite o titulo do post" value={postTitle} onChange={(title) => setPostTitle(title.target.value)}/>
      <input type="text" className = "Texto" placeholder="Digite o conteúdo do post" value={postContent} onChange={(body) => setPostContent(body.target.value)}/>
      <input type="text" className = "Tags" placeholder="Tag1,tag2..." value={postTags} onChange={(tags) => setPostTags(tags.target.value)}/>
      <button onClick={handleAddPost}>Criar Post</button>
    
      {posts.map((post, index) => (
        <Post key={index} id={post.id} titulo={post.titulo} texto={post.texto} data={new Date()} tags={post.tags}/> // mapeia os posts e os envia para o frontend
      ))}
      

      
      <div className="categorias">
          <p>Categorias:</p>
          {tags.map((tag, index) => (
            <FilterPostsByTag tag={tag} key={index}/>
          ))}
      </div>
    </>
  )
}

export default App

