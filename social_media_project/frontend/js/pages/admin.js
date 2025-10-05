import adminService from '../services/adminService.js';
import { setupNavigation } from '../utils/nav.js';

const app = document.getElementById('app');

const adminHtml = `
<div id="nav-placeholder"></div>
<div class="admin-container">
    <h1>Admin Dashboard</h1>

    <!-- User Management Section -->
    <section class="admin-section">
        <h2>User Management</h2>
        <table id="users-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Full Name</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="users-table-body">
                <!-- User data will be loaded here -->
            </tbody>
        </table>
    </section>

    <!-- Post Management Section -->
    <section class="admin-section">
        <h2>Post Management</h2>
        <table id="posts-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Author</th>
                    <th>Caption</th>
                    <th>Media URL</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="posts-table-body">
                <!-- Post data will be loaded here -->
            </tbody>
        </table>
    </section>
</div>
`;

const loadAdminPage = async () => {
    app.innerHTML = adminHtml;
    await setupNavigation('admin');

    // Load data for the dashboard
    await loadUsers();
    await loadPosts();
};

const loadUsers = async () => {
    const usersTableBody = document.getElementById('users-table-body');
    const token = localStorage.getItem('token');
    try {
        const { data: users } = await adminService.getAllUsers(token);
        usersTableBody.innerHTML = users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.full_name}</td>
                <td><button class="delete-user-btn" data-user-id="${user.id}">Delete</button></td>
            </tr>
        `).join('');

        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-user-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const userId = e.target.dataset.userId;
                if (confirm(`Are you sure you want to delete user ${userId}?`)) {
                    await adminService.deleteUser(userId, token);
                    await loadUsers(); // Refresh the list
                }
            });
        });
    } catch (error) {
        usersTableBody.innerHTML = '<tr><td colspan="5">Error loading users.</td></tr>';
    }
};

const loadPosts = async () => {
    const postsTableBody = document.getElementById('posts-table-body');
    const token = localStorage.getItem('token');
    try {
        const { data: posts } = await adminService.getAllPosts(token);
        postsTableBody.innerHTML = posts.map(post => `
            <tr>
                <td>${post.id}</td>
                <td>${post.username}</td>
                <td>${post.caption.substring(0, 50)}...</td>
                <td><a href="${post.media_url}" target="_blank">Link</a></td>
                <td><button class="delete-post-btn" data-post-id="${post.id}">Delete</button></td>
            </tr>
        `).join('');

        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-post-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const postId = e.target.dataset.postId;
                if (confirm(`Are you sure you want to delete post ${postId}?`)) {
                    await adminService.deletePost(postId, token);
                    await loadPosts(); // Refresh the list
                }
            });
        });
    } catch (error) {
        postsTableBody.innerHTML = '<tr><td colspan="5">Error loading posts.</td></tr>';
    }
};

export default loadAdminPage;