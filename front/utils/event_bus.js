const EventBus = new (function () {
  const self = this;

  self.on = function (ev, cb) {
    if (typeof window === 'undefined') {
      return () => undefined;
    }

    window.addEventListener(ev, cb);

    return () => window.removeEventListener(ev, cb);
  };

  self.fire = function (ev) {
    if (typeof window === 'undefined') {
      return;
    }

    window.dispatchEvent(new Event(ev));
  };
})();

export { EventBus };
