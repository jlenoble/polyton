'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PolytonFactory = exports.BasePolytonFactory = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _singletons = require('singletons');

var _argu = require('argu');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _elements = Symbol();

var BasePolytonFactory = exports.BasePolytonFactory = function BasePolytonFactory(Class) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ['object'];
  var basePolytonOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  function makeBasePolyton(Singleton, basePolytonOptions) {
    function initArgs(args) {
      var array = [];
      args.forEach(function (arg) {
        if (arg instanceof BasePolyton) {
          array = array.concat(arg.initArgs);
        } else {
          array.push(arg);
        }
      });
      return (0, _argu.toArrayOfArrays)(array);
    }

    var addProperties = function (properties) {
      return function () {
        return properties;
      };
    }(basePolytonOptions.properties);

    var BasePolyton = function () {
      function BasePolyton() {
        _classCallCheck(this, BasePolyton);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var _initArgs = initArgs(args);

        this[_elements] = _initArgs.map(function (arg) {
          return new (Function.prototype.bind.apply(Singleton, [null].concat(_toConsumableArray(arg))))();
        });

        var properties = Object.assign({
          initArgs: {
            get: function get() {
              return _initArgs;
            }
          },

          elements: {
            get: function get() {
              return [].concat(_toConsumableArray(this[_elements]));
            }
          },

          length: {
            get: function get() {
              return this[_elements].length;
            }
          }
        }, addProperties());

        Object.defineProperties(this, properties);
      }

      _createClass(BasePolyton, [{
        key: 'at',
        value: function at(n) {
          return this[_elements][n];
        }
      }, {
        key: 'get',
        value: function get() {
          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          var foundElt = void 0;
          this[_elements].some(function (elt) {
            if (elt === Singleton.get.apply(Singleton, args)) {
              foundElt = elt;
              return true;
            }
            return false;
          });
          return foundElt;
        }
      }, {
        key: 'concat',
        value: function concat() {
          for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
          }

          return new (Function.prototype.bind.apply(BasePolyton.Polyton, [null].concat(_toConsumableArray(this.initArgs.concat(initArgs(args))))))();
        }
      }, {
        key: 'forEach',
        value: function forEach(fn) {
          this[_elements].forEach(fn);
        }
      }, {
        key: 'map',
        value: function map(fn) {
          return this[_elements].map(fn);
        }
      }, {
        key: 'reduce',
        value: function reduce(fn) {
          return this[_elements].reduce(fn);
        }
      }]);

      return BasePolyton;
    }();

    ;

    if (basePolytonOptions) {
      if (basePolytonOptions.extend) {
        Object.assign(BasePolyton.prototype, basePolytonOptions.extend);
      }
    }

    return BasePolyton;
  }

  return makeBasePolyton((0, _singletons.SingletonFactory)(Class, options), basePolytonOptions);
};

var PolytonFactory = exports.PolytonFactory = function PolytonFactory(Class, classSingletonOptions, basePolytonSingletonOptions, basePolytonOptions) {
  function makePolyton(Singleton) {
    var Polyton = function Polyton() {
      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      return Singleton.apply(undefined, _toConsumableArray((0, _argu.toArrayOfArrays)(args)));
    };
    Polyton.get = Singleton.get;
    return Polyton;
  }

  var _basePolytonSingletonOptions = (basePolytonSingletonOptions ? basePolytonSingletonOptions : [{}]).map(function (opt) {
    return Object.assign({
      type: 'array',
      sub: classSingletonOptions,
      rest: true
    }, opt);
  });

  var preprocess = basePolytonOptions && basePolytonOptions.preprocess;
  if (!preprocess) {
    preprocess = function preprocess(args) {
      return args;
    };
  }

  var BasePolyton = BasePolytonFactory(Class, classSingletonOptions, basePolytonOptions);
  var Polyton = makePolyton((0, _singletons.SingletonFactory)(BasePolyton, _basePolytonSingletonOptions, { preprocess: preprocess }));
  BasePolyton.Polyton = Polyton;

  return Polyton;
};