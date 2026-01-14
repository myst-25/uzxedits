// Enhanced portfolio script with improved functionality and custom cursor
document.addEventListener('DOMContentLoaded', function(){
  console.log('Enhanced portfolio script loaded');
  
  // Initialize all features
  initCustomCursor();
  initTimeline();
  initMobileNavigation();
  initSmoothScrolling();
  initContactForm();
  initAnimations();
  initKeyboardNavigation();
  initVideoManager();
  initSlideshow();
  setCurrentYear();
  
  // Re-initialize clips after a short delay
  setTimeout(initEditableClips, 200);
  setTimeout(initEditableClips, 1000);
});

// Custom Cursor Implementation
function initCustomCursor() {
  // Only initialize on non-touch devices
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    return;
  }
  
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursor.innerHTML = `
    <svg class="cursor-pause active" width="32" height="32" viewBox="0 0 24 24" fill="none">
      <rect x="6" y="4" width="4" height="16" fill="white" rx="1"/>
      <rect x="14" y="4" width="4" height="16" fill="white" rx="1"/>
    </svg>
    <svg class="cursor-play" width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path d="M8 5v14l11-7z" fill="white"/>
    </svg>
  `;
  document.body.appendChild(cursor);
  
  const pauseIcon = cursor.querySelector('.cursor-pause');
  const playIcon = cursor.querySelector('.cursor-play');
  
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  // Smooth cursor follow
  function animateCursor() {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    
    cursorX += dx * 0.2;
    cursorY += dy * 0.2;
    
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
  
  // Interactive elements
  const interactiveElements = 'a, button, .btn, .timeline-btn, .clip, .slide-nav, .indicator, input, textarea, select';
  
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveElements)) {
      pauseIcon.classList.remove('active');
      playIcon.classList.add('active');
      cursor.style.transform += ' scale(1.3)';
    }
  });
  
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveElements)) {
      playIcon.classList.remove('active');
      pauseIcon.classList.add('active');
      cursor.style.transform = cursor.style.transform.replace(' scale(1.3)', '');
    }
  });
}

// Set current year in footer
function setCurrentYear() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// Video manager - stop other videos when one starts playing
function initVideoManager() {
  const videos = document.querySelectorAll('video');
  
  videos.forEach(video => {
    video.addEventListener('play', function() {
      videos.forEach(otherVideo => {
        if (otherVideo !== video && !otherVideo.paused) {
          otherVideo.pause();
        }
      });
    });
  });
}

// Mobile navigation
function initMobileNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const header = document.querySelector('.site-header');
  
  if (navToggle && header) {
    navToggle.addEventListener('click', function() {
      const isOpen = header.classList.contains('open');
      header.classList.toggle('open');
      this.setAttribute('aria-expanded', !isOpen);
      this.innerHTML = isOpen ? '☰' : '✕';
    });
    
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        header.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.innerHTML = '☰';
      });
    });
    
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target) && header.classList.contains('open')) {
        header.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.innerHTML = '☰';
      }
    });
  }
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerHeight = document.querySelector('.site-header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Contact form with validation
function initContactForm() {
  const form = document.getElementById('contact-form');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      
      if (!validateForm(data)) {
        return;
      }
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        showFormFeedback('success', 'Thank you for your message! I\'ll get back to you within 2-4 hours.');
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }
}

function validateForm(data) {
  const errors = [];
  
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Please enter your full name');
  }
  
  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Please enter a valid email address');
  }
  
  if (!data.message || data.message.trim().length < 10) {
    errors.push('Please provide more details about your project (minimum 10 characters)');
  }
  
  if (errors.length > 0) {
    showFormFeedback('error', errors.join('<br>'));
    return false;
  }
  
  return true;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showFormFeedback(type, message) {
  const existingFeedback = document.querySelector('.form-feedback');
  if (existingFeedback) {
    existingFeedback.remove();
  }
  
  const feedback = document.createElement('div');
  feedback.className = `form-feedback ${type}`;
  feedback.innerHTML = message;
  feedback.style.cssText = `
    margin-top: 20px;
    padding: 16px;
    border-radius: 12px;
    font-size: 14px;
    line-height: 1.4;
    animation: slideIn 0.3s ease-out;
    ${type === 'success' 
      ? 'background: rgba(94,234,212,0.1); border: 1px solid rgba(94,234,212,0.3); color: #5eead4;'
      : 'background: rgba(255,71,87,0.1); border: 1px solid rgba(255,71,87,0.3); color: #ff4757;'
    }
  `;
  
  const form = document.getElementById('contact-form');
  form.parentNode.insertBefore(feedback, form.nextSibling);
  
  if (type === 'success') {
    setTimeout(() => {
      if (feedback.parentNode) {
        feedback.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => feedback.remove(), 300);
      }
    }, 5000);
  }
}

