const React = require('react');

const EmailTemplate = ({ question, code, answer, explain, difficult, type, options,accessToken }) => {

    const accept_url = `http://localhost:8080/send-email/accepted?token=${accessToken}`
    const reject_url = `http://localhost:8080/send-email/rejected?token=${accessToken}`

    return React.createElement(
        'div',
        { style: { fontFamily: 'Arial, sans-serif', color: '#333', padding: '20px', width: '100%', overflow: 'visible' } },
        React.createElement('h1', { style: { color: '#007BFF' } }, 'Question Details'),
        React.createElement('p', null, React.createElement('strong', null, 'Question:'), ` ${question || 'Not provided'}`),
        React.createElement('p', null, 
            React.createElement('strong', null, 'Code:'), 
            React.createElement('pre', { style: { backgroundColor: '#f4f4f4', padding: '2px 4px', borderRadius: '4px', whiteSpace: 'pre-wrap', wordWrap: 'break-word' } }, code || 'Not provided')
        ),
        React.createElement('p', null, React.createElement('strong', null, 'Answer:'), ` ${answer || 'Not provided'}`),
        React.createElement('p', null, React.createElement('strong', null, 'Explanation:')),
        React.createElement('ul', { style: { margin: '10px 0', paddingLeft: '20px', whiteSpace: 'pre-wrap', overflow: 'visible' } },
            explain && explain.length > 0 ? explain.map((line, index) => 
                React.createElement('li', { key: index, style: { marginBottom: '10px' } }, line)
            ) : React.createElement('li', null, 'No explanation provided')
        ),
        React.createElement('p', null, React.createElement('strong', null, 'Difficulty:'), ` ${difficult || 'Not provided'}`),
        React.createElement('p', null, React.createElement('strong', null, 'Type:'), ` ${type || 'Not provided'}`),
        React.createElement('p', null, React.createElement('strong', null, 'Options:')),
        React.createElement('ul', { style: { margin: '10px 0', paddingLeft: '20px', whiteSpace: 'pre-wrap', overflow: 'visible' } },
            options && options.length > 0 ? options.map((option, index) => 
                React.createElement('li', { key: index, style: { marginBottom: '10px' } }, option)
            ) : React.createElement('li', null, 'No options provided')
        ),
        React.createElement('a', { href: accept_url, style: { textDecoration: 'none' ,cursor:'pointer'} },
            React.createElement('button', { style: { padding: '10px', borderRadius: '5px', marginBottom: '10px', border: 'none', width: '200px', backgroundColor: 'green', color: 'white', fontWeight: '650'} }, 'Accept')
        ),
        React.createElement('br', null),
        React.createElement('a', { href: reject_url, style: { textDecoration: 'none' ,cursor:'pointer'} },
            React.createElement('button', { style: { padding: '10px', borderRadius: '5px', marginBottom: '10px', border: 'none', width: '200px', backgroundColor: 'red', color: 'white', fontWeight: '650' } }, 'Reject')
        )
    );
};

module.exports = EmailTemplate;
