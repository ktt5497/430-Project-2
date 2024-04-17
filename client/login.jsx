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
                <label htmlFor="username">Username: </label>
                <input type="text" id="user" name="username" placeholder="username" />
                <label htmlFor="dateOfbirth">Date of Birth: </label>
                <input type="date" id="dOb2" name="dOb" />
                <input className="formVerify" type="submit" value="Verify to Set New Password" />
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
                <label htmlFor="username">Username: </label>
                <input type="text" id="user" name="username" placeholder="username" />
                <label htmlFor="pass">Password: </label>
                <input type="password" id="pass" name="pass" placeholder="password" />
                <input className="formSubmit" type="submit" value="Sign in" />
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
                <label htmlFor="username">Username: </label>
                <input type="text" id="user" name="username" placeholder="username" />
                <label htmlFor="pass">Password: </label>
                <input type="password" id="pass" name="pass" placeholder="password" />
                <label htmlFor="pass2">Password: </label>
                <input type="password" id="pass2" name="pass2" placeholder="retype password" />
                <label htmlFor='dateOfbirth'>Date of Birth: </label>
                <input type="date" id="dOb" name="dOb" />
                <input className="formSubmit" type="submit" value="Sign up" />
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
        root.render( <LoginWindow /> );
        return false;
    });

    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render( <SignupWindow /> );
        return false;
    });

    forgotpassButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render( <VerificationWindow /> );
        return false;
    });

    root.render( <LoginWindow /> );
};

window.onload = init;