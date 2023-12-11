import axios from 'axios';
import { useState, useEffect } from 'react';
import "../styles/Post.css";

export const Post = (props) => { // criando um "padrão" para os posts
    const [showEditModal, setShowEditModal] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editTexto, setEditTexto] = useState("");
    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");

    useEffect(() => {
        setPostTitle(props.titulo);
        setPostContent(props.texto);
    }, [props.titulo, props.texto]);

    const handleDeletePost = () => {
        console.log(props.id);
        axios.get(`http://localhost:3000/delete/${props.id}`)
        .then((response) => { 
            if(response.status === 200){ // Post foi removido
                document.location.assign("/");
            }
        })
    }

    const handleEditModal = () => {
        axios.post('http://localhost:3000/edit', {
            id: props.id,
            title: editTitle, // Enviando a váriavel postTile como title para a api
            texto: editTexto, // // Enviando a váriavel postContent como texto para a api
        }, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then((response) => {
          if(response.status === 200){ // Resposta positiva (post foi inserido)
            document.location.assign("/");
          }
        })
        .catch(error => {
          console.log(error)
        })
    }

    const handleEditPost = () => {
        setShowEditModal(true);
    }

    return (
        <div className="Posts">
            <h1>{postTitle}</h1>
            <h3>{postContent}</h3>
            <h4>{props.data.getFullYear().toString()}</h4>
            <div>
                <button style={{marginRight: 10}} onClick={handleDeletePost}>DELETAR</button>
                <button onClick={handleEditPost}>EDITAR</button>
            </div>
            <div className="modal" style={{display: showEditModal ? 'block' : 'none'}}>
                <p>EDITAR POST:</p>
                <div className="modalInputs">
                    <input type="text" className = "TituloEd" placeholder={props.titulo} onChange={(text) => setEditTitle(text.target.value)}/>
                    <input type="text" className = "TextoEd" placeholder={props.texto} onChange={(text) => setEditTexto(text.target.value)}/>
                </div>
                <div className="modalButtons">
                    <button onClick={handleEditModal}>Editar</button>
                    <button onClick={() => setShowEditModal(false)}>Fechar modal</button>
                </div>
            </div>
        </div>
    )
}