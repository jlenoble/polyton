"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _elements = Symbol();

var BasePolytonFactory = exports.BasePolytonFactory = function BasePolytonFactory(Singleton, _ref) {
  var properties = _ref.properties,
      extend = _ref.extend;

  var BasePolyton = function () {
    function BasePolyton() {
      _classCallCheck(this, BasePolyton);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      this[_elements] = args.map(function (arg) {
        return Array.isArray(arg) ? new (Function.prototype.bind.apply(Singleton, [null].concat(_toConsumableArray(arg))))() : new Singleton(arg);
      });

      var _properties = Object.assign({
        elements: {
          get: function get() {
            return this[_elements].concat();
          }
        },

        length: {
          get: function get() {
            return this[_elements].length;
          }
        }
      }, properties);

      Object.defineProperties(this, _properties);
    }

    _createClass(BasePolyton, [{
      key: "get",
      value: function get() {
        return Singleton.get.apply(Singleton, arguments);
      }

      // Array-like methods

    }, {
      key: "concat",
      value: function concat() {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return new (Function.prototype.bind.apply(BasePolyton.Polyton, [null].concat(_toConsumableArray(this[_elements]), args)))();
      }
    }, {
      key: "forEach",
      value: function forEach(fn) {
        this[_elements].forEach(fn);
      }
    }, {
      key: "map",
      value: function map(fn) {
        return this[_elements].map(fn);
      }
    }, {
      key: "reduce",
      value: function reduce(fn, initValue) {
        return this[_elements].reduce(fn, initValue);
      }
    }, {
      key: "some",
      value: function some(fn) {
        return this[_elements].some(fn);
      }
    }, {
      key: "every",
      value: function every(fn) {
        return this[_elements].every(fn);
      }

      // Pairs convenience helpers, (a, b) !== (b, a)

    }, {
      key: "forEachPair",
      value: function forEachPair(fn) {
        var elements = this[_elements];

        for (var i = 0, l = this[_elements].length; i < l; i++) {
          for (var j = 0; j < l; j++) {
            if (i === j) {
              continue;
            }
            fn(elements[i], elements[j]);
          }
        }
      }
    }, {
      key: "mapPair",
      value: function mapPair(fn) {
        var elements = this[_elements];
        var map = [];

        for (var i = 0, l = this[_elements].length; i < l; i++) {
          for (var j = 0; j < l; j++) {
            if (i === j) {
              continue;
            }
            map.push(fn(elements[i], elements[j]));
          }
        }

        return map;
      }

      // Pairs convenience helpers, {a, b} === {b, a}

    }, {
      key: "forEachTriangular",
      value: function forEachTriangular(fn) {
        var elements = this[_elements];

        for (var i = 0, l = this[_elements].length; i < l; i++) {
          for (var j = i + 1; j < l; j++) {
            fn(elements[i], elements[j]);
          }
        }
      }
    }, {
      key: "mapTriangular",
      value: function mapTriangular(fn) {
        var elements = this[_elements];
        var map = [];

        for (var i = 0, l = this[_elements].length; i < l; i++) {
          for (var j = i + 1; j < l; j++) {
            map.push(fn(elements[i], elements[j]));
          }
        }

        return map;
      }
    }]);

    return BasePolyton;
  }();

  Object.assign(BasePolyton.prototype, extend);

  BasePolyton.Singleton = Singleton;

  return BasePolyton;
};