
  // Store posts in memory
  let posts = [...initialPosts];
  let nextPostId = posts.length + 1;
  let nextCommentId = 5; // Starting after the initial comments
  let postPreviewUrl = null;
  
  // DOM Elements
  const postsContainer = document.getElementById('posts-container');
  const postTextInput = document.getElementById('post-text');
  const fileInput = document.getElementById('fileInput');
  const postPreview = document.getElementById('post-preview');
  const previewImage = document.getElementById('preview-image');
  
  // Initialize the app
  document.addEventListener('DOMContentLoaded', () => {
    renderPosts();
  });
  
  // Trigger file input for stories
  function triggerFileInput() {
    document.getElementById('story-file-input').click();
  }
  
  // Preview story
  function previewStory(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const storyUrl = e.target.result;
        addStory(storyUrl);
      };
      reader.readAsDataURL(file);
    }
  }
  
  // Add a story
  function addStory(storyUrl) {
    const postedStories = document.getElementById('posted-stories');
    
    const storyElement = document.createElement('div');
    storyElement.className = 'story';
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'story-avatar';
    
    const img = document.createElement('img');
    img.src = storyUrl;
    img.alt = 'Your Story';
    
    const text = document.createElement('p');
    text.textContent = 'Your Story';
    
    avatarDiv.appendChild(img);
    storyElement.appendChild(avatarDiv);
    storyElement.appendChild(text);
    
    postedStories.appendChild(storyElement);
  }
  
  // Preview post image
  function previewPost(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        postPreviewUrl = e.target.result;
        previewImage.src = postPreviewUrl;
        postPreview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  }
  
  // Remove preview
  function removePreview() {
    postPreviewUrl = null;
    postPreview.style.display = 'none';
    fileInput.value = '';
  }
  
  // Create a new post
  function createPost() {
    const text = postTextInput.value.trim();
    if (!text && !postPreviewUrl) return;
    
    const newPost = {
      id: nextPostId++,
      userId: 1, // Current user
      image: postPreviewUrl || 'https://via.placeholder.com/600x400',
      likes: 0,
      caption: text,
      liked: false,
      comments: []
    };
    
    posts.unshift(newPost);
    renderPosts();
    
    // Reset form
    postTextInput.value = '';
    removePreview();
  }
  
  // Render all posts
  function renderPosts() {
    postsContainer.innerHTML = '';
    
    posts.forEach(post => {
      const user = users.find(u => u.id === post.userId);
      const postElement = createPostElement(post, user);
      postsContainer.appendChild(postElement);
    });
  }
  
  // Create a post element
  function createPostElement(post, user) {
    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.id = `post-${post.id}`;
    
    // Post header
    const postHeader = document.createElement('div');
    postHeader.className = 'post-header';
    
    const userAvatar = document.createElement('img');
    userAvatar.src = user.avatar;
    userAvatar.alt = user.username;
    userAvatar.className = 'user-avatar';
    
    const username = document.createElement('p');
    username.className = 'username';
    username.textContent = user.username;
    
    if (user.isVerified) {
      const verifiedIcon = document.createElement('img');
      verifiedIcon.src = 'https://via.placeholder.com/16';
      verifiedIcon.alt = 'Verified';
      verifiedIcon.className = 'verification-icon';
      username.appendChild(verifiedIcon);
    }
    
    const headerButtons = document.createElement('div');
    headerButtons.className = 'post-header-buttons';
    
    const editButton = document.createElement('button');
    editButton.className = 'option-btn';
    editButton.innerHTML = '<span class="option-icon">⋮</span><span>Edit</span>';
    editButton.onclick = () => editPost(post.id);
    
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.innerHTML = '<span class="delete-icon">🗑️</span><span>Delete</span>';
    deleteButton.onclick = () => deletePost(post.id);
    
    headerButtons.appendChild(editButton);
    headerButtons.appendChild(deleteButton);
    
    postHeader.appendChild(userAvatar);
    postHeader.appendChild(username);
    postHeader.appendChild(headerButtons);
    
    // Post image
    const postImage = document.createElement('img');
    postImage.src = post.image;
    postImage.alt = 'Post';
    postImage.className = 'post-image';
    
    // Post actions
    const postActions = document.createElement('div');
    postActions.className = 'post-actions-container';
    
    const likeBtn = document.createElement('button');
    likeBtn.className = `action-btn like-btn ${post.liked ? 'active' : ''}`;
    likeBtn.innerHTML = `<img src="heaart.png" alt="Like" class="icon"> Like`;
    likeBtn.onclick = () => toggleLike(post.id);
    
    const commentBtn = document.createElement('button');
    commentBtn.className = 'action-btn comment-btn';
    commentBtn.innerHTML = '<img src="https://via.placeholder.com/20" alt="Comment" class="icon"> Comment';
    commentBtn.onclick = () => focusCommentInput(post.id);
    
    const shareBtn = document.createElement('button');
    shareBtn.className = 'action-btn share-btn';
    shareBtn.innerHTML = '<img src="https://via.placeholder.com/20" alt="Share" class="icon"> Share';
    
    const tipBtn = document.createElement('button');
    tipBtn.className = 'action-btn tip-btn';
    tipBtn.innerHTML = '<img src="https://via.placeholder.com/20" alt="Tip" class="icon"> Tip';
    
    postActions.appendChild(likeBtn);
    postActions.appendChild(commentBtn);
    postActions.appendChild(shareBtn);
    postActions.appendChild(tipBtn);
    
    // Post details
    const likes = document.createElement('p');
    likes.className = 'likes';
    likes.textContent = `${post.likes} likes`;
    
    const caption = document.createElement('p');
    caption.className = 'caption';
    caption.innerHTML = `<strong>${user.username}</strong> ${post.caption}`;
    
    // Comments section
    const commentsSection = document.createElement('div');
    commentsSection.className = 'comments-section';
    
    // Render existing comments
    post.comments.forEach(comment => {
      const commentUser = users.find(u => u.id === comment.userId);
      const commentElement = createCommentElement(comment, commentUser);
      commentsSection.appendChild(commentElement);
    });
    
    // Add comment form
    const addComment = document.createElement('div');
    addComment.className = 'add-comment';
    
    const commentAvatar = document.createElement('img');
    commentAvatar.src = users[0].avatar; // Current user
    commentAvatar.alt = 'Your Avatar';
    commentAvatar.className = 'comment-avatar';
    
    const commentInput = document.createElement('input');
    commentInput.type = 'text';
    commentInput.placeholder = 'Add a comment...';
    commentInput.className = 'comment-input';
    commentInput.id = `comment-input-${post.id}`;
    
    const postCommentBtn = document.createElement('button');
    postCommentBtn.className = 'post-comment-btn';
    postCommentBtn.textContent = 'Post';
    postCommentBtn.onclick = () => addCommentToPost(post.id);
    
    addComment.appendChild(commentAvatar);
    addComment.appendChild(commentInput);
    addComment.appendChild(postCommentBtn);
    
    commentsSection.appendChild(addComment);
    
    // Append all elements to post
    postElement.appendChild(postHeader);
    postElement.appendChild(postImage);
    postElement.appendChild(postActions);
    postElement.appendChild(likes);
    postElement.appendChild(caption);
    postElement.appendChild(commentsSection);
    
    return postElement;
  }
  
  // Create a comment element
  function createCommentElement(comment, user) {
    const commentElement = document.createElement('div');
    commentElement.className = 'comment';
    
    const commentAvatar = document.createElement('img');
    commentAvatar.src = user.avatar;
    commentAvatar.alt = user.username;
    commentAvatar.className = 'comment-avatar';
    
    const commentContent = document.createElement('div');
    commentContent.className = 'comment-content';
    
    const commentUsername = document.createElement('p');
    commentUsername.className = 'comment-username';
    commentUsername.textContent = user.username;
    
    const commentText = document.createElement('p');
    commentText.className = 'comment-text';
    commentText.textContent = comment.text;
    
    commentContent.appendChild(commentUsername);
    commentContent.appendChild(commentText);
    
    commentElement.appendChild(commentAvatar);
    commentElement.appendChild(commentContent);
    
    return commentElement;
  }
  
  // Toggle like on a post
  function toggleLike(postId) {
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
      posts[postIndex].liked = !posts[postIndex].liked;
      posts[postIndex].likes += posts[postIndex].liked ? 1 : -1;
      renderPosts();
    }
  }
  
  // Focus on comment input
  function focusCommentInput(postId) {
    const commentInput = document.getElementById(`comment-input-${postId}`);
    if (commentInput) {
      commentInput.focus();
    }
  }
  
  // Add comment to post
  function addCommentToPost(postId) {
    const commentInput = document.getElementById(`comment-input-${postId}`);
    const commentText = commentInput.value.trim();
    
    if (commentText) {
      const postIndex = posts.findIndex(p => p.id === postId);
      if (postIndex !== -1) {
        const newComment = {
          id: nextCommentId++,
          userId: 1, // Current user
          text: commentText
        };
        
        posts[postIndex].comments.push(newComment);
        renderPosts();
      }
    }
  }
  
  // Edit post
  function editPost(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
      const newCaption = prompt('Edit your caption:', post.caption);
      if (newCaption !== null) {
        post.caption = newCaption;
        renderPosts();
      }
    }
  }
  
  // Delete post
  function deletePost(postId) {
    if (confirm('Are you sure you want to delete this post?')) {
      posts = posts.filter(p => p.id !== postId);
      renderPosts();
    }
  }
  
  // Toggle options dropdown
  function toggleOptions(postId) {
    alert('Toggle options function called for post ' + postId);
    // Add toggle options logic here
  }
  
  // Delete item
  function deleteItem(postId) {
    alert('Delete function called for post ' + postId);
    deletePost(postId);
  }
  
  // Initialize the app when the DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    // Clear the sample post and render the posts from our data
    postsContainer.innerHTML = '';
    renderPosts();
  });




  ////creator//////  
  document.addEventListener('DOMContentLoaded', function() {
    // Handle file input changes to show file name
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
        input.addEventListener('change', function(e) {
            const fileName = e.target.files[0]?.name || 'No file selected';
            const fileNameElement = document.getElementById(`${e.target.id}-name`);
            
            if (fileNameElement) {
                fileNameElement.textContent = fileName;
            }
            
            // Add a class to the parent upload box to show it's selected
            const uploadBox = this.closest('.upload-box');
            if (uploadBox) {
                uploadBox.classList.add('file-selected');
            }
        });
    });

    // Form validation and submission
    const form = document.getElementById('creator-form');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Basic validation
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });
        
        // File validation
        const idPhoto = document.getElementById('id-photo');
        const holdingIdPhoto = document.getElementById('holding-id-photo');
        
        if (idPhoto.files.length === 0) {
            isValid = false;
            idPhoto.closest('.upload-box').classList.add('error');
        } else {
            idPhoto.closest('.upload-box').classList.remove('error');
        }
        
        if (holdingIdPhoto.files.length === 0) {
            isValid = false;
            holdingIdPhoto.closest('.upload-box').classList.add('error');
        } else {
            holdingIdPhoto.closest('.upload-box').classList.remove('error');
        }
        
        // If form is valid, submit
        if (isValid) {
            // In a real application, you would submit the form data to the server here
            console.log('Form submitted successfully');
            alert('Your application has been submitted for approval.');
            
            // Optional: Reset form after submission
            form.reset();
            document.querySelectorAll('.file-name').forEach(el => {
                el.textContent = '';
            });
            document.querySelectorAll('.file-selected').forEach(el => {
                el.classList.remove('file-selected');
            });
        } else {
            alert('Please fill in all required fields and upload the necessary documents.');
        }
    });

    // Add error styling for CSS
    const style = document.createElement('style');
    style.textContent = `
        .error {
            border-color: #ff3860 !important;
        }
        .upload-box.error {
            border-color: #ff3860 !important;
        }
        .upload-box.file-selected {
            border-color: #54d858 !important;
            background-color: rgba(84, 216, 88, 0.05);
        }
    `;
    document.head.appendChild(style);
});
  ////creator//////
  
  

  /////search//////
  document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const followButtons = document.querySelectorAll('.follow-btn');
    
    // Search functionality
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', function(event) {
      if (event.key === 'Enter') {
        performSearch();
      }
      
      // Show/hide search hint based on input length
      const searchHint = document.querySelector('.search-hint');
      if (searchInput.value.length > 0 && searchInput.value.length < 3) {
        searchHint.style.display = 'block';
      } else {
        searchHint.style.display = 'none';
      }
    });
    
    function performSearch() {
      const searchTerm = searchInput.value.trim();
      if (searchTerm.length < 3) {
        alert('Please enter at least 3 characters to search');
        return;
      }
      
      // In a real app, you would fetch search results from a server
      console.log('Searching for:', searchTerm);
      
      // For demo purposes, we'll just show a message
      const resultsTitle = document.querySelector('.search-results h2');
      resultsTitle.textContent = `Results for "${searchTerm}"`;
    }
    
    // Filter buttons
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // In a real app, you would filter the results based on the selected filter
        const filterType = this.textContent;
        console.log('Filter selected:', filterType);
        
        // Update results title based on filter
        const resultsTitle = document.querySelector('.search-results h2');
        
        if (filterType === 'All') {
          resultsTitle.textContent = 'Popular Users';
        } else {
          resultsTitle.textContent = `${filterType}`;
        }
      });
    });
    
    // Follow/Unfollow functionality
    followButtons.forEach(button => {
      button.addEventListener('click', function() {
        if (this.classList.contains('following')) {
          this.classList.remove('following');
          this.textContent = 'Follow';
        } else {
          this.classList.add('following');
          this.textContent = 'Following';
        }
      });
    });
    
    // Focus on search input when page loads
    searchInput.focus();
  });
  /////search//////


  ////notification////
  document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const refreshBtn = document.querySelector('.refresh-btn');
    const markReadBtn = document.querySelector('.mark-read-btn');
    const emptyState = document.querySelector('.empty-state');
    const notificationsList = document.querySelector('.notifications-list');
    
    // For demo purposes: Toggle between empty state and notifications list
    let hasNotifications = false;
    
    refreshBtn.addEventListener('click', function() {
      // Toggle between empty state and notifications list
      hasNotifications = !hasNotifications;
      
      if (hasNotifications) {
        emptyState.style.display = 'none';
        notificationsList.style.display = 'flex';
        markReadBtn.style.display = 'block';
      } else {
        emptyState.style.display = 'flex';
        notificationsList.style.display = 'none';
        markReadBtn.style.display = 'none';
      }
    });
    
    // Mark all as read functionality
    markReadBtn.addEventListener('click', function() {
      const unreadItems = document.querySelectorAll('.notification-item.unread');
      unreadItems.forEach(item => {
        item.classList.remove('unread');
        const indicator = item.querySelector('.unread-indicator');
        if (indicator) {
          indicator.remove();
        }
      });
    });
    
    // Hide mark as read button if there are no notifications
    if (!hasNotifications) {
      markReadBtn.style.display = 'none';
    }
    
    // Make notification items interactive
    const notificationItems = document.querySelectorAll('.notification-item');
    notificationItems.forEach(item => {
      item.addEventListener('click', function() {
        // Remove unread status when clicked
        if (this.classList.contains('unread')) {
          this.classList.remove('unread');
          const indicator = this.querySelector('.unread-indicator');
          if (indicator) {
            indicator.remove();
          }
        }
        
        // In a real app, you would navigate to the relevant content
        console.log('Notification clicked');
      });
    });
  });
  ////notification////

  ////chat////
  document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const messageBox = document.getElementById('messageBox');
    const messagesContainer = document.getElementById('messages');
    const backButton = document.getElementById('backButton');
    const sidebar = document.querySelector('.sidebar');
    const chatItems = document.querySelectorAll('.chat-item');
    const attachmentBtn = document.querySelector('.attachment-btn');
    const attachmentMenu = document.querySelector('.attachment-menu');
    
    // Initialize recording variables
    let mediaRecorder;
    let audioChunks = [];
    let recordingTimer;
    let recordingSeconds = 0;
    
    // Mobile navigation
    backButton.addEventListener('click', function() {
      sidebar.classList.add('active');
    });
    
    // Chat item selection
    chatItems.forEach(item => {
      item.addEventListener('click', function() {
        // Remove active class from all items
        chatItems.forEach(chat => chat.classList.remove('active'));
        
        // Add active class to clicked item
        this.classList.add('active');
        
        // On mobile, hide sidebar after selection
        if (window.innerWidth <= 768) {
          sidebar.classList.remove('active');
        }
      });
    });
    
    // Attachment menu toggle
    attachmentBtn.addEventListener('click', function() {
      attachmentMenu.style.display = attachmentMenu.style.display === 'none' ? 'block' : 'none';
    });
    
    // Close attachment menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!event.target.closest('.attachment-btn') && !event.target.closest('.attachment-menu')) {
        attachmentMenu.style.display = 'none';
      }
    });
    
    // Send message on Enter key
    messageBox.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
      }
    });
    
    // Function to send a message
    window.sendMessage = function() {
      const messageText = messageBox.value.trim();
      
      if (messageText) {
        // Get current time
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        const formattedTime = `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
        
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message sent';
        messageDiv.innerHTML = `
          <div class="message-content">
            <p>${messageText}</p>
            <span class="timestamp">${formattedTime}</span>
          </div>
        `;
        
        // Add to chat
        messagesContainer.appendChild(messageDiv);
        
        // Clear input and scroll to bottom
        messageBox.value = '';
        scrollToBottom();
      }
    };
    
    // Function to start voice recording
    window.startVoiceRecording = function() {
      audioChunks = [];
      recordingSeconds = 0;
      
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          mediaRecorder = new MediaRecorder(stream);
          
          mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
          };
          
          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            sendVoiceMessage(audioBlob);
            clearInterval(recordingTimer);
          };
          
          // Start recording
          mediaRecorder.start();
          document.getElementById('voiceRecordingSection').style.display = 'flex';
          
          // Update recording time
          recordingTimer = setInterval(() => {
            recordingSeconds++;
            const minutes = Math.floor(recordingSeconds / 60);
            const seconds = recordingSeconds % 60;
            document.querySelector('.recording-time').textContent = 
              `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
          }, 1000);
        })
        .catch(err => {
          console.error('Error accessing microphone:', err);
          alert('Could not access your microphone.');
        });
    };
    
    // Function to stop voice recording
    window.stopVoiceRecording = function() {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        document.getElementById('voiceRecordingSection').style.display = 'none';
      }
    };
    
    // Function to send voice message
    function sendVoiceMessage(audioBlob) {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedTime = `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
      
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message sent';
      messageDiv.innerHTML = `
        <div class="message-content">
          <p>
            <i class="fas fa-microphone"></i> Voice message
            <audio controls src="${audioUrl}"></audio>
          </p>
          <span class="timestamp">${formattedTime}</span>
        </div>
      `;
      
      messagesContainer.appendChild(messageDiv);
      scrollToBottom();
    }
    
    // Function to send an image
    window.sendImage = function(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedTime = `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
      
      const reader = new FileReader();
      reader.onload = function(e) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message sent';
        messageDiv.innerHTML = `
          <div class="message-content">
            <p><img src="${e.target.result}" alt="Image" style="max-width: 200px; border-radius: 5px;"></p>
            <span class="timestamp">${formattedTime}</span>
          </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        scrollToBottom();
      };
      
      reader.readAsDataURL(file);
    };
    
    // Function to start a voice call (simulation)
    window.startVoiceCall = function() {
      alert('Starting voice call with Sarah Williams...');
    };
    
    // Function to start a video call (simulation)
    window.startVideoCall = function() {
      alert('Starting video call with Sarah Williams...');
    };
    
    // Function to scroll to bottom of messages
    function scrollToBottom() {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Initial scroll to bottom
    scrollToBottom();
    
    // Handle window resize for responsive behavior
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768) {
        sidebar.classList.remove('active');
      }
    });
  });
  
////chat////



/////settings///
document.addEventListener('DOMContentLoaded', function() {
  // Retrieve the display name from localStorage
  const displayName = localStorage.getItem('displayName');
  if (displayName) {
    document.getElementById('display-name').textContent = displayName;
  }

  // Highlight active navigation item
  const currentPage = window.location.pathname.split('/').pop();
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    const itemHref = item.getAttribute('href');
    if (itemHref === currentPage || (currentPage === 'index.html' && itemHref === 'setting.html')) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Language switcher functionality
  const languageSwitch = document.querySelector('.language-switch');
  if (languageSwitch) {
    languageSwitch.addEventListener('click', function() {
      // This would typically open a language selection modal or dropdown
      alert('Language selection feature coming soon!');
    });
  }
  
  // Theme toggle functionality (if needed)
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      document.body.classList.toggle('dark-theme');
      const isDarkTheme = document.body.classList.contains('dark-theme');
      localStorage.setItem('darkTheme', isDarkTheme);
    });
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme === 'true') {
      document.body.classList.add('dark-theme');
    }
  }
  
  // Handle menu item clicks with animations
  const menuItems = document.querySelectorAll('.menu-options li a');
  menuItems.forEach(item => {
    item.addEventListener('click', function(e) {
      // Add a subtle ripple effect or highlight when clicked
      const ripple = document.createElement('span');
      ripple.classList.add('ripple-effect');
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 500);
    });
  });
  
  // Sign out functionality
  const signOutBtn = document.querySelector('.sign-out-btn');
  if (signOutBtn) {
    signOutBtn.addEventListener('click', function(e) {
      // You might want to show a confirmation dialog
      if (confirm('Are you sure you want to sign out?')) {
        // Clear user data from localStorage if needed
        // localStorage.clear();
        // Then redirect to login page
        // window.location.href = 'form.html';
      } else {
        e.preventDefault();
      }
    });
  }
});
////settings///////


/////card/////
document.addEventListener('DOMContentLoaded', function() {
  const cardForm = document.getElementById('card-form');
  const cardNumberInput = document.getElementById('card-number');
  const expirationDateInput = document.getElementById('expiration-date');
  const cvvInput = document.getElementById('cvv');
  const cardHolderInput = document.getElementById('card-holder');
  
  // Format card number as user types (add spaces every 4 digits)
  cardNumberInput.addEventListener('input', function(e) {
      // Store cursor position
      const cursorPosition = e.target.selectionStart;
      const previousLength = e.target.value.length;
      
      // Format the value
      let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      
      // Limit to 16 digits
      value = value.substring(0, 16);
      
      let formattedValue = '';
      for (let i = 0; i < value.length; i++) {
          if (i > 0 && i % 4 === 0) {
              formattedValue += ' ';
          }
          formattedValue += value[i];
      }
      
      e.target.value = formattedValue;
      
      // Adjust cursor position if spaces were added/removed
      const newLength = e.target.value.length;
      const lengthDiff = newLength - previousLength;
      
      // Only adjust if user is typing (not deleting)
      if (lengthDiff > 0 && cursorPosition === previousLength) {
          e.target.setSelectionRange(cursorPosition + lengthDiff, cursorPosition + lengthDiff);
      } else if (cursorPosition < previousLength) {
          // Try to maintain cursor position when editing middle of input
          const newPosition = Math.max(0, cursorPosition + (newLength - previousLength));
          e.target.setSelectionRange(newPosition, newPosition);
      }
  });
  
  // Format expiration date as MM/YY
  expirationDateInput.addEventListener('input', function(e) {
      const cursorPosition = e.target.selectionStart;
      const previousValue = e.target.value;
      
      // Remove non-digits
      let value = e.target.value.replace(/[^0-9]/gi, '');
      
      // Limit to 4 digits
      value = value.substring(0, 4);
      
      // Format as MM/YY
      if (value.length > 2) {
          // Check if first digit is > 1, prepend 0
          if (value.charAt(0) > 1) {
              value = '0' + value;
              // If second digit is now > 2 (month > 12), set to 12
              if (value.charAt(1) > 2) {
                  value = '12' + value.substring(2);
              }
          } 
          // If first digit is 1, make sure second digit isn't > 2 (month > 12)
          else if (value.charAt(0) == 1 && value.charAt(1) > 2) {
              value = '12' + value.substring(2);
          }
          
          value = value.substring(0, 2) + '/' + value.substring(2);
      } else if (value.length === 2) {
          // Auto-add slash after 2 digits
          // Check if month is valid (01-12)
          const month = parseInt(value);
          if (month > 12) {
              value = '12';
          } else if (month === 0) {
              value = '01';
          }
          value += '/';
      }
      
      e.target.value = value;
      
      // Handle cursor position for better UX
      // If user just typed the second digit of the month, move cursor after the slash
      if (previousValue.length === 2 && value.length === 3 && cursorPosition === 2) {
          e.target.setSelectionRange(3, 3);
      }
      // Otherwise try to maintain cursor position
      else if (cursorPosition < previousValue.length) {
          const newPosition = Math.min(value.length, cursorPosition);
          e.target.setSelectionRange(newPosition, newPosition);
      }
  });
  
  // Restrict CVV to numbers only and limit length
  cvvInput.addEventListener('input', function(e) {
      const value = e.target.value.replace(/[^0-9]/gi, '');
      e.target.value = value.substring(0, 4); // Limit to 4 digits
  });
  
  // Basic card type detection
  cardNumberInput.addEventListener('keyup', function(e) {
      const cardNumber = e.target.value.replace(/\s+/g, '');
      
      // Remove any previous card type indicators
      document.querySelectorAll('.card-type').forEach(el => el.remove());
      
      let cardType = '';
      
      // Basic card type detection based on first digits
      if (/^4/.test(cardNumber)) {
          cardType = 'Visa';
      } else if (/^5[1-5]/.test(cardNumber)) {
          cardType = 'MasterCard';
      } else if (/^3[47]/.test(cardNumber)) {
          cardType = 'American Express';
      } else if (/^6(?:011|5)/.test(cardNumber)) {
          cardType = 'Discover';
      }
      
      if (cardType && cardNumber.length >= 4) {
          const cardTypeElement = document.createElement('div');
          cardTypeElement.className = 'card-type';
          cardTypeElement.textContent = cardType;
          cardTypeElement.style.fontSize = '12px';
          cardTypeElement.style.color = '#4CAF50';
          cardTypeElement.style.marginTop = '5px';
          cardTypeElement.style.fontWeight = 'bold';
          
          // Insert after the input
          cardNumberInput.parentNode.appendChild(cardTypeElement);
      }
  });
  
  // Form validation
  cardForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      // Reset previous error states
      clearErrors();
      
      let isValid = true;
      
      // Validate card number (basic check: 13-19 digits and Luhn algorithm)
      const cardNumber = cardNumberInput.value.replace(/\s+/g, '');
      if (!/^[0-9]{13,19}$/.test(cardNumber)) {
          showError(cardNumberInput, 'Please enter a valid card number');
          isValid = false;
      } else if (!validateCardWithLuhn(cardNumber)) {
          showError(cardNumberInput, 'Invalid card number');
          isValid = false;
      }
      
      // Validate expiration date (MM/YY format and not expired)
      const expDate = expirationDateInput.value;
      if (!/^\d{2}\/\d{2}$/.test(expDate)) {
          showError(expirationDateInput, 'Please enter a valid date (MM/YY)');
          isValid = false;
      } else {
          const [month, year] = expDate.split('/');
          const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1, 1);
          const today = new Date();
          
          // Set expiry to last day of month
          expiryDate.setMonth(expiryDate.getMonth() + 1);
          expiryDate.setDate(0);
          
          if (expiryDate < today) {
              showError(expirationDateInput, 'Card has expired');
              isValid = false;
          }
      }
      
      // Validate CVV (3-4 digits)
      if (!/^[0-9]{3,4}$/.test(cvvInput.value)) {
          showError(cvvInput, 'CVV must be 3 or 4 digits');
          isValid = false;
      }
      
      // Validate cardholder name
      if (cardHolderInput.value.trim().length < 3) {
          showError(cardHolderInput, 'Please enter the cardholder name');
          isValid = false;
      } else if (!/^[a-zA-Z\s'-]+$/.test(cardHolderInput.value.trim())) {
          showError(cardHolderInput, 'Name contains invalid characters');
          isValid = false;
      }
      
      // If all validations pass
      if (isValid) {
          // In a real app, you would send this data to your server
          console.log("Card Details:", {
              cardNumber: cardNumber,
              expirationDate: expDate,
              cvv: cvvInput.value,
              cardHolder: cardHolderInput.value
          });
          
          // Show success message
          showSuccessMessage();
          
          // Reset the form
          cardForm.reset();
          
          // Remove any card type indicators
          document.querySelectorAll('.card-type').forEach(el => el.remove());
      }
  });
  
  // Set active navigation item based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
      const href = item.getAttribute('href');
      if (href === currentPage) {
          item.classList.add('active');
      }
  });
  
  // Helper functions
  function showError(inputElement, message) {
      inputElement.classList.add('error');
      
      const errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      errorElement.textContent = message;
      
      // Check if error message already exists
      const existingError = inputElement.parentNode.querySelector('.error-message');
      if (!existingError) {
          inputElement.parentNode.appendChild(errorElement);
      }
  }
  
  function clearErrors() {
      document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
      document.querySelectorAll('.error-message').forEach(el => el.remove());
  }
  
  function showSuccessMessage() {
      // Create success message
      const successMessage = document.createElement('div');
      successMessage.className = 'success-message';
      successMessage.style.backgroundColor = '#4CAF50';
      successMessage.style.color = 'white';
      successMessage.style.padding = '15px';
      successMessage.style.borderRadius = '5px';
      successMessage.style.textAlign = 'center';
      successMessage.style.marginTop = '20px';
      successMessage.style.fontWeight = 'bold';
      successMessage.textContent = 'Your card has been successfully registered!';
      
      // Insert before the form
      cardForm.parentNode.insertBefore(successMessage, cardForm);
      
      // Remove after 3 seconds
      setTimeout(() => {
          successMessage.remove();
      }, 3000);
  }
  
  // Luhn algorithm for card number validation
  function validateCardWithLuhn(cardNumber) {
      let sum = 0;
      let shouldDouble = false;
      
      // Loop through values starting from the rightmost digit
      for (let i = cardNumber.length - 1; i >= 0; i--) {
          let digit = parseInt(cardNumber.charAt(i));
          
          if (shouldDouble) {
              digit *= 2;
              if (digit > 9) {
                  digit -= 9;
              }
          }
          
          sum += digit;
          shouldDouble = !shouldDouble;
      }
      
      return (sum % 10) === 0;
  }
});
////////card//////////

/////statment/////////
document.addEventListener('DOMContentLoaded', function() {
  // Set active navigation item based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href === currentPage) {
      item.classList.add('active');
    }
  });
  
  // Example function to populate the table with data
  // Uncomment and modify this function to use with real data
  /*
  function populateTable(data) {
    const tableBody = document.querySelector('.statements-table tbody');
    
    // Clear existing content
    tableBody.innerHTML = '';
    
    if (data && data.length > 0) {
      // Add rows for each data item
      data.forEach(item => {
        const row = document.createElement('tr');
        
        const amountCell = document.createElement('td');
        amountCell.textContent = formatCurrency(item.amount);
        
        const typeCell = document.createElement('td');
        typeCell.textContent = item.paymentType;
        
        const creatorCell = document.createElement('td');
        creatorCell.textContent = item.creator;
        
        row.appendChild(amountCell);
        row.appendChild(typeCell);
        row.appendChild(creatorCell);
        
        tableBody.appendChild(row);
      });
    } else {
      // Show empty state
      const emptyRow = document.createElement('tr');
      const emptyCell = document.createElement('td');
      emptyCell.setAttribute('colspan', '3');
      emptyCell.className = 'empty-state';
      emptyCell.textContent = 'No records available';
      
      emptyRow.appendChild(emptyCell);
      tableBody.appendChild(emptyRow);
    }
  }
  
  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
  
  // Example data
  const sampleData = [
    { amount: 250.00, paymentType: 'Credit Card', creator: 'John Doe' },
    { amount: 120.50, paymentType: 'Bank Transfer', creator: 'Jane Smith' },
    { amount: 75.25, paymentType: 'PayPal', creator: 'Robert Johnson' }
  ];
  
  // Uncomment to use sample data
  // populateTable(sampleData);
  */
});

////statment/////////


///////profile//////////
document.addEventListener('DOMContentLoaded', function() {
  // Toggle tabs
  document.getElementById('account-tab').addEventListener('click', function() {
      document.getElementById('account-tab').classList.add('active');
      document.getElementById('creator-tab').classList.remove('active');
  });

  document.getElementById('creator-tab').addEventListener('click', function() {
      document.getElementById('creator-tab').classList.add('active');
      document.getElementById('account-tab').classList.remove('active');
  });

  // Handle "Forgot your password?" link click
  document.getElementById('forgot-password-link').addEventListener('click', function(event) {
      event.preventDefault();  // Prevent default link behavior
      document.getElementById('forgot-password-modal').style.display = 'block';
      
      // Pre-fill the email field in the modal with the current email
      const currentEmail = document.getElementById('email').value;
      document.getElementById('reset-email').value = currentEmail;
  });

  // Close the modal when clicking the close button
  document.getElementById('close-modal').addEventListener('click', function() {
      document.getElementById('forgot-password-modal').style.display = 'none';
  });

  // Close the modal when clicking outside of it
  window.addEventListener('click', function(event) {
      const modal = document.getElementById('forgot-password-modal');
      if (event.target === modal) {
          modal.style.display = 'none';
      }
  });

  // Function to send the password reset link (mock functionality)
  document.getElementById('send-reset-link').addEventListener('click', function() {
      var email = document.getElementById('reset-email').value;
      if (email && isValidEmail(email)) {
          alert('Password reset link has been sent to ' + email);
          document.getElementById('forgot-password-modal').style.display = 'none';  // Close modal after sending link
      } else {
          alert('Please enter a valid email address');
      }
  });

  // Handle remove buttons for file inputs
  const removeButtons = document.querySelectorAll('.remove-button');
  removeButtons.forEach(button => {
      button.addEventListener('click', function() {
          // Find the associated file input
          const fileInput = this.parentElement.querySelector('input[type="file"]');
          // Reset the file input
          fileInput.value = '';
      });
  });

  // Set active navigation item based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
      const href = item.getAttribute('href');
      if (href === currentPage) {
          item.classList.add('active');
      }
  });

  // Simple email validation function
  function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
  }
});

///////profile///////////


