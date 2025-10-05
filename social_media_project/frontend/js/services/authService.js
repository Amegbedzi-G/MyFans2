const API_URL = 'http://localhost:5000/api/auth';

const authService = {
    register: async (userData) => {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        return response.json();
    },

    login: async (userData) => {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to login');
        }

        const data = await response.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        return data;
    },

    logout: () => {
        localStorage.removeItem('token');
    }
};

export default authService;