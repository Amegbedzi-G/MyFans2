const API_URL = 'http://localhost:5000/api/payments';

const paymentService = {
    getPurchasedPostIds: async (token) => {
        const response = await fetch(`${API_URL}/purchased/posts`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.json();
    },
    purchasePost: async (postId, token) => {
        const response = await fetch(`${API_URL}/purchase/post/${postId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.json();
    }
};

export default paymentService;