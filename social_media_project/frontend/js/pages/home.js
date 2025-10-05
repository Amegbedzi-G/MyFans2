import postService from '../services/postService.js';
import interactionService from '../services/interactionService.js';
import userService from '../services/userService.js';
import paymentService from '../services/paymentService.js';
import subscriptionService from '../services/subscriptionService.js';
import { setupNavigation } from '../utils/nav.js';

const app = document.getElementById('app');

const homeHtml = `
<div id="nav-placeholder"></div>
<div class="home-container">
    <main>
        <section class="create-post">
            <h2>Create a Post</h2>
            <form id="create-post-form">
                <textarea name="caption" placeholder="What's on your mind?"></textarea>
                <input type="text" name="media_url" placeholder="Image/Video URL" required>
                <select name="media_type">
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                </select>
                <button type="submit">Post</button>
            </form>
        </section>
        <section class="post-feed" id="post-feed">
            <!-- Posts will be loaded here -->
        </section>
    </main>
</div>
`;

const postTemplate = `
<div class="post" data-id="{{post.id}}">
    <div class="post-header">
        <img src="{{post.profile_picture}}" alt="{{post.username}}'s profile picture" class="profile-pic">
        <span class="username">{{post.username}}</span>
        <button class="follow-btn" data-user-id="{{post.user_id}}">Follow</button>
        <button class="subscribe-btn" data-user-id="{{post.user_id}}">Subscribe ($5.00)</button>
    </div>
    <div class="post-media">
        <!-- Media (image/video) is inserted here by home.js -->
        <div class="premium-overlay" style="display: none;">
            <h3>Premium Post</h3>
            <p>Purchase to unlock this content for $\{{post.price}}.</p>
            <button class="purchase-btn" data-post-id="{{post.id}}">Purchase</button>
        </div>
    </div>
    <div class="post-actions">
        <button class="like-btn" data-post-id="{{post.id}}">❤️</button>
        <span class="like-count">{{post.like_count}} likes</span>
        <button class="comment-btn" data-post-id="{{post.id}}">💬</button>
        <span class="comment-count">{{post.comment_count}} comments</span>
    </div>
    <div class="post-caption">
        <p><strong>{{post.username}}</strong> {{post.caption}}</p>
    </div>
    <div class="post-comments" id="comments-{{post.id}}" style="display: none;">
        <!-- Comments are loaded here when the comment button is clicked -->
    </div>
    <div class="add-comment">
        <form class="comment-form" data-post-id="{{post.id}}">
            <input type="text" name="comment" placeholder="Add a comment...">
            <button type="submit">Post</button>
        </form>
    </div>
</div>
`;

const loadHomePage = async () => {
    app.innerHTML = homeHtml;
    await setupNavigation('home');

    const postFeed = document.getElementById('post-feed');
    const createPostForm = document.getElementById('create-post-form');

    await loadPosts(postFeed);

    createPostForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(createPostForm);
        const postData = Object.fromEntries(formData.entries());
        const token = localStorage.getItem('token');

        try {
            const result = await postService.createPost(postData, token);
            if (result.success) {
                alert('Post created!');
                createPostForm.reset();
                await loadPosts(postFeed);
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert('Error creating post.');
        }
    });
};

const loadPosts = async (postFeed) => {
    try {
        const token = localStorage.getItem('token');
        const [postsResponse, purchasedResponse] = await Promise.all([
            postService.getPosts(),
            paymentService.getPurchasedPostIds(token)
        ]);

        const { data: posts } = postsResponse;
        const { data: purchasedPostIds } = purchasedResponse;

        postFeed.innerHTML = posts.map(post => {
            let renderedPost = postTemplate;
            for (const key in post) {
                const regex = new RegExp(`{{post.${key}}}`, 'g');
                renderedPost = renderedPost.replace(regex, post[key] || '');
            }
            // Manual replacement for price since it's inside a template literal
            renderedPost = renderedPost.replace(/\$\{{post.price}}/, `$${post.price}`);
            return renderedPost;
        }).join('');

        let currentUserId = null;
        if (token) {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
                currentUserId = JSON.parse(jsonPayload).id;
            } catch (e) {
                console.error('Error decoding token', e);
            }
        }

        posts.forEach(post => {
            const postElement = postFeed.querySelector(`.post[data-id="${post.id}"]`);
            const mediaContainer = postElement.querySelector('.post-media');
            const premiumOverlay = postElement.querySelector('.premium-overlay');

            const isPremium = post.is_premium;
            const isPurchased = purchasedPostIds.includes(post.id);

            if (isPremium && !isPurchased && post.user_id !== currentUserId) {
                premiumOverlay.style.display = 'flex';
            } else {
                if (post.media_type === 'image') {
                    mediaContainer.insertAdjacentHTML('afterbegin', `<img src="${post.media_url}" alt="Post media">`);
                } else if (post.media_type === 'video') {
                    mediaContainer.insertAdjacentHTML('afterbegin', `<video controls src="${post.media_url}"></video>`);
                }
            }

            const followBtn = postElement.querySelector('.follow-btn');
            const subscribeBtn = postElement.querySelector('.subscribe-btn');
            if (post.user_id === currentUserId) {
                if (followBtn) followBtn.style.display = 'none';
                if (subscribeBtn) subscribeBtn.style.display = 'none';
            }

            addEventListenersToPost(postElement, post.id);
        });

    } catch (error) {
        console.error(error);
        postFeed.innerHTML = 'Error loading posts.';
    }
};

