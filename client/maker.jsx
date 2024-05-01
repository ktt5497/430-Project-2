const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleUserPost = async (e, onUserPostAdded) => {
    e.preventDefault();
    helper.hideError();

    const text = e.target.querySelector('#postText').value;
    const file = e.target.querySelector('#postFile').value;

    if(!text || !file) {
        helper.handleError('Write something to post and also choose a photo to upload!');
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
        props.onModalClose();
    };

    return (
        <div className='p-5'>
            <aside class="menu">
            <p class="menu-label">Upload</p>
            <form action="/createPost" 
            id="postForm"
            onSubmit={ handleFormSubmit }
            method="POST"
            className="postForm"
            encType='multipart/form-data'>
                <label htmlFor="text"></label>
                <input className="textarea" type="text" id="postText" name="text" placeholder="Write whats on your mind..." />
                <div className='pt-4'>
                    <label className="pr-3" htmlFor="image">Upload Image:</label>
                    <input type="file" id="postFile" name="file"></input>
                </div>
                
                <div className="pt-4">
                    <input className="button" type="submit" value="Upload Post"/>
                </div>
                
            </form>
            </aside>
            <div id="eMessage" class='hidden'>
                <h3><span id="errorMessage"></span></h3>
            </div>
        </div>
    );
};

const handleEditPost = async (e, onUserPostAdded) => {
    e.preventDefault();
    helper.hideError();

    const text = e.target.querySelector('#editText').value;
    const fileInput = e.target.querySelector('#editFile').value;
    const file = fileInput.files[0];

    if(!text) {
        helper.handleError('Write something to post!');
        return false;
    }

    const formData = new FormData();
    formData.append('text', text);
    formData.append('file', file);

    const response = await fetch(`/edit?id=${e.target.id}`,
    {
        method: 'POST',
        body: formData,
    });

    onUserPostAdded();
    return false;
};

//Editing Form (to change existing post)
const PostEdit = (props) => {
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        await handleEditPost(e, props.triggerReload);
        // Close the modal after form submission
        props.onModalClose();
    };

    return (
        <form action="/edit" 
            id="editForm"
            onSubmit={ handleFormSubmit }
            method="POST"
            className="editForm"
            encType='multipart/form-data'>
            <label htmlFor="text"></label>
            <input className="textarea" type="text" id="editText" name="text" placeholder="Update..." />
            <div className='pt-4'>
                    <label className="pr-3" htmlFor="image">Change Image:</label>
                    <input type="file" id="editFile" name="file"></input>
                </div>
            <input className="button" type="submit" value="Edit Post"/>
        </form>
    );
};

//Options modal; user can choose to click delete or edit the post
const OptionsModal = (props) => {
    const handleDelete = async (e, id) => {
        try {
            const response = await fetch(`delete?id=${id}`, {
                method: 'POST',
            });
            if (response.ok) {
                e.preventDefault();
                // props.triggerReload();
                // props.onModalClose();
                console.log('Post deleted successfully');
            } else {
                console.error('Failed to delete post');
            }
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div>
            <Modal id="post-options">
                    <aside class="menu">
                        <p class="menu-label">Delete</p>
                        <ul class="menu-list">
                            {/* Delete button */}
                            <li>
                                <button type="button" onClick={(e) => handleDelete(e, props.Id)}>
                                    <p className="has-text-danger">Delete</p>
                                </button>
                            </li>
                        <p class="menu-label">Edit</p>
                        <li>
                            <PostEdit />
                        </li>
                    </ul>
                </aside>
            </Modal>
        </div>
        
    )
}
//Displays and gets the list of post in MongoDB
const PostList = (props) => {
    const [posts, setPosts] = useState(props.posts);

    //loading the data for text, fils, and date
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
            <section className="hero is-fullheight">
                <div className="hero-body">
                    <p className="has-text-centered is-size-1 has-text-success-light">Upload your first post...</p>
                </div>
            </section>
            
        );
    }

    //Displays post
    const postNodes = posts.map(post => {
        return (
            <div>
                <div className="columns is-centered p-6">
                    <div className="column is-three-fifths">
                        <div className="card has-no-rounded">
                            <div key={post._id} className="post">
                                <div className="card-image p-3 m-3">
                                    <figure className="image is-1by1">
                                        <img className="has-no-rounded" src={`/retrieve?_id=${post.fileID}`} />
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
                                    <button class="js-modal-trigger" data-target="post-options">
                                        <p className="is-size-4">...</p>
                                    </button>
                                    <OptionsModal Id={post._id}/>
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

//This is creating the modal. It also keeps track when the modal is being closed or opened.
//Edit here to make it select the selected modal.
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
  
      //targets the specific modal to close
      document.querySelectorAll('.js-modal-trigger').forEach((trigger) => {
        const modalId = trigger.dataset.target;
        const targetModal = document.getElementById(modalId);
        
        trigger.addEventListener('click', () => openModal(targetModal));
      });
  
      document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button').forEach((close) => {
        const targetModal = close.closest('.modal');
        
        close.addEventListener('click', () => closeModal(targetModal));
      });
  
      //user can use esc to close modal
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
  
    //returning modal
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