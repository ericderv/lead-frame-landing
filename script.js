// Animation on scroll for sections
function revealOnScroll() {
  const fadeEls = document.querySelectorAll('.fade-in');
  const slideEls = document.querySelectorAll('.slide-up');

  const observer = new window.IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  fadeEls.forEach(el => observer.observe(el));
  slideEls.forEach(el => observer.observe(el));
}

// Animated counters
function animateCounters() {
  const counters = document.querySelectorAll('.counter, .metric-number');
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetValue = parseInt(target.getAttribute('data-target'));
        const duration = 2000;
        const increment = targetValue / (duration / 16);
        let currentValue = 0;
        
        const timer = setInterval(() => {
          currentValue += increment;
          if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(timer);
          }
          
          if (targetValue >= 1000000) {
            target.textContent = (currentValue / 1000000).toFixed(1) + 'M';
          } else if (targetValue >= 1000) {
            target.textContent = Math.floor(currentValue / 1000) + 'K';
          } else {
            target.textContent = Math.floor(currentValue);
          }
        }, 16);
        
        counterObserver.unobserve(target);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => counterObserver.observe(counter));
}

// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.querySelector('.dark-mode-toggle');
    const toggleIcon = document.querySelector('.toggle-icon');
    
    // Check for saved theme preference or default to dark
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateToggleIcon(currentTheme);
    
    // Theme toggle click handler
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Update theme
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update toggle icon
        updateToggleIcon(newTheme);
        
        // Add animation class
        themeToggle.classList.add('theme-switching');
        setTimeout(() => {
            themeToggle.classList.remove('theme-switching');
        }, 300);
    });
    
    function updateToggleIcon(theme) {
        if (theme === 'light') {
            toggleIcon.textContent = '☀️';
        } else {
            toggleIcon.textContent = '🌙';
        }
    }
    
    // Add smooth transition to body when theme changes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
            }
        });
    });
    
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
});

// Add CSS for theme switching animation
const style = document.createElement('style');
style.textContent = `
    .theme-switching {
        animation: themePulse 0.3s ease;
    }
    
    @keyframes themePulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Floating UI Functions
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({
            behavior: 'smooth'
        });
    }
}

// SPA Navigation
function loadPage(pageId) {
  const main = document.getElementById('main-content');
  const template = document.getElementById('page-' + pageId);
  if (main && template) {
    main.innerHTML = template.innerHTML;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Center all text in main
    main.style.textAlign = 'center';
  }
  // Highlight active nav link
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  const navBtn = document.querySelector('.nav-btn[href="#' + pageId + '"]');
  if (navBtn) navBtn.classList.add('active');
}

// Unique Contact Form Interactivity
function setupContactForm() {
  const form = document.getElementById('unique-contact-form');
  const success = document.getElementById('contact-success');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    form.style.display = 'none';
    if (success) success.style.display = 'flex';
    setTimeout(() => {
      if (form) form.reset();
      if (success) success.style.display = 'none';
      form.style.display = 'flex';
    }, 3500);
  });
  // Animated input highlights
  form.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('focus', function() {
      input.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', function() {
      input.parentElement.classList.remove('focused');
    });
  });
}

// Luxury Contact Form Interactivity
function setupLuxuryContactForm() {
  const form = document.getElementById('luxury-contact-form');
  const success = document.getElementById('luxury-success');
  
  if (!form) return;
  
  // Form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Hide form and show success
    form.style.display = 'none';
    if (success) {
      success.style.display = 'block';
    }
    
    // Reset form after delay
    setTimeout(() => {
      if (form) {
        form.reset();
        form.style.display = 'flex';
      }
      if (success) {
        success.style.display = 'none';
      }
    }, 4000);
  });
  
  // Input field animations
  form.querySelectorAll('input, textarea, select').forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
      if (!this.value) {
        this.parentElement.classList.remove('focused');
      }
    });
    
    // Handle select elements
    if (input.tagName === 'SELECT') {
      input.addEventListener('change', function() {
        if (this.value) {
          this.parentElement.classList.add('focused');
        }
      });
    }
  });
}

// Re-setup contact form on SPA navigation
const origLoadPage = window.loadPage;
window.loadPage = function(pageId) {
  origLoadPage(pageId);
  if (pageId === 'contact' || pageId === 'home') {
    setupContactForm();
  }
};

// Re-setup luxury contact form on SPA navigation
const origLuxLoadPage = window.loadPage;
window.loadPage = function(pageId) {
  origLuxLoadPage(pageId);
  if (pageId === 'contact' || pageId === 'home') {
    setupLuxuryContactForm();
  }
};

document.addEventListener('DOMContentLoaded', function() {
  // SPA nav event listeners
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const href = btn.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const page = href.replace('#', '');
        loadPage(page);
      }
    });
  });
  // Load home page by default
  loadPage('home');
  setupContactForm();
});

document.addEventListener('DOMContentLoaded', () => {
  // Add animation classes to sections
  document.querySelector('.hero-content').classList.add('slide-up');
  document.querySelectorAll('section').forEach(sec => sec.classList.add('fade-in'));
  revealOnScroll();
  animateCounters();
}); 