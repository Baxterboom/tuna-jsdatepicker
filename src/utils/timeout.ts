module JSDatepicker {
  export function timeout(action: () => any, delay?: number) {
    return new Timeout(action, delay);
  }

  class Timeout {
    private id = 0;
    private static current = {}

    constructor(public action: () => any, delay?: number) {
      this.cancel();

      // @ts-ignore
      Timeout.current[this.action] = this;

      this.id = setTimeout(() => {
        this.action();
        this.cancel();
      }, delay);
    }

    cancel() {
      // @ts-ignore
      const existing = Timeout.current[this.action];
      if (existing) {
        clearTimeout(existing.id);
        // @ts-ignore
        delete Timeout.current[this.action];
      }
    }
  }
}