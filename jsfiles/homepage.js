let animationTimeout;
let isAnimating = false;
let animationState = 'idle';

// Preload prevention
document.addEventListener('DOMContentLoaded', () => {
    // Add preload class to prevent flash
    document.body.classList.add('preload');
    
    // Remove preload class after a short delay
    setTimeout(() => {
        document.body.classList.remove('preload');
        initializeElements();
    }, 100);
});

function initializeElements() {
    const incomingCall = document.getElementById('incomingCall');
    const missedCall = document.getElementById('missedCall');
    const aiPopup = document.getElementById('aiPopup');
    
    if (!incomingCall || !missedCall || !aiPopup) {
        console.error('Animation elements not found');
        return;
    }
    
    // Ensure all elements are properly reset
    resetElements();
    
    console.log('Elements initialized successfully');
}

function startAnimation() {
    if (isAnimating) {
        console.log('Animation already running, skipping');
        return;
    }
    
    isAnimating = true;
    animationState = 'running';
    
    const incomingCall = document.getElementById('incomingCall');
    const missedCall = document.getElementById('missedCall');
    const aiPopup = document.getElementById('aiPopup');

    if (!incomingCall || !missedCall || !aiPopup) {
        console.error('Animation elements not found, stopping');
        isAnimating = false;
        return;
    }

    // Reset all elements to initial state
    resetElements();
    
    console.log('Starting animation cycle');

    // Add a small delay before starting the animation
    setTimeout(() => {
        if (!isAnimating) return; // Check if animation was stopped
        
        // Step 1: Show incoming call (4 seconds)
        incomingCall.classList.add('show');
        console.log('Showing incoming call');
        
        animationTimeout = setTimeout(() => {
            if (!isAnimating) return;
            
            // Step 2: Hide incoming call with smooth transition
            incomingCall.classList.remove('show');
            
            // Wait for incoming call to disappear, then show missed call
            setTimeout(() => {
                if (!isAnimating) return;
                
                missedCall.classList.add('show');
                console.log('Showing missed call');
                
                animationTimeout = setTimeout(() => {
                    if (!isAnimating) return;
                    
                    // Step 3: Hide missed call with smooth transition
                    missedCall.classList.remove('show');
                    
                    // Wait for missed call to disappear, then show AI popup
                    setTimeout(() => {
                        if (!isAnimating) return;
                        
                        aiPopup.classList.add('show');
                        console.log('Showing AI popup');
                        
                        animationTimeout = setTimeout(() => {
                            if (!isAnimating) return;
                            
                            // Step 4: Hide AI popup with smooth transition
                            aiPopup.classList.remove('show');
                            
                            // Wait for AI popup to disappear, then restart
                            setTimeout(() => {
                                if (!isAnimating) return;
                                
                                isAnimating = false;
                                animationState = 'idle';
                                
                                // Start next cycle with a longer pause between cycles
                                animationTimeout = setTimeout(() => {
                                    if (animationState === 'idle') {
                                        startAnimation();
                                    }
                                }, 1500);
                                
                                console.log('Cycle complete, scheduling next cycle');
                            }, 800); // Wait for AI popup to fully disappear
                        }, 4000); // Show AI popup for 4 seconds
                    }, 800); // Wait for missed call to fully disappear
                }, 4000); // Show missed call for 4 seconds
            }, 800); // Wait for incoming call to fully disappear
        }, 4000); // Show incoming call for 4 seconds
    }, 500); // Initial delay before starting animation
}

function resetElements() {
    const incomingCall = document.getElementById('incomingCall');
    const missedCall = document.getElementById('missedCall');
    const aiPopup = document.getElementById('aiPopup');
    
    if (!incomingCall || !missedCall || !aiPopup) {
        return;
    }
    
    // Remove all animation classes
    incomingCall.classList.remove('show');
    missedCall.classList.remove('show');
    aiPopup.classList.remove('show');
    
    // Force a reflow to ensure the changes take effect
    void incomingCall.offsetHeight;
    void missedCall.offsetHeight;
    void aiPopup.offsetHeight;
}

function resetAnimation() {
    console.log('Resetting animation');
    
    // Clear any existing timeouts
    if (animationTimeout) {
        clearTimeout(animationTimeout);
        animationTimeout = null;
    }
    
    // Reset state
    isAnimating = false;
    animationState = 'idle';
    
    // Reset all elements immediately
    resetElements();
    
    // Restart animation after brief delay
    setTimeout(() => {
        startAnimation();
    }, 500);
    
    console.log('Animation reset and restarted');
}

function stopAnimation() {
    console.log('Stopping animation');
    
    // Clear any existing timeouts
    if (animationTimeout) {
        clearTimeout(animationTimeout);
        animationTimeout = null;
    }
    
    // Reset state
    isAnimating = false;
    animationState = 'stopped';
    
    // Reset elements
    resetElements();
    
    console.log('Animation stopped');
}

// Enhanced page visibility handling
function handleVisibilityChange() {
    if (document.hidden) {
        // Page is hidden, pause animation
        console.log('Page hidden, pausing animation');
        if (isAnimating) {
            stopAnimation();
        }
    } else {
        // Page is visible, resume animation
        console.log('Page visible, resuming animation');
        if (animationState !== 'running') {
            setTimeout(() => {
                startAnimation();
            }, 1000);
        }
    }
}

// Start animation when page loads completely
window.addEventListener('load', () => {
    console.log('Page loaded, starting animation');
    setTimeout(() => {
        startAnimation();
    }, 2000); // Longer initial delay for better UX
});

// Handle visibility changes
document.addEventListener('visibilitychange', handleVisibilityChange);

// Handle page focus for better animation continuity
window.addEventListener('focus', () => {
    console.log('Page focused');
    if (!isAnimating && !document.hidden && animationState !== 'running') {
        setTimeout(() => {
            startAnimation();
        }, 1000);
    }
});

// Handle page blur to stop unnecessary animations
window.addEventListener('blur', () => {
    console.log('Page blurred');
    if (isAnimating) {
        stopAnimation();
    }
});

// Optional: Add keyboard shortcuts for testing
document.addEventListener('keydown', (e) => {
    // Press 'R' to reset animation
    if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        resetAnimation();
    }
    // Press 'S' to stop animation
    if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        stopAnimation();
    }
    // Press 'Space' to start animation
    if (e.key === ' ') {
        e.preventDefault();
        if (!isAnimating) {
            startAnimation();
        }
    }
});

// Intersection Observer for better performance
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animation container is visible
            console.log('Animation container visible');
            if (!isAnimating && animationState !== 'running') {
                setTimeout(() => {
                    startAnimation();
                }, 1000);
            }
        } else {
            // Animation container is not visible
            console.log('Animation container not visible');
            if (isAnimating) {
                stopAnimation();
            }
        }
    });
}, {
    threshold: 0.3 // Trigger when 30% of the element is visible
});

// Start observing the animation container
window.addEventListener('load', () => {
    const animationContainer = document.querySelector('.hero-animation');
    if (animationContainer) {
        observer.observe(animationContainer);
        console.log('Started observing animation container');
    }
});

// Debug functions
function checkAnimationState() {
    console.log('Animation state:', {
        isAnimating,
        animationState,
        hasTimeout: !!animationTimeout,
        documentHidden: document.hidden,
        pageVisible: !document.hidden
    });
}