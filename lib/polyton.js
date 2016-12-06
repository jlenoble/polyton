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

  function makeBasePolyton(Singleton) {
    return function () {
      function BasePolyton() {
        _classCallCheck(this, BasePolyton);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        // Use a symbol so it won't be overridden
        this[_elements] = args.map(function (arg) {
          return new (Function.prototype.bind.apply(Singleton, [null].concat(_toConsumableArray((0, _argu.toArray)(arg)))))();
        });

        Object.defineProperties(this, {
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
        });
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
      }]);

      return BasePolyton;
    }();
  }

  return makeBasePolyton((0, _singletons.SingletonFactory)(Class, options));
};

var PolytonFactory = exports.PolytonFactory = function PolytonFactory(Class, classSingletonOptions) {
  var basePolytonSingletonOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [{}];

  function makePolyton(Singleton) {
    var Polyton = function Polyton() {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return Singleton.apply(undefined, _toConsumableArray((0, _argu.toArrayOfArrays)(args)));
    };
    Polyton.get = Singleton.get;
    return Polyton;
  }

  var _basePolytonSingletonOptions = basePolytonSingletonOptions.map(function (opt) {
    return Object.assign({
      type: 'array',
      sub: classSingletonOptions,
      rest: true
    }, opt);
  });

  return makePolyton((0, _singletons.SingletonFactory)(BasePolytonFactory(Class, classSingletonOptions), _basePolytonSingletonOptions));
};