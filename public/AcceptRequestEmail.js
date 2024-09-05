const React = require('react');

const AcceptRequestEmail = () => {

    return React.createElement(
        'div',
        { style: { fontFamily: 'Arial, sans-serif', color: '#333', padding: '20px', width: '100%', overflow: 'visible' } },
        React.createElement('h1', { style: { color: '#007BFF' } }, 'Congratulations!'),
        React.createElement('p', null, 'Your request has been accepted.'),
        React.createElement('p', null, 
            'See the question in this link: ',
            React.createElement('a', { href: 'https://localhost:8000/', style: { color: '#007BFF', textDecoration: 'none' } }, 'https://localhost:8000/')
        )
    );
};

module.exports = AcceptRequestEmail;
