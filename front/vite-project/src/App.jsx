import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios';
import { Post } from './components/Post'

function App() {
  const [posts, setPosts] = useState([])
  const [postTitle, setPostTitle] = useState("")
  const [postContent, setPostContent] = useState( "")

  useEffect(() => { 
    axios.get('http://localhost:3000/posts').then((response) => { // conecta com o backend
      setPosts(response.data) // pega o dado posts do banco de dados e envia para o frontend
    });
  }, [])

  const handleAddPost = () => {
    axios.post('http://localhost:3000/create', {
      title: postTitle, // Enviando a váriavel postTile como title para a api
      texto: postContent, // // Enviando a váriavel postContent como texto para a api
    }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      if(response.status === 200){ // Resposta positiva (post foi inserido)
        setPosts((postsAnteriores) => {
          const lastId = postsAnteriores.length > 0 ? postsAnteriores[postsAnteriores.length - 1].id : 0;
          const novoComentario = { id: lastId + 1, titulo: postTitle, texto: postContent };
          return [...postsAnteriores, novoComentario];
        })

        setPostTitle("")
        setPostContent("")
      }
    })
    .catch(error => {
      console.log(error)
    })
  }

  return (
    <>
      <h1>Posts</h1>
      {posts.map((post, index) => (
        <Post key={index} id={post.id} titulo={post.titulo} texto={post.texto} data={new Date()}/> // mapeia os posts e os envia para o frontend
      ))}

      <input type="text" placeholder="Digite o titulo do post" value={postTitle} onChange={(title) => setPostTitle(title.target.value)}/>
      <input type="text" placeholder="Digite o conteúdo do post" value={postContent} onChange={(body) => setPostContent(body.target.value)}/>
      <button onClick={handleAddPost}>Criar Post</button>
    </>
  )
}

export default App

