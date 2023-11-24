export const Post = (props) => { // criando um "padrão" para os posts
    return (
        <div key={props.id}>
            <h1>{props.titulo}</h1>
            <h3>{props.id}</h3>
        </div>
    )
}