if (typeof global.setImmediate === 'undefined') {
  global.setImmediate = setTimeout;
}
