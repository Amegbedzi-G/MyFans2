import authService from '../services/authService.js';

const app = document.getElementById('app');

const loginHtml = `
<div class="login-container">
    <h2>Login</h2>
    <form id="login-form">
        <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" required>
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required>
        </div>
        <button type="submit">Login</button>
    </form>
    <p>Don't have an account? <a href="#" id="show-register">Register</a></p>
</div>
`;

const registerHtml = `
<div class="register-container">
    <h2>Register</h2>
    <form id="register-form">
        <div class="form-group">
            <label for="full_name">Full Name</label>
            <input type="text" id="full_name" name="full_name" required>
        </div>
        <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" required>
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required>
        </div>
        <button type="submit">Register</button>
    </form>
    <p>Already have an account? <a href="#" id="show-login">Login</a></p>
</div>
`;

const loadAuthPage = () => {
    showLoginForm();
};

const showLoginForm = () => {
    app.innerHTML = loginHtml;
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(loginForm);
        const userData = Object.fromEntries(formData.entries());

        try {
            const data = await authService.login(userData);
            if (data.success) {
                alert('Login successful!');
                window.location.hash = '#home';
            }
        } catch (error) {
            alert(error.message);
        }
    });
    document.getElementById('show-register').addEventListener('click', showRegisterForm);
};

const showRegisterForm = () => {
    app.innerHTML = registerHtml;
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(registerForm);
        const userData = Object.fromEntries(formData.entries());

        try {
            const data = await authService.register(userData);
            alert(data.message);
            if (data.userId) {
                showLoginForm(); // Show login form after successful registration
            }
        } catch (error) {
            alert('Registration failed.');
        }
    });
    document.getElementById('show-login').addEventListener('click', showLoginForm);
};

export default loadAuthPage;