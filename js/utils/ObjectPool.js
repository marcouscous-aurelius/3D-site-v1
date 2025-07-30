export class ObjectPool {
    constructor() {
        this.pool = new Map();
    }

    // Get or create an object from the pool
    acquire(type, createFn) {
        if (!this.pool.has(type)) {
            this.pool.set(type, []);
        }
        
        const typePool = this.pool.get(type);
        if (typePool.length > 0) {
            return typePool.pop();
        }
        
        return createFn();
    }

    // Return an object to the pool
    release(type, object) {
        if (!this.pool.has(type)) {
            this.pool.set(type, []);
        }
        this.pool.get(type).push(object);
    }

    // Clear the pool
    clear() {
        this.pool.clear();
    }
}
