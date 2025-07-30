export class PhysicsToolbox {
    constructor(toolboxElement, headerElement) {
        this.toolbox = toolboxElement;
        this.header = headerElement;
        this.isDragging = false;
        this.isCollapsed = false;
        
        // Physics state
        this.posX = 20;
        this.posY = 20;
        this.velocityX = 0;
        this.velocityY = 0;
        this.targetX = this.posX;
        this.targetY = this.posY;
        
        // Momentum tracking
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.lastUpdateTime = 0;
        this.velocityHistory = [];
        
        // Constants
        this.VELOCITY_SAMPLES = 5;
        this.SPRING = 0.4;
        this.FRICTION = 0.92;
        this.BOUNCE = 0.7;
        this.MASS = 1.2;
        this.MARGIN = 20;
        this.DRAG_DAMPING = 0.6;
        
        this.animationFrameId = null;
        
        this.initPosition();
        this.setupEventListeners();
        this.startAnimation();
    }
    
    initPosition() {
        // Get saved position or use default
        const savedPos = localStorage.getItem('toolboxPosition');
        if (savedPos) {
            const { x, y } = JSON.parse(savedPos);
            this.posX = x;
            this.posY = y;
        }
        this.updatePosition();
    }
    
    setupEventListeners() {
        // Dragging
        this.header.addEventListener('mousedown', this.startDrag.bind(this));
        window.addEventListener('mousemove', this.drag.bind(this));
        window.addEventListener('mouseup', this.stopDrag.bind(this));
        
        // Touch events
        this.header.addEventListener('touchstart', this.startDrag.bind(this));
        window.addEventListener('touchmove', this.drag.bind(this));
        window.addEventListener('touchend', this.stopDrag.bind(this));
        
        // Collapsing
        const toggleBtn = this.toolbox.querySelector('.toolbox-toggle-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.isCollapsed = !this.isCollapsed;
                const content = this.toolbox.querySelector('.toolbox-content');
                const icon = toggleBtn.querySelector('i');
                
                if (this.isCollapsed) {
                    content.style.display = 'none';
                    icon.className = 'fas fa-chevron-down';
                } else {
                    content.style.display = 'flex';
                    icon.className = 'fas fa-chevron-up';
                }
            });
        }
    }
    
    startDrag(e) {
        if (e.target.closest('.toolbox-toggle-btn')) return;
        
        this.isDragging = true;
        this.lastMouseX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        this.lastMouseY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        
        // Clear velocity history when starting new drag
        this.velocityHistory = [];
    }
    
    drag(e) {
        if (!this.isDragging) return;
        e.preventDefault();
        
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        
        const deltaX = clientX - this.lastMouseX;
        const deltaY = clientY - this.lastMouseY;
        
        this.posX += deltaX;
        this.posY += deltaY;
        
        // Track velocity
        const now = performance.now();
        const timeDelta = now - this.lastUpdateTime;
        if (timeDelta > 0) {
            this.velocityHistory.push({
                x: deltaX / timeDelta,
                y: deltaY / timeDelta,
                time: now
            });
            
            // Keep only recent samples
            while (this.velocityHistory.length > this.VELOCITY_SAMPLES) {
                this.velocityHistory.shift();
            }
        }
        
        this.lastMouseX = clientX;
        this.lastMouseY = clientY;
        this.lastUpdateTime = now;
        
        this.updatePosition();
    }
    
    stopDrag() {
        if (!this.isDragging) return;
        this.isDragging = false;
        
        // Calculate final velocity
        if (this.velocityHistory.length > 0) {
            const averageVelocity = this.velocityHistory.reduce((acc, v) => ({
                x: acc.x + v.x,
                y: acc.y + v.y
            }), { x: 0, y: 0 });
            
            this.velocityX = (averageVelocity.x / this.velocityHistory.length) * 60;
            this.velocityY = (averageVelocity.y / this.velocityHistory.length) * 60;
        }
        
        // Save position
        localStorage.setItem('toolboxPosition', JSON.stringify({
            x: this.posX,
            y: this.posY
        }));
    }
    
    updatePosition() {
        // Keep toolbox within viewport bounds
        const rect = this.toolbox.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width - this.MARGIN;
        const maxY = window.innerHeight - rect.height - this.MARGIN;
        
        this.posX = Math.min(Math.max(this.MARGIN, this.posX), maxX);
        this.posY = Math.min(Math.max(this.MARGIN, this.posY), maxY);
        
        this.toolbox.style.transform = `translate(${this.posX}px, ${this.posY}px)`;
    }
    
    animate() {
        if (!this.isDragging) {
            // Apply physics
            this.velocityX *= this.FRICTION;
            this.velocityY *= this.FRICTION;
            
            this.posX += this.velocityX;
            this.posY += this.velocityY;
            
            // Stop animation if movement is negligible
            if (Math.abs(this.velocityX) < 0.01 && Math.abs(this.velocityY) < 0.01) {
                this.velocityX = 0;
                this.velocityY = 0;
            }
            
            this.updatePosition();
        }
        
        this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
    }
    
    startAnimation() {
        if (this.animationFrameId === null) {
            this.animate();
        }
    }
    
    stopAnimation() {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
}

// Initialize physics for toolbox if elements exist
document.addEventListener('DOMContentLoaded', () => {
    const toolboxV2 = document.getElementById('toolbox-v2');
    if (toolboxV2) {
        const header = toolboxV2.querySelector('.toolbox-header');
        new PhysicsToolbox(toolboxV2, header);
    }
});
