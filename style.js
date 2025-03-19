const loginText = document.querySelector(".title-text .login");
const loginForm = document.querySelector("form.login");
const loginBtn = document.querySelector("label.login");
const signupBtn = document.querySelector("label.signup");
const signupLink = document.querySelector("form .signup-link a");
signupBtn.onclick = (()=>{
 loginForm.style.marginLeft = "-50%";
 loginText.style.marginLeft = "-50%";
});
loginBtn.onclick = (()=>{
 loginForm.style.marginLeft = "0%";
 loginText.style.marginLeft = "0%";
});
signupLink.onclick = (()=>{
 signupBtn.click();
 return false;
});
// Function to handle password visibility toggle
document.querySelectorAll('.toggle-password').forEach(toggle => {
    toggle.addEventListener('click', function () {
      // Get the sibling input (password field)
      const passwordInput = this.previousElementSibling;
  
      // Toggle the input type between 'password' and 'text'
      const type = passwordInput.type === 'password' ? 'text' : 'password';
      passwordInput.type = type;
  
      // Change the button text/icon based on the input type
      this.textContent = type === 'password' ? '👁️' : '🙈';
    });
  });
  




  document.addEventListener('DOMContentLoaded', function() {
    // Toggle password visibility
    function togglePasswordVisibility(inputId, buttonId) {
      const passwordInput = document.getElementById(inputId);
      const toggleButton = document.getElementById(buttonId);
      
      if (!passwordInput || !toggleButton) {
        console.error('Invalid inputId or buttonId provided.');
        return;
      }
      
      toggleButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent button's default behavior
        
        // Toggle password visibility
        if (passwordInput.type === "password") {
          passwordInput.type = "text";
          toggleButton.textContent = "🙈"; // Change icon to indicate "hide"
        } else {
          passwordInput.type = "password";
          toggleButton.textContent = "👁️"; // Change icon back to "show"
        }
      });
    }
    
    // Initialize password toggles
    togglePasswordVisibility('login-password', 'toggle-password-login');
    togglePasswordVisibility('signup-password', 'toggle-password-signup');
    
    // Handle form sliding
    const loginForm = document.querySelector('form.login');
    const signupForm = document.querySelector('form.signup');
    const loginRadio = document.getElementById('login');
    const signupRadio = document.getElementById('signup');
    
    // Function to handle form sliding
    function handleFormSlide() {
      if (signupRadio.checked) {
        loginForm.style.marginLeft = "-50%";
      } else {
        loginForm.style.marginLeft = "0%";
      }
    }
    
    // Add event listeners to radio buttons
    loginRadio.addEventListener('change', handleFormSlide);
    signupRadio.addEventListener('change', handleFormSlide);
    
    // Handle "Create A New" link click
    const signupLink = document.querySelector('.signup-link a');
    if (signupLink) {
      signupLink.addEventListener('click', function(e) {
        e.preventDefault();
        signupRadio.checked = true;
        handleFormSlide();
      });
    }
    
    // Handle "Login" link in signup form
    const loginLink = document.querySelector('.login-link a');
    if (loginLink) {
      loginLink.addEventListener('click', function(e) {
        e.preventDefault();
        loginRadio.checked = true;
        handleFormSlide();
      });
    }
    
    // Form validation
    const loginFormElement = document.getElementById('login-form');
    const signupFormElement = document.getElementById('signup-form');
    
    if (loginFormElement) {
      loginFormElement.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        if (validateEmail(email) && password.length >= 6) {
          // In a real app, you would handle login here
          console.log('Login successful!');
          window.location.href = 'main.html'; // Redirect to main page
        } else {
          alert('Please enter a valid email and password (min 6 characters)');
        }
      });
    }
    
    if (signupFormElement) {
      signupFormElement.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const displayName = document.getElementById('display-name').value;
        
        if (validateEmail(email) && password.length >= 6 && displayName.trim() !== '') {
          // In a real app, you would handle signup here
          console.log('Signup successful!');
          alert('Account created successfully! Please login.');
          
          // Switch to login tab
          loginRadio.checked = true;
          handleFormSlide();
          
          // Clear signup form
          document.getElementById('signup-email').value = '';
          document.getElementById('signup-password').value = '';
          document.getElementById('display-name').value = '';
        } else {
          alert('Please fill all fields correctly (valid email, password min 6 characters)');
        }
      });
    }
    
    // Email validation helper
    function validateEmail(email) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }
  });