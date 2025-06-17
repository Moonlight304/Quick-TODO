const axios = require('axios');
const dotenv = require('dotenv').config();
const { ipcRenderer } = require('electron');

const inputElement = document.querySelector('input');


async function sendTODO(todoText) {
    try {
        inputElement.classList.add('loading');
        
        const payload = {
            content: todoText
        }

        const response = await axios.post('https://api.todoist.com/api/v1/tasks', payload, {
            headers: {
                'Authorization': `Bearer ${process.env.TODOIST_API_TOKEN}`,
                "Content-Type": 'application/json'
            }
        });

        inputElement.classList.remove('loading');
        inputElement.classList.add('success');
        inputElement.value = 'Task Added';
        
        setTimeout(() => {
            ipcRenderer.send('quit-app');
        }, 500);

    } 
    catch (e) {
        inputElement.classList.remove('loading');
        inputElement.classList.add('error');
        inputElement.value = 'Failed';
        console.error(e);
        
        setTimeout(() => {
            inputElement.classList.remove('error');
            inputElement.value = '';
        }, 1500);
    }
}

// Handle keyboard events
inputElement.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        ipcRenderer.send('quit-app');
    }

    if (event.key === 'Enter' && inputElement.value.trim()) {
        const todoText = inputElement.value.trim();

        sendTODO(todoText);

    }
});

// Prevent click propagation from input
inputElement.addEventListener('click', (event) => {
    event.stopPropagation();
});