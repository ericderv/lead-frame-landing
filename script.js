// Placeholder for ForgeClickMedia interactivity 

document.addEventListener('DOMContentLoaded', function() {
  const serviceBlocks = document.querySelectorAll('.service-block');
  const fadeEls = [
    ...serviceBlocks,
    ...document.querySelectorAll('.services-cta-bar'),
    ...document.querySelectorAll('.booking-card')
  ];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          if (entry.target.classList.contains('booking-card')) {
            entry.target.classList.add('has-appeared');
          }
        } else {
          if (!entry.target.classList.contains('booking-card') || !entry.target.classList.contains('has-appeared')) {
            entry.target.classList.remove('in-view');
          }
        }
      });
    }, { threshold: 0.15 });
    fadeEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all
    fadeEls.forEach(el => el.classList.add('in-view'));
  }
}); 