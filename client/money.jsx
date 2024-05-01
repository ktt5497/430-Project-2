const helper = require('./helper.js');
const React = require('react');
const {createRoot} = require('react-dom/client');

const premiumWindow = () => {
    return (
        <div>
            
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('content3'));
};

window.onload = init;