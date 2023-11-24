import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Square from './components/Square'
import axios from 'axios';
import { Post } from './components/Post'

function App() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    axios.get('http://localhost:3000/posts').then((response) => {
      setPosts(response.data)
    });
  }, [])

  return (
    <>
      <h1>Posts</h1>
      {posts.map((post, index) => (
        <Post key={index} id={post.id} titulo={post.titulo}/>
      ))}
      <Square color="blue"/>
      <Square color="red"/>
    </>
  )
}

export default App