// Initialize scroll-triggered animations
function initAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);
  
  const animateElements = document.querySelectorAll('.about-card, .skills-card, .video-card');
  animateElements.forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
  });
}

// Keyboard navigation
function initKeyboardNavigation() {
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const header = document.querySelector('.site-header');
      const navToggle = document.querySelector('.nav-toggle');
      
      if (header && header.classList.contains('open')) {
        header.classList.remove('open');
        if (navToggle) {
          navToggle.setAttribute('aria-expanded', 'false');
          navToggle.innerHTML = '☰';
          navToggle.focus();
        }
      }
    }
  });
}

// Initialize timeline functionality
function initTimeline() {
  console.log('Initializing timeline...');
  
  const playBtn = document.getElementById('playBtn');
  const playhead = document.getElementById('playhead');
  const currentTimeDisplay = document.getElementById('currentTime');
  
  let isPlaying = false;
  let currentTime = 0;
  let animationId = null;
  let isDraggingPlayhead = false;
  const timelineWidth = 600;
  const totalDuration = 180;
  
  const pauseEvents = ['visibilitychange', 'blur', 'pagehide'];
  pauseEvents.forEach(event => {
    document.addEventListener(event, function() {
      if (isPlaying && (document.hidden || !document.hasFocus())) {
        pauseTimeline();
      }
    });
  });
  
  if (playBtn) {
    playBtn.addEventListener('click', function() {
      if (isPlaying) {
        pauseTimeline();
      } else {
        playTimeline();
      }
    });
  }
  
  function playTimeline() {
    isPlaying = true;
    playBtn.textContent = '⏸';
    playBtn.classList.add('playing');
    playBtn.setAttribute('aria-label', 'Pause timeline');
    animatePlayhead();
  }
  
  function pauseTimeline() {
    isPlaying = false;
    playBtn.textContent = '▶';
    playBtn.classList.remove('playing');
    playBtn.setAttribute('aria-label', 'Play timeline');
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  }
  
  function animatePlayhead() {
    if (!isPlaying || isDraggingPlayhead) return;
    
    currentTime += 0.1;
    if (currentTime >= totalDuration) {
      currentTime = 0;
    }
    
    updatePlayheadPosition();
    animationId = requestAnimationFrame(animatePlayhead);
  }
  
  function updatePlayheadPosition() {
    const progress = currentTime / totalDuration;
    const newPosition = 80 + (progress * timelineWidth);
    
    if (playhead) {
      playhead.style.left = newPosition + 'px';
    }
    
    if (currentTimeDisplay) {
      currentTimeDisplay.textContent = formatTime(currentTime);
    }
  }
  
  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const frames = Math.floor((seconds % 1) * 30);
    
    return String(hours).padStart(2, '0') + ':' +
           String(minutes).padStart(2, '0') + ':' +
           String(secs).padStart(2, '0') + ':' +
           String(frames).padStart(2, '0');
  }
  
  document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
      return;
    }
    
    if (e.code === 'Space') {
      const slideContainer = document.querySelector('.video-slideshow-container');
      if (slideContainer && isElementInViewport(slideContainer)) {
        return;
      }
    }
    
    if (e.code === 'Space') {
      e.preventDefault();
      if (isPlaying) {
        pauseTimeline();
      } else {
        playTimeline();
      }
    }
  });
  
  const controls = {
    rewind: () => { currentTime = 0; updatePlayheadPosition(); },
    prev: () => { currentTime = Math.max(0, currentTime - 5); updatePlayheadPosition(); },
    next: () => { currentTime = Math.min(totalDuration, currentTime + 5); updatePlayheadPosition(); },
    fastforward: () => { currentTime = totalDuration; updatePlayheadPosition(); }
  };
  
  Object.keys(controls).forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', controls[id]);
    }
  });
  
  initDraggablePlayhead();
  
  function initDraggablePlayhead() {
    if (!playhead) return;
    
    let isDragging = false;
    
    playhead.addEventListener('mousedown', startDrag);
    playhead.addEventListener('touchstart', startDrag, { passive: false });
    
    function startDrag(e) {
      e.preventDefault();
      isDragging = true;
      isDraggingPlayhead = true;
      
      if (isPlaying) {
        pauseTimeline();
      }
      
      playhead.classList.add('dragging');
      
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', endDrag);
      document.addEventListener('touchmove', handleDrag, { passive: false });
      document.addEventListener('touchend', endDrag);
    }
    
    function handleDrag(e) {
      if (!isDragging) return;
      
      e.preventDefault();
      const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
      const rect = playhead.parentElement.getBoundingClientRect();
      const x = clientX - rect.left;
      const newLeft = Math.max(80, Math.min(680, x));
      
      playhead.style.left = newLeft + 'px';
      
      const progress = (newLeft - 80) / timelineWidth;
      currentTime = progress * totalDuration;
      
      if (currentTimeDisplay) {
        currentTimeDisplay.textContent = formatTime(currentTime);
      }
    }
    
    function endDrag() {
      isDragging = false;
      isDraggingPlayhead = false;
      playhead.classList.remove('dragging');
      
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', endDrag);
      document.removeEventListener('touchmove', handleDrag);
      document.removeEventListener('touchend', endDrag);
    }
  }
  
  initEditableClips();
}

