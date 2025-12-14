export default class EventBus {
  private listeners: { [event: string]: Array<(...args: unknown[]) => void> } = {};

  on(event: string, callback: (...args: unknown[]) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: (...args: unknown[]) => void): void {
    if (!this.listeners[event]) {
      throw new Error(`Нет события: ${event}`);
    }
    this.listeners[event] = this.listeners[event].filter(
      (listener) => listener !== callback
    );
  }

  emit(event: string, ...args: unknown[]): void {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event].forEach((listener) => {
      try {
        listener(...args);
      } catch (err) {
        console.error(`Ошибка в обработчике ${event}:`, err);
      }
    });
  }
}
