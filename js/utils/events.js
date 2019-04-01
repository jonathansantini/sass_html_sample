var site = site || {};
site.utils = site.utils || {};

/**
 * Helper util method to create javascript events on the fly.
 * Needed because IE is IE and a polyfill is a little overkill.
 */
site.utils.events = {
  dispatch: function(name, args) {
    document.dispatchEvent(this.create(name, args));
  },
  create: function(name, args) {
    var event = {};
    var args = args || '';
    if (typeof(Event) === 'function') {
      event = new Event(name);
    } else {
      event = document.createEvent('Event');
      this.init(name, event);
    };
    if (args) {
      event.data = args;
    }
    return event;
  },
  init: function(name, event) {
    event.initEvent(name, true, true);
  }
};
