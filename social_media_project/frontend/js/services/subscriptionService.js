const API_URL = 'http://localhost:5000/api/subscriptions';

const subscriptionService = {
    subscribeToCreator: async (creatorId, token) => {
        const response = await fetch(`${API_URL}/subscribe/${creatorId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.json();
    }
};

export default subscriptionService;