'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PolytonFactory = undefined;

var _singletons = require('singletons');

var _basePolyton = require('./base-polyton');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/*
Singleton: S(x) = y && y=y' => x=x'
SingletonFactory: F(Y,X) = S
BasePolyton: B(x,x',x"...) = [S(x),S(x'),S(x")...] = [y,y',y"...] = b
BasePolytonFactory: G(Y,X) = B
Polyton: P(x1,x2,x2) = b && b=b' => x1=x1', x2=x2', x3=x3'
PolytonFactory: H(Y,X) = P

A Polyton is a singleton array of like singletons
*/

var getBasePolytonOptions = function getBasePolytonOptions(_ref) {
  var properties = _ref.properties,
      extend = _ref.extend;

  return { properties: properties, extend: extend };
};

var getPolytonHintsOrKeyfunc = function getPolytonHintsOrKeyfunc(_ref2) {
  var unordered = _ref2.unordered,
      unique = _ref2.unique;

  return [Object.assign({
    type: 'object',
    rest: true
  }, { unordered: unordered, unique: unique })];
};

var getPolytonOptions = function getPolytonOptions(ClassSingleton, _ref3) {
  var _preprocess = _ref3.preprocess,
      postprocess = _ref3.postprocess,
      spread = _ref3.spread,
      shallowSpread = _ref3.shallowSpread,
      _ref3$customArgs = _ref3.customArgs,
      customArgs = _ref3$customArgs === undefined ? [] : _ref3$customArgs;

  return {
    preprocess: function preprocess(args) {
      var _args = _preprocess ? _preprocess(args) : args;
      return _args.map(function (arg) {
        return Array.isArray(arg) ? new (Function.prototype.bind.apply(ClassSingleton, [null].concat(_toConsumableArray(arg))))() : new ClassSingleton(arg);
      });
    },

    postprocess: postprocess,
    spread: spread,
    shallowSpread: shallowSpread,
    customArgs: customArgs
  };
};

var PolytonFactory = exports.PolytonFactory = function PolytonFactory(Class, classHintsOrKeyfunc) {
  var classOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var polytonOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var ClassSingleton = (0, _singletons.SingletonFactory)(Class, classHintsOrKeyfunc, classOptions);

  var BasePolyton = (0, _basePolyton.BasePolytonFactory)(ClassSingleton, getBasePolytonOptions(polytonOptions));

  var Polyton = (0, _singletons.SingletonFactory)(BasePolyton, getPolytonHintsOrKeyfunc(polytonOptions), getPolytonOptions(ClassSingleton, polytonOptions));

  Polyton.Singleton = ClassSingleton;
  Polyton.singletonGet = ClassSingleton.get;
  Polyton.singletonKey = ClassSingleton.key;
  Polyton.singletonSingleton = ClassSingleton.singleton;

  var origKey = Polyton.key;
  Polyton.key = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return origKey.apply(undefined, _toConsumableArray(args.map(function (arg) {
      return Array.isArray(arg) ? new (Function.prototype.bind.apply(ClassSingleton, [null].concat(_toConsumableArray(arg))))() : new ClassSingleton(arg);
    })));
  };

  Polyton.BasePolyton = BasePolyton;
  BasePolyton.Polyton = Polyton;

  return Polyton;
};