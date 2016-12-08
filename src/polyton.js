import {SingletonFactory} from 'singletons';
import {toArrayOfArrays} from 'argu';

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

    class BasePolyton {
      constructor (...args) {
        const _initArgs = initArgs(args);

        this[_elements] = _initArgs.map(arg => new Singleton(...arg));

        Object.defineProperties(this, {
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
        });
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

      reduce (fn) {
        return this[_elements].reduce(fn);
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

export const PolytonFactory = function (
  Class,
  classSingletonOptions,
  basePolytonSingletonOptions,
  basePolytonOptions
) {
  function makePolyton (Singleton) {
    const Polyton = function (...args) {
      return Singleton(...toArrayOfArrays(args));
    };
    Polyton.get = Singleton.get;
    return Polyton;
  }

  const _basePolytonSingletonOptions = (basePolytonSingletonOptions ?
    basePolytonSingletonOptions : [{}]).map(opt => {
      return Object.assign({
        type: 'array',
        sub: classSingletonOptions,
        rest: true,
      }, opt);
    });

  const BasePolyton = BasePolytonFactory(Class, classSingletonOptions,
    basePolytonOptions);
  const Polyton = makePolyton(SingletonFactory(BasePolyton,
    _basePolytonSingletonOptions));
  BasePolyton.Polyton = Polyton;

  return Polyton;
};
