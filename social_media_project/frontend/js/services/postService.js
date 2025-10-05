const API_URL = 'http://localhost:5000/api/posts';

const postService = {
    getPosts: async () => {
        const response = await fetch(API_URL);
        return response.json();
    },

    createPost: async (postData, token) => {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(postData)
        });
        return response.json();
    },

    updatePost: async (id, postData, token) => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(postData)
        });
        return response.json();
    },

    deletePost: async (id, token) => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.json();
    }
};

export default postService;