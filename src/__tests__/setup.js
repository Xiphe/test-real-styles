if (typeof global.setImmediate === 'undefined') {
  global.setImmediate = (cb) => {
    cb();
  };
}
