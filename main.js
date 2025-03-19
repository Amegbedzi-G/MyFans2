document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.querySelector('.text-input');
    const fileInput = document.querySelector('#fileInput');
    const createPostButton = document.querySelector('.post-btn');
    const postsContainer = document.querySelector('main.feed');
  
    createPostButton.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent form submission
  
        // Check if there's text or file input
        if (textInput.value.trim() === '' && fileInput.files.length === 0) {
            alert("Please add a caption or media to your post.");
            return;
        }
  
        // Create a new post div
        const newPost = document.createElement('div');
        newPost.classList.add('post');
  
        // Post header with default profile and username
        const postHeader = document.createElement('div');
        postHeader.classList.add('post-header');
        postHeader.innerHTML = `
            <img src="profile1.jpg" alt="User" class="user-avatar">
            <p class="username">You <img src="verification.png" alt="Verified" class="verification-icon"></p>
            
                      <button class="option-btn">
            <img src="option.png" alt="Option" class="option-icon" onclick="toggleOptions()">Edit
          </button>
          <button class="delete-btn">
            <img src="delete.png" alt="Delete" class="delete-icon" onclick="deleteItem()">Delete
          </button>

        `;
        newPost.appendChild(postHeader);
  
        // Add image if one is selected
        if (fileInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const postImage = document.createElement('img');
                postImage.src = event.target.result;
                postImage.classList.add('post-image');
                newPost.appendChild(postImage);
                addPostActions(newPost);
            };
            reader.readAsDataURL(fileInput.files[0]);
        }
  
        // Add text if entered
        if (textInput.value.trim() !== '') {
            const caption = document.createElement('p');
            caption.classList.add('caption');
            caption.innerHTML = `<strong>You</strong> ${textInput.value}`;
            newPost.appendChild(caption);
        }
  
        // Add post actions if no image was added
        if (fileInput.files.length === 0) {
            addPostActions(newPost);
        }
  
        // Add the new post to the feed at the bottom
        postsContainer.insertBefore(newPost, postsContainer.lastChild.nextSibling);
  
        // Clear inputs
        textInput.value = '';
        fileInput.value = '';
    });
  
    function addPostActions(postElement) {
        const postActions = document.createElement('div');
        postActions.classList.add('post-actions');
        postActions.innerHTML = `
            <button class="like-btn">
                <img src="heart.png" alt="Like" class="icon"> Like
            </button>
            <button class="comment-btn">
                <img src="message.png" alt="Comment" class="icon"> Comment
            </button>
            <button class="like-btn">
                <img src="send.png" alt="Like" class="icon"> Share
            </button>
            <button class="like-btn">
                <img src="dollar_sign.png" alt="Like" class="icon"> Tip
            </button>
        `;
        postElement.appendChild(postActions);
  
        // Add likes section
        const likes = document.createElement('p');
        likes.classList.add('likes');
        likes.textContent = '0 likes';
        postElement.appendChild(likes);

        // Add event listener to like button
        const likeButton = postElement.querySelector('.like-btn');
        likeButton.addEventListener('click', function() {
            let count = parseInt(likes.textContent) || 0;
            count++;
            likes.textContent = `${count} likes`;
        });
    }

    // Story-related functions
    window.triggerFileInput = function() {
        document.getElementById('story-file-input').click();
    }

    window.previewStory = function(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Check for supported file types
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
            alert('Please upload an image or video.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const storyContainer = document.getElementById('posted-stories');
            
            // Create a new story element
            const storyElement = document.createElement('div');
            storyElement.classList.add('story');
            
            // Determine media type (image or video)
            if (file.type.startsWith('image/')) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.classList.add('story-media');
                storyElement.appendChild(img);
            } else if (file.type.startsWith('video/')) {
                const video = document.createElement('video');
                video.src = e.target.result;
                video.classList.add('story-media');
                video.controls = true;
                storyElement.appendChild(video);
            }

            // Add timestamp and user details
            const timestamp = document.createElement('div');
            timestamp.classList.add('story-timestamp');
            timestamp.textContent = 'Just now';
            storyElement.appendChild(timestamp);

            // Add story to the container
            storyContainer.insertBefore(storyElement, storyContainer.firstChild);

            // Save story to local storage
            saveStoryToLocalStorage(e.target.result, file.type);
        };

        reader.readAsDataURL(file);
    }

    function saveStoryToLocalStorage(dataUrl, fileType) {
        const stories = JSON.parse(localStorage.getItem('userStories') || '[]');
        
        // Limit number of stories
        if (stories.length >= 5) {
            stories.pop(); // Remove the oldest story
        }

        stories.unshift({
            dataUrl: dataUrl,
            type: fileType,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('userStories', JSON.stringify(stories));
    }

    function loadStoriesFromLocalStorage() {
        const stories = JSON.parse(localStorage.getItem('userStories') || '[]');
        const storyContainer = document.getElementById('posted-stories');
        
        stories.forEach(story => {
            const storyElement = document.createElement('div');
            storyElement.classList.add('story');
            
            if (story.type.startsWith('image/')) {
                const img = document.createElement('img');
                img.src = story.dataUrl;
                img.classList.add('story-media');
                storyElement.appendChild(img);
            } else if (story.type.startsWith('video/')) {
                const video = document.createElement('video');
                video.src = story.dataUrl;
                video.classList.add('story-media');
                video.controls = true;
                storyElement.appendChild(video);
            }

            const timestamp = document.createElement('div');
            timestamp.classList.add('story-timestamp');
            timestamp.textContent = getTimeAgo(new Date(story.timestamp));
            storyElement.appendChild(timestamp);

            storyContainer.appendChild(storyElement);
        });
    }

    function getTimeAgo(date) {
        const now = new Date();
        const secondsPast = (now.getTime() - date.getTime()) / 1000;
        
        if (secondsPast < 60) return 'Just now';
        if (secondsPast < 3600) return `${Math.floor(secondsPast / 60)} minutes ago`;
        if (secondsPast < 86400) return `${Math.floor(secondsPast / 3600)} hours ago`;
        return `${Math.floor(secondsPast / 86400)} days ago`;
    }

    // Load stories when the page loads
    loadStoriesFromLocalStorage();
});
document.addEventListener('DOMContentLoaded', () => {
    const postContainer = document.querySelector('.feed');
    const postForm = document.querySelector('form');

    // Listen for form submission to add new post
    postForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const textInput = document.querySelector('.text-input');
        const mediaInput = document.querySelector('#fileInput');
        const newPostId = Date.now(); // Use timestamp as a unique ID

        if (!textInput.value.trim() && !mediaInput.files.length) {
            alert('Please enter text or upload media!');
            return;
        }

        // Create new post element
        const newPost = document.createElement('div');
        newPost.className = 'post';
        newPost.setAttribute('data-id', newPostId);

        newPost.innerHTML = `
            <div class="post-header">
                <img src="profile1.jpg" alt="User" class="user-avatar">
                <p class="username">Your Name <img src="verification.png" alt="Verified" class="verification-icon"></p>
                <button class="option-btn edit-btn">
                    <img src="edit.png" alt="Edit" class="icon"> Edit
                </button>
                <button class="option-btn delete-btn">
                    <img src="delete.png" alt="Delete" class="icon"> Delete
                </button>
            </div>
            ${mediaInput.files.length ? `<img src="${URL.createObjectURL(mediaInput.files[0])}" alt="Post Image" class="post-image">` : ''}
            <div class="post-actions">
                <button class="like-btn">
                    <img src="heart.png" alt="Like" class="icon"> Like
                </button>
                <button class="comment-btn">
                    <img src="message.png" alt="Comment" class="icon"> Comment
                </button>
                <button class="like-btn">
                    <img src="send.png" alt="Share" class="icon"> Share
                </button>
                <button class="like-btn">
                    <img src="dollar_sign.png" alt="Tip" class="icon"> Tip
                </button>
            </div>
            <p class="likes">0 likes</p>
            <p class="caption"><strong>Your Name</strong> ${textInput.value.trim()}</p>
        `;

        // Add the new post to the container
        postContainer.prepend(newPost);

        // Clear form inputs
        textInput.value = '';
        mediaInput.value = '';
    });

    // Event delegation for edit and delete buttons
    postContainer.addEventListener('click', (e) => {
        const editButton = e.target.closest('.edit-btn');
        const deleteButton = e.target.closest('.delete-btn');

        if (editButton) {
            const post = editButton.closest('.post');
            const caption = post.querySelector('.caption');
            const currentText = caption.textContent.trim();
            const newText = prompt('Edit your caption:', currentText);
            if (newText !== null && newText.trim()) {
                caption.innerHTML = `<strong>Your Name</strong> ${newText.trim()}`;
            }
        }

        if (deleteButton) {
            const post = deleteButton.closest('.post');
            post.remove(); // Removes the post from the DOM
            alert('Post deleted successfully!');
        }
    });
});

