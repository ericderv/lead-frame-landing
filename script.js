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

document.addEventListener('DOMContentLoaded', () => {
  // Add animation classes to sections
  document.querySelector('.hero-content').classList.add('slide-up');
  document.querySelectorAll('section').forEach(sec => sec.classList.add('fade-in'));
  revealOnScroll();
  animateCounters();
}); 