import {SingletonFactory} from 'singletons';
import {toArrayOfArrays} from 'argu';
import {warn} from 'explanation';

/*
Singleton: S(x) = y && y=y' => x=x'
SingletonFactory: F(Y,X) = S
BasePolyton: B(x,x',x"...) = [S(x),S(x'),S(x")...] = [y,y',y"...] = b
BasePolytonFactory: G(Y,X) = B
Polyton: P(x1,x2,x2) = b && b=b' => x1=)x1', x2=x2', x3=x3'
PolytonFactory: H(Y,X) = P

A Polyton is a singleton array of like singletons
*/

const _elements = Symbol();

export const BasePolytonFactory = function (Class, options = ['object'],
  basePolytonOptions = {}) {
  function makeBasePolyton (Singleton, basePolytonOptions) {
    function initArgs (args) {
      let array = [];
      args.forEach(arg => {
        if (arg instanceof BasePolyton) {
          array = array.concat(arg.initArgs);
        } else {
          array.push(arg);
        }
      });
      return toArrayOfArrays(array);
    }

    const addProperties = ((properties => {
      return () => properties;
    })(basePolytonOptions.properties));

    class BasePolyton {
      // A BasePolyton wraps Singletons, but is NOT a Singleton.
      // Only at the above level of a Polyton can its "Singletonness" be ensured
      constructor (...args) {
        const _initArgs = initArgs(args);

        this[_elements] = _initArgs.map(arg => new Singleton(...arg));

        const properties = Object.assign({
          initArgs: {
            get () {
              return _initArgs;
            },
          },

          elements: {
            get () {
              return [...this[_elements]];
            },
          },

          length: {
            get () {
              return this[_elements].length;
            },
          },
        }, addProperties());

        Object.defineProperties(this, properties);
      }

      at (n) {
        return this[_elements][n];
      }

      get (...args) {
        let foundElt;
        this[_elements].some(elt => {
          if (elt === Singleton.get(...args)) {
            foundElt = elt;
            return true;
          }
          return false;
        });
        return foundElt;
      }

      concat (...args) {
        return new BasePolyton.Polyton(...this.initArgs.concat(initArgs(args)));
      }

      forEach (fn) {
        this[_elements].forEach(fn);
      }

      map (fn) {
        return this[_elements].map(fn);
      }

      reduce (fn, initValue) {
        return this[_elements].reduce(fn, initValue);
      }

    };

    if (basePolytonOptions) {
      if (basePolytonOptions.extend) {
        Object.assign(BasePolyton.prototype, basePolytonOptions.extend);
      }
    }

    return BasePolyton;
  }

  return makeBasePolyton(SingletonFactory(Class, options), basePolytonOptions);
};

const idFunc = args => args;

const formatBasePolytonSingletonOptions = (options, classSingletonOptions) => {
  // Prevent from side effects by filtering the options passed to
  // the Singleton wrapping the BasePolyton
  // Valid options are 'unordered' and 'unique', nothing else.
  // 'set' is not used any more to prevent confusion with the eponymous type
  const validOptions = {};

  const isValidOption = option => {
    switch (option) {
    case 'unordered': case 'unique':
      return option;

    default:
      warn({
        message: 'Passing unsupported option',
        explain: [
          ['The invalid option is', option],
          'PolytonFactory filters its 3rd argument.',
          `Only 'unordered' and 'unique' strings/keys are passed through.`,
          'Valid syntax:' +
            `'unordered' or ['unordered', 'unique'] or {unique: true}.`,
        ],
      });
    }
  };

  const getOption = option => {
    if (typeof option === 'string') {
      const opt = isValidOption(option);

      if (opt !== undefined) {
        validOptions[opt] = true;
      }
    } else if (typeof option === 'object') {
      Object.keys(option).forEach(key => {
        const opt = isValidOption(key);

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
    rest: true,
  }, validOptions)];
};

export const PolytonFactory = function (
  Class,
  classSingletonOptions,
  basePolytonSingletonOptions,
  basePolytonOptions = {
    preprocess: idFunc,
    postprocess: idFunc,
  }
) {
  // A Polyton is a Singleton wrapping Singletons
  function makePolyton (Singleton) {
    const Polyton = function (...args) {
      // Makes sure to pass [...args1], [...args2], [...args3], etc to Singleton
      return Singleton(...toArrayOfArrays(args));
    };
    Polyton.get = Singleton.get;
    return Polyton;
  }

  // Allows to have unordered and/or unique [...args1], [...args2], etc
  const _basePolytonSingletonOptions = formatBasePolytonSingletonOptions(
    basePolytonSingletonOptions, classSingletonOptions);

  const {preprocess, postprocess} = basePolytonOptions;

  // BasePolyton wraps Singletons but is NOT a Singleton
  const BasePolyton = BasePolytonFactory(Class, classSingletonOptions,
    basePolytonOptions);

  // Polyton intercepts all the args and ensure the "Singletonness" of
  // the wrapped BasePolyton
  const Polyton = makePolyton(SingletonFactory(BasePolyton,
    _basePolytonSingletonOptions, {preprocess, postprocess}));
  BasePolyton.Polyton = Polyton;
  Polyton.BasePolyton = BasePolyton;

  return Polyton;
};
