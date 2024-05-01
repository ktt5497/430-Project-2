const React = require('react');
const {createRoot} = require('react-dom/client');

const PremiumWindow = (props) => {

    const handlePreniumBuy = async () => {
        try {
            const response = await fetch('/premium', {
                method: 'POST',
                header: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: props.query.username }),
            });
        } catch (err) {
            console.log(err);
        }
    }

    //Clicking the button should enable premium
    return (
        <div>
            <button onClick={handlePreniumBuy}>Buy Prenium</button>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('content3'));
    root.render(<PremiumWindow />);
};

window.onload = init;