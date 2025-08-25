// Global Variables
let currentSlide = 0;
let currentCarouselIndex = 0;
const totalSlides = 3;
const totalCarouselItems = 6;
const itemsPerView = 3;
const maxCarouselIndex = totalCarouselItems - itemsPerView;

// DOM Elements
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const carouselTrack = document.getElementById('carousel-track');
const carouselDots = document.querySelectorAll('.carousel-dot');

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeSlider();
    initializeCarousel();
    setupImageErrorHandling();
});

// Slider Functions
function initializeSlider() {
    // Start auto-slide
    setInterval(autoSlide, 5000);
    
    // Show first slide
    showSlide(0);
}

function showSlide(n) {
    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Wrap around if necessary
    if (n >= totalSlides) currentSlide = 0;
    if (n < 0) currentSlide = totalSlides - 1;
    
    // Show current slide
    if (slides[currentSlide]) {
        slides[currentSlide].classList.add('active');
    }
    if (dots[currentSlide]) {
        dots[currentSlide].classList.add('active');
    }
}

function changeSlide(direction) {
    currentSlide += direction;
    showSlide(currentSlide);
}

function currentSlideFunc(n) {
    currentSlide = n - 1;
    showSlide(currentSlide);
}

function autoSlide() {
    currentSlide++;
    showSlide(currentSlide);
}

// Carousel Functions
function initializeCarousel() {
    updateCarouselCounter();
    updateCarouselButtons();
    updateCarouselDots();
}

function moveCarousel(direction) {
    const newIndex = currentCarouselIndex + direction;
    
    // Check boundaries
    if (newIndex >= 0 && newIndex <= maxCarouselIndex) {
        currentCarouselIndex = newIndex;
        updateCarouselPosition();
        updateCarouselCounter();
        updateCarouselButtons();
        updateCarouselDots();
    }
}

function updateCarouselPosition() {
    const translateX = -(currentCarouselIndex * (100 / itemsPerView));
    carouselTrack.style.transform = `translateX(${translateX}%)`;
}

function updateCarouselCounter() {
    const currentElement = document.getElementById('carousel-current');
    const showingElement = document.getElementById('carousel-showing');
    const totalElement = document.getElementById('carousel-total');
    
    if (currentElement) currentElement.textContent = currentCarouselIndex + 1;
    if (showingElement) showingElement.textContent = Math.min(currentCarouselIndex + itemsPerView, totalCarouselItems);
    if (totalElement) totalElement.textContent = totalCarouselItems;
}

function updateCarouselButtons() {
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    
    if (prevBtn) {
        prevBtn.disabled = currentCarouselIndex === 0;
    }
    if (nextBtn) {
        nextBtn.disabled = currentCarouselIndex >= maxCarouselIndex;
    }
}

function updateCarouselDots() {
    carouselDots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index === currentCarouselIndex) {
            dot.classList.add('active');
        }
    });
}

function goToCarouselSlide(index) {
    if (index >= 0 && index <= maxCarouselIndex) {
        currentCarouselIndex = index;
        updateCarouselPosition();
        updateCarouselCounter();
        updateCarouselButtons();
        updateCarouselDots();
    }
}

// Image Error Handling
function setupImageErrorHandling() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Create a fallback placeholder
            const altText = this.alt || 'GROW Service';
            const encodedText = encodeURIComponent(altText);
            this.src = `https://placehold.co/400x300?text=${encodedText}`;
        });
        
        // Add loading animation
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
    });
}

// Smooth Scrolling for Navigation Links
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Button Click Handlers
function handleCTAClick() {
    // Scroll to services section
    smoothScroll('.services-section');
}

function handleServiceClick(serviceName) {
    // You can add specific service handling here
    console.log(`Service clicked: ${serviceName}`);
    // For now, just show an alert
    alert(`Learn more about ${serviceName}! Contact us for details.`);
}

// Add event listeners for CTA buttons
document.addEventListener('DOMContentLoaded', function() {
    // CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-button, .cta-button-large');
    ctaButtons.forEach(button => {
        button.addEventListener('click', handleCTAClick);
    });
    
    // Service card buttons
    const serviceButtons = document.querySelectorAll('.card-button');
    serviceButtons.forEach((button, index) => {
        const serviceNames = [
            'Digital Printing',
            'Display Systems', 
            'Booth Exhibitions',
            'Outdoor Advertising',
            'Creative Design',
            'Brand Identity'
        ];
        
        button.addEventListener('click', () => {
            handleServiceClick(serviceNames[index] || 'Our Service');
        });
    });
});

// Navbar Scroll Effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Responsive Carousel Adjustments
function handleResize() {
    const width = window.innerWidth;
    let newItemsPerView = 3;
    
    if (width <= 480) {
        newItemsPerView = 1;
    } else if (width <= 768) {
        newItemsPerView = 2;
    }
    
    // Update items per view if changed
    if (newItemsPerView !== itemsPerView) {
        itemsPerView = newItemsPerView;
        maxCarouselIndex = totalCarouselItems - itemsPerView;
        
        // Reset carousel position if needed
        if (currentCarouselIndex > maxCarouselIndex) {
            currentCarouselIndex = maxCarouselIndex;
        }
        
        updateCarouselPosition();
        updateCarouselCounter();
        updateCarouselButtons();
        updateCarouselDots();
    }
}

// Add resize listener
window.addEventListener('resize', handleResize);

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
    switch(e.key) {
        case 'ArrowLeft':
            if (e.target.closest('.hero-slider')) {
                changeSlide(-1);
            } else if (e.target.closest('.services-section')) {
                moveCarousel(-1);
            }
            break;
        case 'ArrowRight':
            if (e.target.closest('.hero-slider')) {
                changeSlide(1);
            } else if (e.target.closest('.services-section')) {
                moveCarousel(1);
            }
            break;
    }
});

// Touch/Swipe Support for Mobile
let touchStartX = 0;
let touchEndX = 0;

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next
            if (document.querySelector('.hero-slider:hover')) {
                changeSlide(1);
            } else if (document.querySelector('.services-section:hover')) {
                moveCarousel(1);
            }
        } else {
            // Swipe right - previous
            if (document.querySelector('.hero-slider:hover')) {
                changeSlide(-1);
            } else if (document.querySelector('.services-section:hover')) {
                moveCarousel(-1);
            }
        }
    }
}

// Add touch event listeners
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchend', handleTouchEnd, false);

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.service-card, .section-header');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Performance Optimization - Debounce Function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to resize handler
window.addEventListener('resize', debounce(handleResize, 250));

// Console Welcome Message
console.log(`
🌟 GROW - Digital Printing & Advertising Solutions
🎨 Energetic, elegant solutions for the modern generation
💻 Website built with PHP, JavaScript, and CSS
🚀 Ready to grow your business!
`);
