document.addEventListener("DOMContentLoaded", () => {
    // Elements
    const messageBox = document.getElementById("messageBox")
    const messagesContainer = document.getElementById("messages")
    const backButton = document.getElementById("backButton")
    const sidebar = document.querySelector(".sidebar")
    const chatItems = document.querySelectorAll(".chat-item")
    const attachmentBtn = document.querySelector(".attachment-btn")
    const attachmentMenu = document.querySelector(".attachment-menu")
  
    // Initialize recording variables
    let mediaRecorder
    let audioChunks = []
    let recordingTimer
    let recordingSeconds = 0
  
    // Mobile navigation
    backButton.addEventListener("click", () => {
      window.location.href = "messages.html"
    })
  
    // Chat item selection
    chatItems.forEach((item) => {
      item.addEventListener("click", function () {
        // Remove active class from all items
        chatItems.forEach((chat) => chat.classList.remove("active"))
  
        // Add active class to clicked item
        this.classList.add("active")
  
        // On mobile, hide sidebar after selection
        if (window.innerWidth <= 768) {
          sidebar.classList.remove("active")
        }
      })
    })
  
    // Attachment menu toggle
    attachmentBtn.addEventListener("click", () => {
      attachmentMenu.style.display = attachmentMenu.style.display === "none" ? "block" : "none"
    })
  
    // Close attachment menu when clicking outside
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".attachment-btn") && !event.target.closest(".attachment-menu")) {
        attachmentMenu.style.display = "none"
      }
    })
  
    // Send message on Enter key (but allow Shift+Enter for new line)
    messageBox.addEventListener("keypress", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault()
        sendMessage()
      }
    })
  
    // Auto-resize textarea as user types
    messageBox.addEventListener("input", function () {
      this.style.height = "auto"
      this.style.height = this.scrollHeight + "px"
    })
  
    // Function to send a message
    function sendMessage() {
      const messageText = messageBox.value.trim()
  
      if (messageText) {
        // Get current time
        const now = new Date()
        const hours = now.getHours()
        const minutes = now.getMinutes()
        const ampm = hours >= 12 ? "PM" : "AM"
        const formattedHours = hours % 12 || 12
        const formattedTime = `${formattedHours}:${minutes < 10 ? "0" : ""}${minutes} ${ampm}`
  
        // Create message element
        const messageDiv = document.createElement("div")
        messageDiv.className = "message sent"
        messageDiv.innerHTML = `
          <div class="message-content">
            <p>${messageText}</p>
            <span class="timestamp">${formattedTime}</span>
          </div>
        `
  
        // Add to chat
        messagesContainer.appendChild(messageDiv)
  
        // Clear input and scroll to bottom
        messageBox.value = ""
        messageBox.style.height = "auto"
        scrollToBottom()
  
        // Simulate a reply after a short delay (for demo purposes)
        setTimeout(simulateReply, 1000 + Math.random() * 2000)
      }
    }
  
    // Function to simulate a reply (for demo purposes)
    function simulateReply() {
      const replies = [
        "That's great to hear!",
        "I'll get back to you on that soon.",
        "Thanks for letting me know!",
        "Sounds good to me.",
        "I was just thinking the same thing!",
        "Can you send me more details?",
        "I'm looking forward to it!",
        "Let me check my schedule and get back to you.",
      ]
  
      const randomReply = replies[Math.floor(Math.random() * replies.length)]
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()
      const ampm = hours >= 12 ? "PM" : "AM"
      const formattedHours = hours % 12 || 12
      const formattedTime = `${formattedHours}:${minutes < 10 ? "0" : ""}${minutes} ${ampm}`
  
      const messageDiv = document.createElement("div")
      messageDiv.className = "message received"
      messageDiv.innerHTML = `
        <img src="https://via.placeholder.com/40" alt="Sarah" class="message-avatar">
        <div class="message-content">
          <p>${randomReply}</p>
          <span class="timestamp">${formattedTime}</span>
        </div>
      `
  
      messagesContainer.appendChild(messageDiv)
      scrollToBottom()
    }
  
    // Function to start voice recording
    window.startVoiceRecording = () => {
      audioChunks = []
      recordingSeconds = 0
  
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          mediaRecorder = new MediaRecorder(stream)
  
          mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data)
          }
  
          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: "audio/wav" })
            sendVoiceMessage(audioBlob)
            clearInterval(recordingTimer)
          }
  
          // Start recording
          mediaRecorder.start()
          document.getElementById("voiceRecordingSection").style.display = "flex"
  
          // Update recording time
          recordingTimer = setInterval(() => {
            recordingSeconds++
            const minutes = Math.floor(recordingSeconds / 60)
            const seconds = recordingSeconds % 60
            document.querySelector(".recording-time").textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
          }, 1000)
        })
        .catch((err) => {
          console.error("Error accessing microphone:", err)
          alert("Could not access your microphone.")
        })
    }
  
    // Function to stop voice recording
    window.stopVoiceRecording = () => {
      if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop()
        document.getElementById("voiceRecordingSection").style.display = "none"
      }
    }
  
    // Function to send voice message
    function sendVoiceMessage(audioBlob) {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()
      const ampm = hours >= 12 ? "PM" : "AM"
      const formattedHours = hours % 12 || 12
      const formattedTime = `${formattedHours}:${minutes < 10 ? "0" : ""}${minutes} ${ampm}`
  
      const audioUrl = URL.createObjectURL(audioBlob)
  
      const messageDiv = document.createElement("div")
      messageDiv.className = "message sent"
      messageDiv.innerHTML = `
        <div class="message-content">
          <p>
            <i class="fas fa-microphone"></i> Voice message
            <audio controls src="${audioUrl}"></audio>
          </p>
          <span class="timestamp">${formattedTime}</span>
        </div>
      `
  
      messagesContainer.appendChild(messageDiv)
      scrollToBottom()
    }
  
    // Function to send an image
    window.sendImage = (event) => {
      const file = event.target.files[0]
      if (!file) return
  
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()
      const ampm = hours >= 12 ? "PM" : "AM"
      const formattedHours = hours % 12 || 12
      const formattedTime = `${formattedHours}:${minutes < 10 ? "0" : ""}${minutes} ${ampm}`
  
      const reader = new FileReader()
      reader.onload = (e) => {
        const messageDiv = document.createElement("div")
        messageDiv.className = "message sent"
        messageDiv.innerHTML = `
          <div class="message-content">
            <p><img src="${e.target.result}" alt="Image" class="message-image"></p>
            <span class="timestamp">${formattedTime}</span>
          </div>
        `
  
        messagesContainer.appendChild(messageDiv)
        scrollToBottom()
      }
  
      reader.readAsDataURL(file)
    }
  
    // Function to start a voice call (simulation)
    window.startVoiceCall = () => {
      alert("Starting voice call with Sarah Williams...")
    }
  
    // Function to start a video call (simulation)
    window.startVideoCall = () => {
      alert("Starting video call with Sarah Williams...")
    }
  
    // Function to scroll to bottom of messages
    function scrollToBottom() {
      messagesContainer.scrollTop = messagesContainer.scrollHeight
    }
  
    // Initial scroll to bottom
    scrollToBottom()
  
    // Handle window resize for responsive behavior
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        sidebar.classList.remove("active")
      }
    })
  })
  
  