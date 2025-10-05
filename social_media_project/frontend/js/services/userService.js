const API_URL = 'http://localhost:5000/api/users';

const userService = {
    followUser: async (userId, token) => {
        const response = await fetch(`${API_URL}/${userId}/follow`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.json();
    },

    unfollowUser: async (userId, token) => {
        const response = await fetch(`${API_URL}/${userId}/follow`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.json();
    }
};

export default userService;