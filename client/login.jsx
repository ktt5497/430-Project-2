const helper = require('./helper.js');
const React = require('react');
const {createRoot} = require('react-dom/client');

const handleVerify = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const dOb = e.target.querySelector('#dOb2').value;

    //session storage in use for username to use in pass.jsx
    sessionStorage.setItem('username', username);

    if(!username || !dOb) {
        helper.handleError('Username and Date of Birth are required!');
        return false;
    }

    helper.sendPost(e.target.action, {username, dOb});
    return false;
};

const handleLogin = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;

    if(!username || !pass) {
        helper.handleError('Username or password is empty!');
        return false;
    }

    helper.sendPost(e.target.action, {username, pass});
    return false;
}

const handleSignup = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    const dOb = e.target.querySelector('#dOb').value;

    if(!username || !pass || !pass2 || !dOb) {
        helper.handleError('All fields are required!');
        return false;
    }

    if(pass != pass2) {
        helper.handleError('Passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, {username, pass, pass2, dOb});

    return false;
}

//Verification Window
const VerificationWindow = (props) => {
    return (
        <form id="verifyForm"
            name="verifyForm"
            onSubmit={handleVerify}
            action="/verification"
            method='POST'
            className="mainForm">
                <div className="columns is-centered">
                    <div className="column is-half is-offset-one-quarter">
                        <div class="fixed-grid has-1-cols">
                                <div class="grid">
                                    <div class="cell text-is-centered">
                                        <label htmlFor="username">Username: </label>
                                        <input class="input" type="text" id="user" name="username" placeholder="username" />
                                    </div>
                                    <div class="cell text-is-centered pl-1">
                                        <label htmlFor="dateOfbirth">Date of Birth: </label>
                                        <input type="date" id="dOb2" name="dOb" />
                                    </div>
                                    <div class="cell pl-6">
                                    <input className="button" type="submit" value="Verify to Set New Password" />
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            </form>
    );
};

const LoginWindow = (props) => {
    return (
        <form id="loginForm"
            name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
            className="mainForm"
            >
                <p className="is-size-4 has-text-centered pb-3">MemoryBoard</p>
                <div className="columns is-centered">
                    <div className="column is-half is-offset-one-quarter">
                        <div class="fixed-grid has-1-cols">
                                <div class="grid">
                                    <div class="cell text-is-centered">
                                        <label htmlFor="username">Username: </label>
                                        <input class="input" type="text" id="user" name="username" placeholder="Username" />
                                    </div>
                                    <div class="cell text-is-centered pl-1">
                                        <label htmlFor="pass">Password: </label>
                                        <input class="input" type="Password" id="pass" name="pass" placeholder="Password" />
                                    </div>
                                    <div class="cell pl-6 ml-6">
                                        <input className="button" type="submit" value="Sign in" />
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            </form>
    );
};

const SignupWindow = (props) => {
    return (
        <form id="signupForm"
            name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
            className="mainForm"
            >
                <div className="columns is-centered">
                    <div className="column is-half is-offset-one-quarter">
                        <div class="fixed-grid has-1-cols">
                                <div class="grid">
                                    <div class="cell text-is-centered">
                                        <label htmlFor="username">Username: </label>
                                        <input class="input" type="text" id="user" name="username" placeholder="username" />
                                    </div>
                                    <div class="cell text-is-centered pl-1">
                                        <label htmlFor="pass">Password: </label>
                                        <input class="input" type="password" id="pass" name="pass" placeholder="password" />
                                    </div>
                                    <div class="cell text-is-centered pl-1">
                                        <label htmlFor="pass2">Password: </label>
                                        <input class="input" type="password" id="pass2" name="pass2" placeholder="retype password" />
                                    </div>
                                    <div class="cell text-is-centered pl-1">
                                        <label htmlFor='dateOfbirth'>Date of Birth: </label>
                                        <input type="date" id="dOb" name="dOb" />
                                    </div>
                                    <div class="cell pl-6 ml-6">
                                        <input className="button" type="submit" value="Sign up" />
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            </form>
    );
};

const init = () => {
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');
    const forgotpassButton = document.getElementById('forgotpassButton');

    const root = createRoot(document.getElementById('content'));

    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        helper.hideError();
        root.render( <LoginWindow /> );
        return false;
    });

    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        helper.hideError();
        root.render( <SignupWindow /> );
        return false;
    });

    forgotpassButton.addEventListener('click', (e) => {
        e.preventDefault();
        helper.hideError();
        root.render( <VerificationWindow /> );
        return false;
    });

    root.render( <LoginWindow /> );
};

window.onload = init;