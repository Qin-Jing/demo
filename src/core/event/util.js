const eventMap = {};
export default {
  on(event, func) {
    const eventList = eventMap[event] || [];
    eventList.push(func);
    eventMap[event] = eventList;
  },
  off(event, func) {
    const eventList = eventMap[event];
    if (eventList) {
      const idx = eventList.indexOf(func);
      if (idx !== -1) {
        eventList.splice(idx, 1);
      }
    }
  },
  emit(event, options) {
    const eventList = eventMap[event] || [];
    eventList.forEach((func) => {
      func && func(options);
    });
  }
};
