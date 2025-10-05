const API_URL = 'http://localhost:5000/api/admin';

const adminService = {
    getAllUsers: async (token) => {
        const response = await fetch(`${API_URL}/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    },

    deleteUser: async (userId, token) => {
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    },

    getAllPosts: async (token) => {
        const response = await fetch(`${API_URL}/posts`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    },

    deletePost: async (postId, token) => {
        const response = await fetch(`${API_URL}/posts/${postId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.json();
    }
};

export default adminService;