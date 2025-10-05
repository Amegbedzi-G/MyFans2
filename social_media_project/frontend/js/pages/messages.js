import messageService from '../services/messageService.js';
import { setupNavigation } from '../utils/nav.js';

const app = document.getElementById('app');
let currentConversationId = null;
window.pollingInterval = null;

const messagesHtml = `
<div id="nav-placeholder"></div>
<div class="messages-container">
    <div class="conversations-list">
        <h2>Conversations</h2>
        <ul id="conversations">
            <!-- List of conversations will be loaded here -->
        </ul>
    </div>
    <div class="chat-window">
        <div id="chat-header"></div>
        <div id="chat-messages">
            <p>Select a conversation to start chatting.</p>
        </div>
        <div id="chat-input" style="display: none;">
            <form id="send-message-form">
                <input type="text" name="message" placeholder="Type a message...">
                <button type="submit">Send</button>
            </form>
        </div>
    </div>
</div>
`;

const loadMessagesPage = async () => {
    app.innerHTML = messagesHtml;
    await setupNavigation('messages');

    await loadConversations();

    const sendMessageForm = document.getElementById('send-message-form');
    sendMessageForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!currentConversationId) return;

        const formData = new FormData(sendMessageForm);
        const messageData = Object.fromEntries(formData.entries());
        const token = localStorage.getItem('token');

        try {
            const result = await messageService.sendMessage(currentConversationId, messageData, token);
            if (result.success) {
                sendMessageForm.reset();
                await loadChat(currentConversationId, false); // Refresh chat without clearing interval
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert('Error sending message.');
        }
    });
};

const loadConversations = async () => {
    const conversationsList = document.getElementById('conversations');
    const token = localStorage.getItem('token');
    try {
        const { data: conversations } = await messageService.getConversations(token);
        if (conversations.length > 0) {
            conversationsList.innerHTML = conversations.map(convo => `
                <li data-user-id="${convo.id}">
                    <img src="${convo.profile_picture || 'images/profile_icon.png'}" alt="${convo.username}'s profile" class="profile-pic-small">
                    <div>
                        <strong>${convo.username}</strong>
                        <p>${convo.last_message || 'No messages yet'}</p>
                    </div>
                </li>
            `).join('');

            conversationsList.querySelectorAll('li').forEach(li => {
                li.addEventListener('click', () => {
                    const userId = li.dataset.userId;
                    loadChat(userId, true);
                });
            });
        } else {
            conversationsList.innerHTML = '<li>No conversations found.</li>';
        }
    } catch (error) {
        conversationsList.innerHTML = '<li>Error loading conversations.</li>';
    }
};

const loadChat = async (userId, startPolling = true) => {
    if (startPolling && window.pollingInterval) {
        clearInterval(window.pollingInterval);
    }

    currentConversationId = userId;
    const chatHeader = document.getElementById('chat-header');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const token = localStorage.getItem('token');

    chatHeader.innerHTML = `<h3>Chat with User ${userId}</h3>`;
    chatInput.style.display = 'block';

    const renderMessages = async () => {
        try {
            const { data: messages } = await messageService.getConversation(userId, token);
            chatMessages.innerHTML = messages.map(msg => `
                <div class="message ${msg.sender_id == currentConversationId ? 'received' : 'sent'}">
                    <p>${msg.message}</p>
                    <span class="timestamp">${new Date(msg.created_at).toLocaleTimeString()}</span>
                </div>
            `).join('');
            chatMessages.scrollTop = chatMessages.scrollHeight;
        } catch (error) {
            chatMessages.innerHTML = '<p>Error loading messages.</p>';
        }
    };

    await renderMessages();
    if (startPolling) {
        window.pollingInterval = setInterval(renderMessages, 5000);
    }
};

export default loadMessagesPage;