export class EventBus {
    static listeners = {};

    static addListener(event, object, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push({ object, callback });
    }

    static removeListener(event, object, callback) {
        if (!this.listeners[event]) return;
        const index = this.listeners[event].findIndex(listener => listener.object === object && listener.callback === callback);
        if (index !== -1) this.listeners[event].splice(index, 1);
    }

    static invoke(event, ...args) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(listener => {
            listener.callback.apply(listener.object, args);
        });
    }
}