function initEditableClips() {
  const clips = document.querySelectorAll('.editable-clip');
  
  clips.forEach(clip => {
    clip.style.cursor = 'grab';
    clip.style.userSelect = 'none';
    clip.style.position = 'absolute';
  });
  
  clips.forEach((clip) => {
    let isDragging = false;
    let startX = 0;
    let startLeft = 0;
    
    clip.removeEventListener('mousedown', clip._handleMouseDown);
    
    clip._handleMouseDown = function(e) {
      isDragging = true;
      startX = e.clientX;
      startLeft = parseInt(this.style.left) || 0;
      
      this.classList.add('dragging');
      this.style.zIndex = '1000';
      this.style.cursor = 'grabbing';
      
      e.preventDefault();
      e.stopPropagation();
      
      document.addEventListener('mousemove', handleClipMove);
      document.addEventListener('mouseup', handleClipUp);
    };
    
    clip.addEventListener('mousedown', clip._handleMouseDown);
    
    function handleClipMove(e) {
      if (!isDragging) return;
      
      const deltaX = e.clientX - startX;
      const newLeft = Math.max(0, startLeft + deltaX);
      const snappedLeft = Math.round(newLeft / 5) * 5;
      
      clip.style.left = snappedLeft + 'px';
      clip.setAttribute('data-start', snappedLeft);
      clip.style.opacity = '0.8';
      
      e.preventDefault();
    }
    
    function handleClipUp() {
      if (!isDragging) return;
      
      isDragging = false;
      clip.classList.remove('dragging');
      clip.style.zIndex = '';
      clip.style.cursor = 'grab';
      clip.style.opacity = '1';
      
      document.removeEventListener('mousemove', handleClipMove);
      document.removeEventListener('mouseup', handleClipUp);
    }
  });
}

