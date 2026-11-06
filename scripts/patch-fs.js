const fs = require('fs');
const path = require('path');

// Only apply on Windows where Node 24+ fs.promises.realpath hits EPERM
if (process.platform === 'win32') {
  const safeResolve = (p) => path.resolve(p);

  try {
    fs.promises.realpath = async (p) => safeResolve(p);
    const origRealpath = fs.realpath;
    fs.realpath = function (p, options, callback) {
      const cb = typeof options === 'function' ? options : callback;
      if (cb) {
        process.nextTick(() => cb(null, safeResolve(p)));
      } else {
        return safeResolve(p);
      }
    };
    fs.realpathSync = safeResolve;
    if (fs.realpathSync && fs.realpathSync.native) {
      fs.realpathSync.native = safeResolve;
    }
  } catch (_) {}
}

