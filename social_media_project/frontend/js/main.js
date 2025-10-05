import loadAuthPage from './pages/auth.js';
import loadHomePage from './pages/home.js';
import loadMessagesPage from './pages/messages.js';
import loadAdminPage from './pages/admin.js';

const app = document.getElementById('app');

const routes = {
    '#login': loadAuthPage,
    '#home': loadHomePage,
    '#messages': loadMessagesPage,
    '#admin': loadAdminPage
};

const router = () => {
    const token = localStorage.getItem('token');
    let path = window.location.hash || '#login';

    // If user has a token but is on the login page, redirect to home
    if (token && path === '#login') {
        path = '#home';
        window.location.hash = '#home';
    }

    // If user has no token, force them to the login page
    if (!token) {
        path = '#login';
    }

    const route = routes[path] || routes['#login'];
    route();
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);