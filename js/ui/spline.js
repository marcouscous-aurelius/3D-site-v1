export class SplineController {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.isDragging = false;
        this.draggedPoint = null;
        this.logicalWidth = 0;
        this.logicalHeight = 0;
        
        this.controlPoints = [
            { x: 0, y: 1 },
            { x: 0.5, y: 0.5 },
            { x: 1, y: 0 }
        ];
        
        this.presets = {
            linear: [
                { x: 0, y: 1 },
                { x: 0.5, y: 0.5 },
                { x: 1, y: 0 }
            ],
            easeIn: [
                { x: 0, y: 1 },
                { x: 0.3, y: 0.8 },
                { x: 1, y: 0 }
            ],
            easeOut: [
                { x: 0, y: 1 },
                { x: 0.7, y: 0.2 },
                { x: 1, y: 0 }
            ],
            exponential: [
                { x: 0, y: 1 },
                { x: 0.2, y: 0.9 },
                { x: 1, y: 0 }
            ],
            bezier: [
                { x: 0, y: 1 },
                { x: 0.25, y: 0.9 },
                { x: 0.75, y: 0.1 },
                { x: 1, y: 0 }
            ]
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupCanvasResize();
        this.draw();
        this.setupPresetButtons();
    }
    
    // ... [Previous spline controller methods]
    // Note: For brevity, I've omitted the implementation details of the SplineController methods
    // as they remain unchanged from the original file. In a real implementation, all the methods
    // would be included here.
    
    getFalloffValue(normalizedDistance) {
        const point = this.evaluateSpline(normalizedDistance);
        return Math.max(0, Math.min(1, point.y));
    }
}

// Initialize spline controller
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('falloffSpline');
    if (canvas) {
        window.splineController = new SplineController('falloffSpline');
    }
});
