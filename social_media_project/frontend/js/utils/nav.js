import authService from '../services/authService.js';

const navHtml = `
<nav class="top-nav">
    <div class="nav-container">
        <a href="#home" class="nav-logo">SocialSite</a>
        <ul class="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#messages">Messages</a></li>
            <li><a href="#profile">Profile</a></li>
            <li id="admin-link" style="display: none;"><a href="#admin">Admin</a></li>
            <li><button id="logout-btn-nav">Logout</button></li>
        </ul>
    </div>
</nav>
`;

export const setupNavigation = (page) => {
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (navPlaceholder) {
        navPlaceholder.innerHTML = navHtml;
    } else {
        console.error('Navigation placeholder not found on page:', page);
        return;
    }

    // Handle logout
    const logoutBtn = document.getElementById('logout-btn-nav');
    logoutBtn.addEventListener('click', () => {
        authService.logout();
        // Clear any intervals if they exist (e.g., from messages page)
        if (window.pollingInterval) {
            clearInterval(window.pollingInterval);
        }
        window.location.hash = '#login';
    });

    // Check for admin status and show link if applicable
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            const decodedToken = JSON.parse(jsonPayload);

            if (decodedToken.is_admin) {
                const adminLink = document.getElementById('admin-link');
                if (adminLink) adminLink.style.display = 'block';
            }
        } catch (e) {
            console.error('Error decoding token for admin check', e);
        }
    }
};