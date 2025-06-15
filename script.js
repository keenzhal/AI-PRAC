document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const slidesContainer = document.querySelector('.slides-container');

    if (!slides.length || !dots.length || !slidesContainer) {
        console.error('Essential elements for the presentation are missing.');
        return;
    }

    let currentSlideIndex = 0;
    let isScrolling = false;

    const scrollToSlide = (index) => {
        if (slides[index]) {
            slides[index].scrollIntoView({ behavior: 'smooth' });
        }
    };

    const updateActiveDot = (index) => {
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[index]) {
            dots[index].classList.add('active');
        }
    };

    // Intersection Observer to detect the current slide and trigger animations
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                const intersectingSlide = entry.target;
                const contentElements = intersectingSlide.querySelectorAll('.fade-in');

                if (entry.isIntersecting) {
                    const index = Array.from(slides).indexOf(intersectingSlide);
                    currentSlideIndex = index;
                    updateActiveDot(index);
                    contentElements.forEach(el => el.classList.add('visible'));
                } else {
                    // Optional: remove visibility when slide is not in view
                    // to re-trigger animation on scroll back
                    contentElements.forEach(el => el.classList.remove('visible'));
                }
            });
        },
        { 
            root: slidesContainer,
            threshold: 0.6 // Slide is considered active when 60% is visible
        }
    );

    slides.forEach(slide => observer.observe(slide));

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            scrollToSlide(index);
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            currentSlideIndex = Math.min(slides.length - 1, currentSlideIndex + 1);
            scrollToSlide(currentSlideIndex);
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            currentSlideIndex = Math.max(0, currentSlideIndex - 1);
            scrollToSlide(currentSlideIndex);
        }
    });

    // Touch swipe navigation
    let touchStartY = 0;
    slidesContainer.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    slidesContainer.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const swipeThreshold = 50; // Minimum distance for a swipe

        if (touchStartY - touchEndY > swipeThreshold) {
            // Swiped up
            currentSlideIndex = Math.min(slides.length - 1, currentSlideIndex + 1);
            scrollToSlide(currentSlideIndex);
        } else if (touchEndY - touchStartY > swipeThreshold) {
            // Swiped down
            currentSlideIndex = Math.max(0, currentSlideIndex - 1);
            scrollToSlide(currentSlideIndex);
        }
    }, { passive: true });
    
    // On resize, snap to the current slide to avoid misalignment
    window.addEventListener('resize', () => {
        if (slides[currentSlideIndex]) {
           slides[currentSlideIndex].scrollIntoView({ behavior: 'auto' });
        }
    });

}); 