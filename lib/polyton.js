'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PolytonFactory = exports.BasePolytonFactory = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _singletons = require('singletons');

var _argu = require('argu');

var _explanation = require('explanation');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
Singleton: S(x) = y && y=y' => x=x'
SingletonFactory: F(Y,X) = S
BasePolyton: B(x,x',x"...) = [S(x),S(x'),S(x")...] = [y,y',y"...] = b
BasePolytonFactory: G(Y,X) = B
Polyton: P(x1,x2,x2) = b && b=b' => x1=)x1', x2=x2', x3=x3'
PolytonFactory: H(Y,X) = P

A Polyton is a singleton array of like singletons
*/

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
      // A BasePolyton wraps Singletons, but is NOT a Singleton.
      // Only at the above level of a Polyton can its "Singletonness" be ensured
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
        value: function reduce(fn, initValue) {
          return this[_elements].reduce(fn, initValue);
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

var idFunc = function idFunc(args) {
  return args;
};

var formatBasePolytonSingletonOptions = function formatBasePolytonSingletonOptions(options, classSingletonOptions) {
  // Prevent from side effects by filtering the options passed to
  // the Singleton wrapping the BasePolyton
  // Valid options are 'unordered' and 'unique', nothing else.
  // 'set' is not used any more to prevent confusion with the eponymous type
  var validOptions = {};

  var isValidOption = function isValidOption(option) {
    switch (option) {
      case 'unordered':case 'unique':
        return option;

      default:
        (0, _explanation.warn)({
          message: 'Passing unsupported option',
          explain: [['The invalid option is', option], 'PolytonFactory filters its 3rd argument.', 'Only \'unordered\' and \'unique\' strings/keys are passed through.', 'Valid syntax:' + '\'unordered\' or [\'unordered\', \'unique\'] or {unique: true}.']
        });
    }
  };

  var getOption = function getOption(option) {
    if (typeof option === 'string') {
      var opt = isValidOption(option);

      if (opt !== undefined) {
        validOptions[opt] = true;
      }
    } else if ((typeof option === 'undefined' ? 'undefined' : _typeof(option)) === 'object') {
      Object.keys(option).forEach(function (key) {
        var opt = isValidOption(key);

        if (opt !== undefined && option[key] === true) {
          validOptions[opt] = true;
        }
      });
    }
  };

  if (Array.isArray(options)) {
    options.forEach(getOption);
  } else {
    getOption(options);
  }

  return [Object.assign({
    type: 'array',
    sub: classSingletonOptions,
    rest: true
  }, validOptions)];
};

var PolytonFactory = exports.PolytonFactory = function PolytonFactory(Class, classSingletonOptions, basePolytonSingletonOptions) {
  var basePolytonOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
    preprocess: idFunc,
    postprocess: idFunc
  };

  // A Polyton is a Singleton wrapping Singletons
  function makePolyton(Singleton) {
    var Polyton = function Polyton() {
      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      // Makes sure to pass [...args1], [...args2], [...args3], etc to Singleton
      return Singleton.apply(undefined, _toConsumableArray((0, _argu.toArrayOfArrays)(args)));
    };
    Polyton.get = Singleton.get;
    return Polyton;
  }

  // Allows to have unordered and/or unique [...args1], [...args2], etc
  var _basePolytonSingletonOptions = formatBasePolytonSingletonOptions(basePolytonSingletonOptions, classSingletonOptions);

  var preprocess = basePolytonOptions.preprocess,
      postprocess = basePolytonOptions.postprocess;

  // BasePolyton wraps Singletons but is NOT a Singleton

  var BasePolyton = BasePolytonFactory(Class, classSingletonOptions, basePolytonOptions);

  // Polyton intercepts all the args and ensure the "Singletonness" of
  // the wrapped BasePolyton
  var Polyton = makePolyton((0, _singletons.SingletonFactory)(BasePolyton, _basePolytonSingletonOptions, { preprocess: preprocess, postprocess: postprocess }));
  BasePolyton.Polyton = Polyton;
  Polyton.BasePolyton = BasePolyton;

  return Polyton;
};