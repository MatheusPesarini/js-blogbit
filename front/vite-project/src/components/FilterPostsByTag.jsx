import {useEffect, useState} from 'react';
import axios from 'axios';
import { Post } from './Post';

export const FilterPostsByTag = (props) => {
    const [showCategoryModal, setShowCategoryModal] = useState(false)
    const [filteredPosts, setFilteredPosts] = useState([])

    useEffect(() => {
        axios.get('http://localhost:3000/posts').then((response) => { // conecta com o backend
            const posts = [];
            response.data.forEach((post) => { // O insercao dos dados no posts state não é instantanea, por isso usamos a propria resposta pra inserção
                post.tags.forEach((tag) => {
                    if(tag == props.tag){
                        posts.push(post);
                    }
                })
            });

            setFilteredPosts(posts);
        });
    }, [])

    const handleOpenCategory = () => {
        setShowCategoryModal(true);
    }

    return (
        <div>
            <div onClick={handleOpenCategory}>
                <p>#{props.tag}</p>
            </div>

            <div style={{display: showCategoryModal ? 'block' : 'none'}}>
                <p style={{fontWeight: '500'}}>Posts com #{props.tag}</p>
                <div className="posts">
                    {filteredPosts.map((post, index) => (
                        <Post key={index} id={post.id} titulo={post.titulo} texto={post.texto} data={new Date} tags={post.tags}/>
                    ))}
                </div>
                <div className="modalButtons">
                    <button onClick={() => setShowCategoryModal(false)}>Fechar modal</button>
                </div>
            </div>
        </div>
    );

}