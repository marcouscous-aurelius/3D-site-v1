export class EventManager {
    constructor() {
        this.listeners = new Map();
        this.debouncedEvents = new Map();
    }

    // Add event listener with optional debouncing
    addEventListener(element, eventType, callback, options = {}) {
        const { debounce = 0, passive = false } = options;

        if (debounce > 0) {
            const debouncedCallback = this.debounce(callback, debounce);
            this.addListener(element, eventType, debouncedCallback, passive);
            this.debouncedEvents.set(callback, debouncedCallback);
        } else {
            this.addListener(element, eventType, callback, passive);
        }
    }

    // Remove event listener
    removeEventListener(element, eventType, callback) {
        const debouncedCallback = this.debouncedEvents.get(callback);
        const actualCallback = debouncedCallback || callback;

        if (this.listeners.has(element)) {
            const elementListeners = this.listeners.get(element);
            if (elementListeners.has(eventType)) {
                const callbacks = elementListeners.get(eventType);
                const index = callbacks.findIndex(cb => cb.callback === actualCallback);
                if (index !== -1) {
                    element.removeEventListener(eventType, callbacks[index].wrapper);
                    callbacks.splice(index, 1);
                }
            }
        }

        if (debouncedCallback) {
            this.debouncedEvents.delete(callback);
        }
    }

    // Clear all event listeners
    clearAllListeners() {
        for (const [element, elementListeners] of this.listeners) {
            for (const [eventType, callbacks] of elementListeners) {
                callbacks.forEach(cb => {
                    element.removeEventListener(eventType, cb.wrapper);
                });
            }
        }
        this.listeners.clear();
        this.debouncedEvents.clear();
    }

    // Private helper to add listener
    addListener(element, eventType, callback, passive) {
        if (!this.listeners.has(element)) {
            this.listeners.set(element, new Map());
        }

        const elementListeners = this.listeners.get(element);
        if (!elementListeners.has(eventType)) {
            elementListeners.set(eventType, []);
        }

        const wrapper = (event) => callback(event);
        elementListeners.get(eventType).push({
            callback,
            wrapper
        });

        element.addEventListener(eventType, wrapper, { passive });
    }

    // Debounce helper function
    debounce(callback, delay) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => callback(...args), delay);
        };
    }
}
