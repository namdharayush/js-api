const React = require('react');

const RejectRequestEmail = () => {

    return React.createElement(
        'div',
        { style: { fontFamily: 'Arial, sans-serif', color: '#333', padding: '20px', width: '100%', overflow: 'visible' } },
        React.createElement('h1', { style: { color: '#FF0000' } }, 'Unfortunately, Your Request Has Been Rejected'),
        React.createElement('p', null, 'We regret to inform you that your request has been rejected.'),
        React.createElement('p', null, 
            'If you have any questions, please contact support or try again later.'
        )
    );
};

module.exports = RejectRequestEmail;
