// Minimal portfolio script - clean and simple
document.addEventListener('DOMContentLoaded', function(){
  console.log('Minimal portfolio loaded');
  
  initTimeline();
  initMobileNavigation();
  initSmoothScrolling();
  initVideoManager();
  initSlideshow();
  setCurrentYear();
  
  setTimeout(initEditableClips, 200);
});

function setCurrentYear() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

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
  }
}

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
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });
}

function initTimeline() {
  const playBtn = document.getElementById('playBtn');
  const playhead = document.getElementById('playhead');
  const currentTimeDisplay = document.getElementById('currentTime');
  
  let isPlaying = false;
  let currentTime = 0;
  let animationId = null;
  const timelineWidth = 600;
  const totalDuration = 180;
  
  if (playBtn) {
    playBtn.addEventListener('click', function() {
      isPlaying ? pauseTimeline() : playTimeline();
    });
  }
  
  function playTimeline() {
    isPlaying = true;
    playBtn.textContent = '⏸';
    playBtn.classList.add('playing');
    animatePlayhead();
  }
  
  function pauseTimeline() {
    isPlaying = false;
    playBtn.textContent = '▶';
    playBtn.classList.remove('playing');
    if (animationId) cancelAnimationFrame(animationId);
  }
  
  function animatePlayhead() {
    if (!isPlaying) return;
    currentTime += 0.1;
    if (currentTime >= totalDuration) currentTime = 0;
    updatePlayheadPosition();
    animationId = requestAnimationFrame(animatePlayhead);
  }
  
  function updatePlayheadPosition() {
    const progress = currentTime / totalDuration;
    const newPosition = 80 + (progress * timelineWidth);
    if (playhead) playhead.style.left = newPosition + 'px';
    if (currentTimeDisplay) currentTimeDisplay.textContent = formatTime(currentTime);
  }
  
  function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const f = Math.floor((seconds % 1) * 30);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`;
  }
  
  const controls = {
    rewind: () => { currentTime = 0; updatePlayheadPosition(); },
    prev: () => { currentTime = Math.max(0, currentTime - 5); updatePlayheadPosition(); },
    next: () => { currentTime = Math.min(totalDuration, currentTime + 5); updatePlayheadPosition(); },
    fastforward: () => { currentTime = totalDuration; updatePlayheadPosition(); }
  };
  
  Object.keys(controls).forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', controls[id]);
  });
  
  initEditableClips();
}

function initEditableClips() {
  const clips = document.querySelectorAll('.editable-clip');
  clips.forEach(clip => {
    clip.style.cursor = 'grab';
    let isDragging = false;
    let startX = 0;
    let startLeft = 0;
    
    clip.addEventListener('mousedown', function(e) {
      isDragging = true;
      startX = e.clientX;
      startLeft = parseInt(this.style.left) || 0;
      this.style.cursor = 'grabbing';
      e.preventDefault();
    });
    
    document.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      const newLeft = Math.max(0, startLeft + deltaX);
      clip.style.left = Math.round(newLeft / 5) * 5 + 'px';
    });
    
    document.addEventListener('mouseup', function() {
      if (isDragging) {
        isDragging = false;
        clip.style.cursor = 'grab';
      }
    });
  });
}

function initSlideshow() {
  const slides = document.querySelectorAll('.video-slide');
  const indicators = document.querySelectorAll('.indicator');
  const prevBtn = document.querySelector('.prev-slide');
  const nextBtn = document.querySelector('.next-slide');
  const currentSlideSpan = document.querySelector('.current-slide');
  const totalSlidesSpan = document.querySelector('.total-slides');
  
  if (slides.length === 0) return;
  
  let currentSlide = 0;
  
  function updateSlide() {
    slides.forEach((slide, i) => slide.classList.toggle('active', i === currentSlide));
    indicators.forEach((ind, i) => ind.classList.toggle('active', i === currentSlide));
    if (currentSlideSpan) currentSlideSpan.textContent = currentSlide + 1;
    if (totalSlidesSpan) totalSlidesSpan.textContent = slides.length;
    
    slides.forEach((slide, i) => {
      const video = slide.querySelector('video');
      if (video) {
        if (i !== currentSlide) {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }
  
  if (nextBtn) nextBtn.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlide();
  });
  
  if (prevBtn) prevBtn.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlide();
  });
  
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      currentSlide = index;
      updateSlide();
    });
  });
  
  updateSlide();
}