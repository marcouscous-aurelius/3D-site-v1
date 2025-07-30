import { camera } from '../core/scene.js';

// Mouse state
export const mouse = {
    x: 0,
    y: 0,
    target: { x: 0, y: 0 },
    isInWindow: false
};

// Touch state
export const touchState = {
    isTouching: false,
    lastTouchX: 0,
    lastTouchY: 0,
    touchStartX: 0,
    touchStartY: 0,
    touchStartTime: 0
};

// Event handlers
window.addEventListener('mousemove', (event) => {
    mouse.target.x = (event.clientX / window.innerWidth - 0.5) * 2;
    mouse.target.y = (event.clientY / window.innerHeight - 0.5) * 2;
    mouse.isInWindow = true;
});

window.addEventListener('mouseout', () => {
    mouse.isInWindow = false;
});

window.addEventListener('mouseover', () => {
    mouse.isInWindow = true;
});

// Touch handlers
export const canvas = document.querySelector('#threejs-container');

canvas.addEventListener('touchstart', (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    touchState.isTouching = true;
    touchState.lastTouchX = touch.clientX;
    touchState.lastTouchY = touch.clientY;
    touchState.touchStartX = touch.clientX;
    touchState.touchStartY = touch.clientY;
    touchState.touchStartTime = Date.now();
    
    mouse.target.x = (touch.clientX / window.innerWidth - 0.5) * 2;
    mouse.target.y = (touch.clientY / window.innerHeight - 0.5) * 2;
    mouse.isInWindow = true;
}, { passive: false });

canvas.addEventListener('touchmove', (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    
    mouse.target.x = (touch.clientX / window.innerWidth - 0.5) * 2;
    mouse.target.y = (touch.clientY / window.innerHeight - 0.5) * 2;
    
    touchState.lastTouchX = touch.clientX;
    touchState.lastTouchY = touch.clientY;
}, { passive: false });

canvas.addEventListener('touchend', (event) => {
    event.preventDefault();
    touchState.isTouching = false;
    
    const touchDuration = Date.now() - touchState.touchStartTime;
    const touchDistance = Math.sqrt(
        Math.pow(touchState.lastTouchX - touchState.touchStartX, 2) +
        Math.pow(touchState.lastTouchY - touchState.touchStartY, 2)
    );
}, { passive: false });

canvas.addEventListener('touchcancel', (event) => {
    event.preventDefault();
    touchState.isTouching = false;
}, { passive: false });
