// const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleUserPost = async (e, onUserPostAdded) => {
    e.preventDefault();
    // helper.hideError();

    const text = e.target.querySelector('#postText').value;

    if(!text) {
        helper.handleError('Write something to post!');
        return false;
    }
    const response = await fetch('/createPost',
    {
        method: 'POST',
        body: new FormData(e.target),
    });

    onUserPostAdded();
    return false;
};

const PostForm = (props) => {

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        // Call the handleUserPost function to handle form submission
        await handleUserPost(e, props.triggerReload);
        // Close the modal after form submission
        props.onModalClose(); // Call the callback function passed from the parent component
    };

    return (
        <aside class="menu">
        <p class="menu-label">Upload</p>
        <form action="/createPost" 
        id="postForm"
        onSubmit={ handleFormSubmit }
        method="POST"
        className="postForm"
        encType='multipart/form-data'>
            <label htmlFor="text"></label>
            <input type="text" id="postText" name="text" placeholder="Write whats on your mind..." />
            <label htmlFor="image">Upload Image</label>
            <input type="file" id="postFile" name="file"></input>
            <input className="makePostSubmit" type="submit" value="Upload Post"/>
        </form>
        </aside>
    );
};

// const OptionsModal = (props) => {
//     const handleDelete = async (e) => {
//         try {
//             const response = await fetch(`delete/${props.Id}`, {
//                 method: 'POST',
//             });
//             if (response.ok) {
//                 e.preventDefault();
//                 props.triggerReload();
//                 props.onModalClose();
//                 console.log('Post deleted successfully');
//             } else {
//                 console.error('Failed to delete post');
//             }
//         } catch (err) {
//             console.log(err);
//         }
//     }
//     return (
//         <div>
//             <button class="js-modal-trigger" data-target="post-options-modal">
//                 <p className="is-size-4">...</p>
//             </button>
//             <Modal id="post-options-modal">
//                     <aside class="menu">
//                         <p class="menu-label">Options</p>
//                         <ul class="menu-list">
//                             {/* Delete button */}
//                             <li>
//                                 <button type="button" onClick={handleDelete}>
//                                     <p className="has-text-danger">Delete</p>
//                                 </button>
//                             </li>
//                             {/* Edit button */}
//                         <li><form><button>Edit</button></form></li>
//                     </ul>
//                 </aside>
//             </Modal>
//         </div>
        
//     )
// }
//Displays and gets the list of post in MongoDB
const PostList = (props) => {
    const [posts, setPosts] = useState(props.posts);

    useEffect(() => {
        const loadPostsFromServer = async () => {
            const response = await fetch('/getPosts');
            const data = await response.json();
            setPosts(data.posts);
        };
        loadPostsFromServer();
    }, [props.reloadPosts]);

    if(posts.length === 0) {
        return (
            <div className="postList">
                <h3 className="emptyPost">Upload your first post!</h3>
            </div>
        );
    }

    //Displays post
    const postNodes = posts.map(post => {
        return (
            <div>
                <div className="columns is-centered">
                    <div className="column is-three-fifths">
                        <div className="card has-no-rounded">
                            <div key={post._id} className="post">
                                <div className="card-image p-3 m-3">
                                    <figure className="image is-3by3">
                                        <img src={`/retrieve?_id=${post.fileID}`} />
                                    </figure>
                                </div>
                                <div className="columns pl-5 pr-5">
                                    <div class=" column card-content">
                                        <div class="media-content">
                                            <div class="media-right">
                                                <h3 className="postDate">{post.dateOfMem}</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="column is-narrow pr-5">
                                        
                                    </div>
                                </div>
                                <div class="content">
                                    <h3 className="pl-5 pb-5 pr-5">{post.text}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    });

    return (
        <div className="postList">
            {postNodes}
        </div>
    );
};

//Used the Bulma starter code to make the button to work.
const Modal = ({ id, children }) => {
    const [isActive, setIsActive] = useState(false);
  
    useEffect(() => {
      const openModal = () => setIsActive(true);
      const closeModal = () => setIsActive(false);
      const closeAllModals = () => {
        document.querySelectorAll('.modal').forEach((modal) => {
          closeModal(modal);
        });
      };
  
      document.querySelectorAll('.js-modal-trigger').forEach((trigger) => {
        const modalId = trigger.dataset.target;
        const targetModal = document.getElementById(modalId);
        
        trigger.addEventListener('click', () => openModal(targetModal));
      });
  
      document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button').forEach((close) => {
        const targetModal = close.closest('.modal');
        
        close.addEventListener('click', () => closeModal(targetModal));
      });
  
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          closeAllModals();
        }
      });

      // Listens for form submission event
      document.addEventListener('submit', (event) => {
        const form = event.target.closest('form');
        if (form && form.classList.contains('postForm')) {
            closeModal();
        }
    });
  
      return () => {
        document.removeEventListener('keydown', closeAllModals);
        document.removeEventListener('submit', (event) => {
            const form = event.target.closest('form');
            if (form && form.classList.contains('postForm')) {
                closeModal();
            }
        });
      };
    }, []);
  
    return (
      <div id={id} className={`modal ${isActive ? 'is-active' : ''}`}>
        <div className="modal-background"></div>
        <div className="modal-content">
          <div className="box">
            {children}
          </div>
        </div>
        <button className="modal-close is-large" aria-label="close"></button>
      </div>
    );
};

const App = () => {
    const [reloadPosts, setReloadPosts] = useState(false);
    const [isModalActive, setIsModalActive] = useState(false);

    const closeModal = () => {
        setIsModalActive(false);
    };

    return (
        <div>
            <div id="Posts">
                <PostList posts={[]} reloadPosts={reloadPosts} />
            </div>

            <Modal id="modal-Uploader" isActive={isModalActive}>
                <PostForm
                    triggerReload={() => setReloadPosts(!reloadPosts)}
                    onModalClose={closeModal} // Pass the closeModal function as a prop
                />
            </Modal>
        </div>
    );
};


const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render( <App /> );
};

window.onload = init;