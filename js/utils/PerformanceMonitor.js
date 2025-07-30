export class PerformanceMonitor {
    constructor() {
        this.fps = 0;
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.memoryUsage = {};
        this.listeners = new Set();
    }

    update() {
        this.frameCount++;
        const currentTime = performance.now();
        const elapsed = currentTime - this.lastTime;

        if (elapsed >= 1000) {
            this.fps = (this.frameCount * 1000) / elapsed;
            this.frameCount = 0;
            this.lastTime = currentTime;

            // Update memory usage if available
            if (window.performance && window.performance.memory) {
                this.memoryUsage = {
                    usedHeapSize: window.performance.memory.usedJSHeapSize,
                    totalHeapSize: window.performance.memory.totalJSHeapSize,
                    heapLimit: window.performance.memory.jsHeapSizeLimit
                };
            }

            this.notifyListeners();
        }
    }

    addListener(callback) {
        this.listeners.add(callback);
    }

    removeListener(callback) {
        this.listeners.delete(callback);
    }

    notifyListeners() {
        const stats = {
            fps: this.fps,
            memory: this.memoryUsage
        };
        this.listeners.forEach(callback => callback(stats));
    }
}