document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', () => {
      alert('Edit functionality coming soon!');
      // Add your edit logic here
    });
  });
  
  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const post = e.target.closest('.post');
      post.remove(); // Removes the post from the DOM
      alert('Post deleted successfully!');
    });
  });
  

  // Toggle Like button
function toggleLike(event) {
    const button = event.currentTarget;
    button.classList.toggle('liked');
  }
  
  // Function to simulate Comment action
  function commentPost(event) {
    const button = event.currentTarget;
    alert('Commenting on the post...');
  }
  
  // Function to share the post using the Web Share API
  function sharePost(event) {
    const button = event.currentTarget;
    const postLink = window.location.href; // Get the current URL for sharing (or replace with a custom link)
    const postTitle = document.title; // You can set a custom title if needed
    const postText = 'Check out this amazing post!'; // Custom text for sharing
  
    if (navigator.share) {
      navigator.share({
        title: postTitle,
        text: postText,
        url: postLink,
      }).then(() => {
        alert('Post shared successfully!');
      }).catch((error) => {
        alert('Error sharing post: ' + error);
      });
    } else {
      alert('Your browser does not support the Web Share API.');
    }
  }
  
  // Function to simulate Tip action
  function tipPost(event) {
    const button = event.currentTarget;
    button.classList.toggle('active');
    if (button.classList.contains('active')) {
      alert('Thank you for the tip!');
    } else {
      alert('You have retracted the tip.');
    }
  }
  
  // Add event listeners for all buttons after the DOM is loaded
  document.addEventListener('DOMContentLoaded', function () {
    // Like buttons
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(button => {
      button.addEventListener('click', toggleLike);
    });
  
    // Comment buttons
    const commentButtons = document.querySelectorAll('.comment-btn');
    commentButtons.forEach(button => {
      button.addEventListener('click', commentPost);
    });
  
    // Share buttons
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(button => {
      button.addEventListener('click', sharePost);
    });
  
    // Tip buttons
    const tipButtons = document.querySelectorAll('.tip-btn');
    tipButtons.forEach(button => {
      button.addEventListener('click', tipPost);
    });
  });
  

  // Function to delete the item (could be anything like a list item, div, etc.)
function deleteItem() {
    // Find the parent element of the delete icon (you can change the selector as needed)
    const itemToDelete = event.target.closest('.item'); 
    if (itemToDelete) {
        itemToDelete.remove(); // Removes the item from the DOM
    }
}

// Function to toggle options or show additional options
function toggleOptions() {
    const optionsMenu = document.querySelector('.options-menu'); // Assuming you have a menu for options
    if (optionsMenu) {
        optionsMenu.classList.toggle('visible'); // Toggle visibility of the options menu
    }
}
