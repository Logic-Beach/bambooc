document.addEventListener('DOMContentLoaded', function() {
    const carouselTrack = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let currentSlide = 0;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    // Initialize carousel
    function initCarousel() {
        if (slides.length === 0) return;
        
        // Set initial position
        updateCarousel();
        setupEventListeners();
        
        // Log for debugging
        console.log('Carousel initialized with', slides.length, 'slides');
    }
    
    // Update carousel position
    function updateCarousel() {
        if (slides.length === 0) return;
        
        const containerWidth = carouselTrack.parentElement.offsetWidth;
        const translateX = -(currentSlide * containerWidth);
        
        carouselTrack.style.transform = `translateX(${translateX}px)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
        
        // Update button states
        if (prevBtn) prevBtn.style.opacity = currentSlide === 0 ? '0.5' : '1';
        if (nextBtn) nextBtn.style.opacity = currentSlide === slides.length - 1 ? '0.5' : '1';
        
        console.log('Updated to slide', currentSlide, 'translateX:', translateX, 'containerWidth:', containerWidth);
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentSlide > 0) {
                    currentSlide--;
                    updateCarousel();
                }
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentSlide < slides.length - 1) {
                    currentSlide++;
                    updateCarousel();
                }
            });
        }
        
        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                updateCarousel();
            });
        });
        
        // Touch/swipe events
        carouselTrack.addEventListener('touchstart', handleTouchStart, { passive: false });
        carouselTrack.addEventListener('touchmove', handleTouchMove, { passive: false });
        carouselTrack.addEventListener('touchend', handleTouchEnd);
        
        // Mouse events for desktop
        carouselTrack.addEventListener('mousedown', handleMouseDown);
        carouselTrack.addEventListener('mousemove', handleMouseMove);
        carouselTrack.addEventListener('mouseup', handleMouseUp);
        carouselTrack.addEventListener('mouseleave', handleMouseUp);
        
        // Keyboard navigation
        document.addEventListener('keydown', handleKeyDown);
        
        // Prevent context menu on carousel
        carouselTrack.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Handle window resize
        window.addEventListener('resize', () => {
            setTimeout(updateCarousel, 100);
        });
    }
    
    // Touch event handlers
    function handleTouchStart(e) {
        startX = e.touches[0].clientX;
        isDragging = true;
        carouselTrack.style.transition = 'none';
    }
    
    function handleTouchMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        const containerWidth = carouselTrack.parentElement.offsetWidth;
        const translateX = -(currentSlide * containerWidth) + diff;
        carouselTrack.style.transform = `translateX(${translateX}px)`;
    }
    
    function handleTouchEnd(e) {
        if (!isDragging) return;
        isDragging = false;
        carouselTrack.style.transition = 'transform 0.3s ease';
        
        const diff = currentX - startX;
        const containerWidth = carouselTrack.parentElement.offsetWidth;
        const threshold = containerWidth * 0.3;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0 && currentSlide > 0) {
                currentSlide--;
            } else if (diff < 0 && currentSlide < slides.length - 1) {
                currentSlide++;
            }
        }
        
        updateCarousel();
    }
    
    // Mouse event handlers
    function handleMouseDown(e) {
        startX = e.clientX;
        isDragging = true;
        carouselTrack.style.transition = 'none';
        carouselTrack.style.cursor = 'grabbing';
    }
    
    function handleMouseMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        currentX = e.clientX;
        const diff = currentX - startX;
        const containerWidth = carouselTrack.parentElement.offsetWidth;
        const translateX = -(currentSlide * containerWidth) + diff;
        carouselTrack.style.transform = `translateX(${translateX}px)`;
    }
    
    function handleMouseUp(e) {
        if (!isDragging) return;
        isDragging = false;
        carouselTrack.style.transition = 'transform 0.3s ease';
        carouselTrack.style.cursor = 'grab';
        
        const diff = currentX - startX;
        const containerWidth = carouselTrack.parentElement.offsetWidth;
        const threshold = containerWidth * 0.3;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0 && currentSlide > 0) {
                currentSlide--;
            } else if (diff < 0 && currentSlide < slides.length - 1) {
                currentSlide++;
            }
        }
        
        updateCarousel();
    }
    
    // Keyboard navigation
    function handleKeyDown(e) {
        if (e.key === 'ArrowLeft' && currentSlide > 0) {
            currentSlide--;
            updateCarousel();
        } else if (e.key === 'ArrowRight' && currentSlide < slides.length - 1) {
            currentSlide++;
            updateCarousel();
        }
    }
    
    // Auto-play functionality (optional)
    let autoPlayInterval;
    
    function startAutoPlay() {
        if (slides.length <= 1) return; // Don't auto-play if only one slide
        
        autoPlayInterval = setInterval(() => {
            if (currentSlide < slides.length - 1) {
                currentSlide++;
            } else {
                currentSlide = 0;
            }
            updateCarousel();
        }, 5000); // Change slide every 5 seconds
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    // Pause auto-play on hover
    carouselTrack.addEventListener('mouseenter', stopAutoPlay);
    carouselTrack.addEventListener('mouseleave', startAutoPlay);
    
    // Initialize the carousel
    initCarousel();
    
    // Start auto-play
    startAutoPlay();
}); 