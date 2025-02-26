const form = document.getElementById('signup-form');
const message = document.getElementById('message');

// Replace with your GitHub Personal Access Token
const GITHUB_TOKEN = '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';

// Gist details
const GIST_ID = 'https://gist.github.com/sarathch66/b12646faee139b01188f3c7550d7c304.js';
const GIST_FILENAME = 'signup_data.json';

// Function to get existing data from Gist
async function fetchGistData() {
    const response = await fetch(`https://api.github.com/gists/${GIST_ID}`);
    const gist = await response.json();
    return JSON.parse(gist.files[GIST_FILENAME].content);
}

// Function to update Gist with new user data
async function updateGistData(newUser) {
    let users = await fetchGistData();
    users.push(newUser);

    const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            files: {
                [GIST_FILENAME]: {
                    content: JSON.stringify(users, null, 2)
                }
            }
        })
    });

    return response.ok;
}

// Form submission event
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const user = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    const success = await updateGistData(user);
    message.textContent = success ? 'Sign-up successful!' : 'Error signing up.';
    form.reset();
});