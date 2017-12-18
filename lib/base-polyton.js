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
        return new (Function.prototype.bind.apply(Singleton, [null].concat(_toConsumableArray(arg))))();
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
    }]);

    return BasePolyton;
  }();

  Object.assign(BasePolyton.prototype, extend);

  BasePolyton.Singleton = Singleton;

  return BasePolyton;
};