// Video Slideshow Functionality
function initSlideshow() {
  const slides = document.querySelectorAll('.video-slide');
  const indicators = document.querySelectorAll('.indicator');
  const prevBtn = document.querySelector('.prev-slide');
  const nextBtn = document.querySelector('.next-slide');
  const currentSlideSpan = document.querySelector('.current-slide');
  const totalSlidesSpan = document.querySelector('.total-slides');
  const slideshowContainer = document.querySelector('.video-slideshow-container');
  
  if (slides.length === 0) return;
  
  let currentSlide = 0;
  let lastSlide = 0;
  
  function updateSlide() {
    slides.forEach((slide, index) => {
      slide.classList.remove('active', 'prev');
      if (index < currentSlide) slide.classList.add('prev');
    });
    
    indicators.forEach(indicator => {
      indicator.classList.remove('active');
    });
    
    slides[currentSlide].classList.add('active');
    if (indicators[currentSlide]) {
      indicators[currentSlide].classList.add('active');
    }
    
    if (currentSlideSpan) {
      currentSlideSpan.textContent = currentSlide + 1;
    }
    if (totalSlidesSpan) {
      totalSlidesSpan.textContent = slides.length;
    }
    
    slides.forEach((slide, index) => {
      const video = slide.querySelector('video');
      if (!video) return;
      
      if (index !== currentSlide) {
        video.pause();
        try { video.currentTime = 0; } catch(e) { }
      } else if (userInteracted) {
        const playPromise = video.play();
        if (playPromise) {
          playPromise.catch(() => {});
        }
      }
    });
    
    if (slideshowContainer) {
      const activeCard = slides[currentSlide].querySelector('.video-card');
      if (activeCard) {
        const h = activeCard.getBoundingClientRect().height;
        slideshowContainer.style.height = h + 'px';
      }
    }
  }
  
  function nextSlide() {
    lastSlide = currentSlide;
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlide();
  }
  
  function prevSlide() {
    lastSlide = currentSlide;
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlide();
  }
  
  function goToSlide(index) {
    if (index === currentSlide) return;
    lastSlide = currentSlide;
    currentSlide = index;
    updateSlide();
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      userInteracted = true;
      nextSlide();
    });
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      userInteracted = true;
      prevSlide();
    });
  }
  
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', (e) => {
      e.preventDefault();
      userInteracted = true;
      goToSlide(index);
    });
  });
  
  document.addEventListener('keydown', (e) => {
    const slideContainer = document.querySelector('.video-slideshow-container');
    if (slideContainer && isElementInViewport(slideContainer)) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        userInteracted = true;
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        userInteracted = true;
        nextSlide();
      } else if (e.code === 'Space') {
        const active = document.querySelector('.video-slide.active video');
        if (active) {
          e.preventDefault();
          userInteracted = true;
          if (active.paused) {
            active.play().catch(()=>{});
          } else {
            active.pause();
          }
        }
      }
    }
  });
  
  let startX = 0;
  let endX = 0;
  
  if (slideshowContainer) {
    slideshowContainer.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });
    
    slideshowContainer.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      const difference = startX - endX;
      
      if (Math.abs(difference) > 50) {
        if (difference > 0) {
          userInteracted = true;
          nextSlide();
        } else {
          userInteracted = true;
          prevSlide();
        }
      }
    });
  }
  
  let userInteracted = false;
  slides.forEach((slide, index) => {
    const video = slide.querySelector('video');
    if (!video) return;
    
    if (index === 0) {
      video.preload = 'auto';
    } else {
      video.preload = 'metadata';
    }
    
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.addEventListener('play', () => { userInteracted = true; });
    
    const markAspect = () => {
      if (video.videoWidth && video.videoHeight) {
        const ratio = video.videoWidth / video.videoHeight;
        if (ratio < 1) {
          video.classList.add('portrait');
        } else {
          video.classList.remove('portrait');
        }
      }
    };
    
    video.addEventListener('loadedmetadata', markAspect);
    if (video.readyState >= 1) {
      markAspect();
    }
  });
  
  updateSlide();
  
  setTimeout(() => {
    if (slideshowContainer) {
      const activeCard = slides[currentSlide].querySelector('.video-card');
      if (activeCard) {
        slideshowContainer.style.height = activeCard.getBoundingClientRect().height + 'px';
      }
    }
  }, 300);
  
  window.addEventListener('resize', () => {
    if (slideshowContainer) {
      const activeCard = slides[currentSlide].querySelector('.video-card');
      if (activeCard) {
        slideshowContainer.style.height = activeCard.getBoundingClientRect().height + 'px';
      }
    }
  });
  
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      slides.forEach(slide => {
        const v = slide.querySelector('video');
        if (v && !v.paused) v.pause();
      });
    }
  });
}

function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}