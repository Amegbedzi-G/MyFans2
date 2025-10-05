const API_URL = 'http://localhost:5000/api/posts';

const interactionService = {
    likePost: async (postId, token) => {
        const response = await fetch(`${API_URL}/${postId}/like`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.json();
    },

    unlikePost: async (postId, token) => {
        const response = await fetch(`${API_URL}/${postId}/like`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.json();
    },

    getComments: async (postId) => {
        const response = await fetch(`${API_URL}/${postId}/comments`);
        return response.json();
    },

    addComment: async (postId, commentData, token) => {
        const response = await fetch(`${API_URL}/${postId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(commentData)
        });
        return response.json();
    }
};

export default interactionService;