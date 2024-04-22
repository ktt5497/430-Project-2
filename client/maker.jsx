const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleUserPost = (e, onUserPostAdded) => {
    e.preventDefault();
    helper.hideError();

    const text = e.target.querySelector('#postText').value;
    const fileInput = e.target.querySelector('#postFile');
    const file = fileInput.files[0];
    const likes = 0;

    console.log(fileInput); // Debugging statement
    console.log(file); // Debugging statement

    if(!text) {
        helper.handleError('Write something to post!');
        return false;
    }

    helper.sendPost(e.target.action, {text, file, likes}, onUserPostAdded);
    return false;
};

const PostForm = (props) => {
    return (
        <form action="/createPost" 
        id="postForm"
        onSubmit={(e)=> handleUserPost(e, props.triggerReload)}
        method="POST"
        className="postForm"
        encType='multipart/form-data'>
            <label htmlFor="text"></label>
            <input type="text" id="postText" name="text" placeholder="Write whats on your mind..." />
            <label htmlFor="image">Upload Image</label>
            <input type="file" id="postFile" name="uploadFile" accept="image/*"></input>
            <input className="makePostSubmit" type="submit" value="Upload Post"/>
        </form>
    );
};

// const PostList = (props) => {
//     const [posts, setPosts] = useState(props.posts);

//     useEffect(() => {
//         const loadPostsFromServer = async () => {
//             const response = await fetch('/getPosts');
//             const data = await response.json();
//             setPosts(data.posts);
//         };
//         loadPostsFromServer();
//     }, [props.reloadPosts]);

//     if(posts.length === 0) {
//         return (
//             <div className="postList">
//                 <h3 className="emptyPost">Upload your first post!</h3>
//             </div>
//         );
//     }

//     //Displays post and maybe handle likes here??
//     const postNodes = posts.map(post => {
//         return (
//             <div key={post.id} className="post">
//                 <img src={post.img} alt="Post Image" className="postImage" />
//                 <h3 className="postText">{post.text}</h3>
//             </div>

//         );
//     });

//     return (
//         <div className="postList">
//             {postNodes}
//         </div>
//     );
// };

const App = () => {
    const [reloadPosts, setReloadPosts] = useState(false);

    return (
        <div>
            <div id="makePost">
                <PostForm triggerReload={() => setReloadPosts(!reloadPosts)} />
            </div>
            {/* <div id="Posts">
                <PostList Posts={[]} reloadPosts={reloadPosts} />
            </div> */}
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render( <App /> );
};

window.onload = init;