const addEventListenersToPost = (postElement, postId) => {
    const token = localStorage.getItem('token');

    const likeBtn = postElement.querySelector('.like-btn');
    likeBtn.addEventListener('click', async () => {
        try {
            await interactionService.likePost(postId, token);
            alert('Post liked!');
        } catch (error) {
            alert('Error liking post.');
        }
    });

    const followBtn = postElement.querySelector('.follow-btn');
    if (followBtn) {
        followBtn.addEventListener('click', async () => {
            const userIdToFollow = followBtn.dataset.userId;
            try {
                const result = await userService.followUser(userIdToFollow, token);
                if (result.success) {
                    alert('User followed!');
                    followBtn.textContent = 'Following';
                    followBtn.disabled = true;
                } else {
                    alert(result.message);
                }
            } catch (error) {
                alert('Error following user.');
            }
        });
    }

    const subscribeBtn = postElement.querySelector('.subscribe-btn');
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', async () => {
            const userIdToSubscribe = subscribeBtn.dataset.userId;
            try {
                const result = await subscriptionService.subscribeToCreator(userIdToSubscribe, token);
                if (result.success) {
                    alert('Subscribed successfully!');
                    subscribeBtn.textContent = 'Subscribed';
                    subscribeBtn.disabled = true;
                } else {
                    alert(result.message);
                }
            } catch (error) {
                alert('Error subscribing.');
            }
        });
    }

    const purchaseBtn = postElement.querySelector('.purchase-btn');
    if (purchaseBtn) {
        purchaseBtn.addEventListener('click', async () => {
            const postIdToPurchase = purchaseBtn.dataset.postId;
            try {
                const result = await paymentService.purchasePost(postIdToPurchase, token);
                if (result.success) {
                    alert('Post purchased successfully!');
                    await loadPosts(document.getElementById('post-feed'));
                } else {
                    alert(result.message);
                }
            } catch (error) {
                alert('Error purchasing post.');
            }
        });
    }

    const commentBtn = postElement.querySelector('.comment-btn');
    const commentsSection = postElement.querySelector('.post-comments');
    commentBtn.addEventListener('click', async () => {
        const isHidden = commentsSection.style.display === 'none';
        if (isHidden) {
            await loadComments(postId, commentsSection);
            commentsSection.style.display = 'block';
        } else {
            commentsSection.style.display = 'none';
        }
    });

    const commentForm = postElement.querySelector('.comment-form');
    commentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(commentForm);
        const commentData = Object.fromEntries(formData.entries());

        try {
            const result = await interactionService.addComment(postId, commentData, token);
            if (result.success) {
                commentForm.reset();
                await loadComments(postId, commentsSection);
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert('Error adding comment.');
        }
    });
};

const loadComments = async (postId, commentsSection) => {
    try {
        const { data: comments } = await interactionService.getComments(postId);
        if (comments.length > 0) {
            commentsSection.innerHTML = comments.map(comment => `
                <div class="comment">
                    <p><strong>${comment.username}</strong> ${comment.comment}</p>
                </div>
            `).join('');
        } else {
            commentsSection.innerHTML = '<p>No comments yet.</p>';
        }
    } catch (error) {
        commentsSection.innerHTML = '<p>Error loading comments.</p>';
    }
};

export default loadHomePage;