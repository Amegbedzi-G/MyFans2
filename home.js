// Toggle the visibility of the language dropdown and change language text when clicked
document.querySelector('.lang-toggle').addEventListener('click', function(event) {
    // Prevent the click from propagating to the document (which would close the dropdown immediately)
    event.stopPropagation();
  
    // Toggle the "active" class to show/hide the dropdown
    document.querySelector('.lang-selector').classList.toggle('active');
  
    // Change the text content between 'EN' and 'ES' when clicked
    let currentLang = this.textContent.trim();
    if (currentLang === 'EN') {
      this.textContent = 'ES'; // Switch to Spanish
      // You can add code here to change the page content to Spanish
    } else {
      this.textContent = 'EN'; // Switch back to English
      // Add code here to change the content back to English
    }
  });
  
  // Close the dropdown if clicking outside the language selector
  document.addEventListener('click', function(event) {
    if (!event.target.closest('.lang-selector')) {
      document.querySelector('.lang-selector').classList.remove('active');
    }
  })

const followersSlider = document.getElementById("followers");
const priceSlider = document.getElementById("subscription-price");
const followersValue = document.getElementById("followers-value");
const priceValue = document.getElementById("price-value");
const earningsRange = document.getElementById("earnings-range");

followersSlider.addEventListener("input", updateEarnings);
priceSlider.addEventListener("input", updateEarnings);

function updateEarnings() {
  const followers = parseInt(followersSlider.value);
  const price = parseFloat(priceSlider.value);
  
  followersValue.textContent = followers.toLocaleString();
  priceValue.textContent = `$${price.toFixed(2)}`;
  
  const minEarnings = (followers * 0.01 * price).toFixed(1);
  const maxEarnings = (followers * 0.25 * price).toFixed(1);
  
  earningsRange.textContent = `$${minEarnings}K - $${maxEarnings}K`;
}

document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mainNav = document.getElementById('main-nav');
  
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function() {
      mainNav.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });
  }
  
  // Close mobile menu when clicking on a link
  const navLinks = document.querySelectorAll('#main-nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      mainNav.classList.remove('active');
      menuToggle.classList.remove('active');
    });
  });
  
  // Language selector
  const langToggle = document.querySelector('.lang-toggle');
  const langSelector = document.querySelector('.lang-selector');
  
  if (langToggle && langSelector) {
    langToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      langSelector.classList.toggle('active');
    });
    
    // Close language dropdown when clicking outside
    document.addEventListener('click', function() {
      langSelector.classList.remove('active');
    });
  }
  
  // Earnings calculator
  const followersSlider = document.getElementById('followers');
  const followersValue = document.getElementById('followers-value');
  const priceSlider = document.getElementById('subscription-price');
  const priceValue = document.getElementById('price-value');
  const earningsRange = document.getElementById('earnings-range');
  
  function updateEarnings() {
    if (followersSlider && priceSlider && earningsRange) {
      const followers = parseInt(followersSlider.value);
      const price = parseFloat(priceSlider.value);
      
      // Calculate potential earnings (1% to 25% conversion rate)
      const minEarnings = followers * 0.01 * price * 0.8; // 80% after platform fee
      const maxEarnings = followers * 0.25 * price * 0.8;
      
      // Format earnings
      const formattedMin = formatCurrency(minEarnings);
      const formattedMax = formatCurrency(maxEarnings);
      
      earningsRange.textContent = `${formattedMin} - ${formattedMax}`;
    }
  }
  
  function formatCurrency(amount) {
    if (amount >= 1000) {
      return '$' + (amount / 1000).toFixed(1) + 'K';
    }
    return '$' + amount.toFixed(2);
  }
  
  // Update values when sliders change
  if (followersSlider && followersValue) {
    followersSlider.addEventListener('input', function() {
      followersValue.textContent = parseInt(this.value).toLocaleString();
      updateEarnings();
    });
  }
  
  if (priceSlider && priceValue) {
    priceSlider.addEventListener('input', function() {
      priceValue.textContent = '$' + parseFloat(this.value).toFixed(2);
      updateEarnings();
    });
  }
  
  // Initialize earnings calculator
  updateEarnings();
  
  // FAQ accordion
  const faqButtons = document.querySelectorAll('.faq-btn');
  
  faqButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Close all other FAQs
      faqButtons.forEach(btn => {
        if (btn !== this) {
          btn.blur();
        }
      });
    });
  });
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Adjust for fixed header
          behavior: 'smooth'
        });
      }
    });
  });
});