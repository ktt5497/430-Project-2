const React = require('react');
const {createRoot} = require('react-dom/client');

const ErrorWindow = () => {
    return (
        
        <div>
            <p>Sorry, but page isn't available. It was either removed or broken. Please head back to MemoryBoard.
            </p>
        </div>
        
    );
};

const init = () => {
    const root = createRoot(document.getElementById('content4'));
    root.render(<ErrorWindow />);
};

window.onload = init;