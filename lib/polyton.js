'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PolytonFactory = undefined;

var _parallelSingletons = require('parallel-singletons');

var PolytonFactory = exports.PolytonFactory = function PolytonFactory(Type) {
  var defaultKeyfunc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (obj) {
    return obj.toString();
  };

  var Multi = (0, _parallelSingletons.ParallelSingletonFactory)(Type, defaultKeyfunc);
  var Single = Multi.getBaseSingleton();

  return function (Single, Multi) {
    return function (arg0) {
      if (Array.isArray(arg0)) {
        return Multi(arg0);
      } else {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return Single.apply(undefined, [arg0].concat(args));
      }
    };
  }(Single, Multi);
};