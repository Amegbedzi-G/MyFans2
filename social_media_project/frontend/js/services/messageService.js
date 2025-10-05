const API_URL = 'http://localhost:5000/api/messages';

const messageService = {
    getConversations: async (token) => {
        const response = await fetch(API_URL, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.json();
    },

    getConversation: async (userId, token) => {
        const response = await fetch(`${API_URL}/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.json();
    },

    sendMessage: async (userId, messageData, token) => {
        const response = await fetch(`${API_URL}/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(messageData)
        });
        return response.json();
    }
};

export default messageService;