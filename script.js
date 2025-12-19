// Slide Navigation
const slidesContainer = document.getElementById('slidesContainer');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const slideCounter = document.getElementById('slideCounter');
const progressFill = document.getElementById('progressFill');
const navDots = document.getElementById('navDots');
const themeToggle = document.getElementById('themeToggle');

let currentSlide = 0;
const totalSlides = 9; // Updated to 9 slides

// Create navigation dots
function createNavDots() {
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('nav-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        navDots.appendChild(dot);
    }
}

// Update UI
function updateUI() {
    // Update counter
    slideCounter.textContent = `${currentSlide + 1} / ${totalSlides}`;

    // Update progress bar
    const progress = ((currentSlide + 1) / totalSlides) * 100;
    progressFill.style.width = `${progress}%`;

    // Update dots
    document.querySelectorAll('.nav-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });

    // Update button states
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === totalSlides - 1;
    prevBtn.style.opacity = currentSlide === 0 ? '0.5' : '1';
    nextBtn.style.opacity = currentSlide === totalSlides - 1 ? '0.5' : '1';
}

// Navigate to specific slide
function goToSlide(index) {
    if (index >= 0 && index < totalSlides) {
        currentSlide = index;
        slides[index].scrollIntoView({ behavior: 'smooth' });
        updateUI();
    }
}

// Next slide
function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        goToSlide(currentSlide + 1);
    }
}

// Previous slide
function prevSlide() {
    if (currentSlide > 0) {
        goToSlide(currentSlide - 1);
    }
}

// Detect scroll position
let scrollTimeout;
slidesContainer.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        const scrollPosition = slidesContainer.scrollTop;
        const slideHeight = window.innerHeight;
        const newSlide = Math.round(scrollPosition / slideHeight);

        if (newSlide !== currentSlide && newSlide >= 0 && newSlide < totalSlides) {
            currentSlide = newSlide;
            updateUI();
        }
    }, 100);
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
    } else if (e.key === 'Home') {
        e.preventDefault();
        goToSlide(0);
    } else if (e.key === 'End') {
        e.preventDefault();
        goToSlide(totalSlides - 1);
    }
});

// Button click handlers
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

// Dark mode toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    const icon = themeToggle.querySelector('.theme-icon');
    if (isDark) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
    localStorage.setItem('darkMode', isDark);
});

// Load dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    const icon = themeToggle.querySelector('.theme-icon');
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
}

// Touch/swipe support for mobile
let touchStartY = 0;
let touchEndY = 0;

slidesContainer.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

slidesContainer.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe up - next slide
            nextSlide();
        } else {
            // Swipe down - previous slide
            prevSlide();
        }
    }
}

// Mouse wheel navigation (optional - can be removed if too sensitive)
let wheelTimeout;
slidesContainer.addEventListener('wheel', (e) => {
    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
        if (e.deltaY > 0) {
            nextSlide();
        } else if (e.deltaY < 0) {
            prevSlide();
        }
    }, 50);
}, { passive: true });

// Intersection Observer for slide animations
const observerOptions = {
    root: slidesContainer,
    threshold: 0.5
};

const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

slides.forEach(slide => {
    slideObserver.observe(slide);
});

// Initialize
createNavDots();
updateUI();

// Prevent default scroll behavior on space key
window.addEventListener('keydown', (e) => {
    if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
    }
});

// Add smooth scroll polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js';
    document.head.appendChild(script);
}

// Presentation mode (F11 or double-click)
document.addEventListener('dblclick', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

// Add slide number indicators on hover
slides.forEach((slide, index) => {
    const indicator = document.createElement('div');
    indicator.className = 'slide-indicator';
    indicator.textContent = index + 1;
    indicator.style.cssText = `
        position: absolute;
        top: 20px;
        left: 20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(99, 102, 241, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        color: var(--primary);
        opacity: 0;
        transition: opacity 0.3s;
    `;
    slide.style.position = 'relative';
    slide.appendChild(indicator);

    slide.addEventListener('mouseenter', () => {
        indicator.style.opacity = '1';
    });

    slide.addEventListener('mouseleave', () => {
        indicator.style.opacity = '0';
    });
});

console.log('🎯 Presentation loaded! Use arrow keys, mouse wheel, or navigation buttons to navigate.');
console.log('💡 Keyboard shortcuts:');
console.log('   ← ↑ : Previous slide');
console.log('   → ↓ Space: Next slide');
console.log('   Home: First slide');
console.log('   End: Last slide');
console.log('   Double-click: Toggle fullscreen');
