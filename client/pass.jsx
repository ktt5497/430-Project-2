const helper = require('./helper.js');
const React = require('react');
const {createRoot} = require('react-dom/client');

const handlePass = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const newPass = e.target.querySelector('#newPass').value;
    const newPass2 = e.target.querySelector('#newPass2').value;

    if(!username || !newPass || !newPass2) {
        helper.handleError('All requirements are needed!');
        return false;
    }

    if(newPass != newPass2) {
        helper.handleError('Passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, {username, newPass, newPass2});
    return false;
}

const SetNewPassWindow = (props) => {
    return (
        <form id="newPassForm"
            name="newPassForm"
            onSubmit={handlePass}
            action="/setNewPassword"
            method='POST'
            className="mainForm">
                <div className="columns is-centered">
                    <div className="column is-half is-offset-one-quarter">
                        <div class="fixed-grid has-1-cols">
                                <div class="grid">
                                    <div class="cell text-is-centered pl-1">
                                        <label htmlFor="username">Username: </label>
                                        <input class="input" type="username" id="user" name="username" value={sessionStorage.getItem('username')} disabled />
                                    </div>
                                    <div class="cell text-is-centered pl-1">
                                        <label htmlFor="newPass">New Password: </label>
                                        <input class="input" type="password" id="newPass" name="newPass" placeholder="New password" />
                                    </div>
                                    <div class="cell text-is-centered pl-1">
                                        <label htmlFor="newPass2">Confirm Password: </label>
                                        <input class="input" type="password" id="newPass2" name="newPass2" placeholder="Retype new password" />
                                    </div>
                                    <div class="cell">
                                    <input className="button" type="submit" value="Set New Password" />
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            </form>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('content2'));
    root.render( <SetNewPassWindow /> );
};

window.onload = init;