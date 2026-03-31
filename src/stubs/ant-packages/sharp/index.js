const sharp = function (input) {
  const instance = {
    resize(...args) { return instance; },
    toBuffer() { return Promise.resolve(Buffer.alloc(0)); },
    metadata() { return Promise.resolve({}); },
  };
  return instance;
};

export default sharp;
