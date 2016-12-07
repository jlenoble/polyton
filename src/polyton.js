import {SingletonFactory} from 'singletons';
import {toArray, toArrayOfArrays} from 'argu';

const _elements = Symbol();

export const BasePolytonFactory = function (Class, options = ['object']) {
  function makeBasePolyton (Singleton) {
    return class BasePolyton {
      constructor (...args) {
        // Use a symbol so it won't be overridden
        this[_elements] = args.map(arg => new Singleton(...toArray(arg)));

        Object.defineProperties(this, {
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

      forEach(fn) {
        this[_elements].forEach(fn);
      }

      map(fn) {
        return this[_elements].map(fn);
      }

      reduce(fn) {
        return this[_elements].reduce(fn);
      }

    };
  }

  return makeBasePolyton(SingletonFactory(Class, options));
};

export const PolytonFactory = function (
  Class,
  classSingletonOptions,
  basePolytonSingletonOptions = [{}]
) {
  function makePolyton (Singleton) {
    const Polyton = function (...args) {
      return Singleton(...toArrayOfArrays(args));
    };
    Polyton.get = Singleton.get;
    return Polyton;
  }

  const _basePolytonSingletonOptions = basePolytonSingletonOptions.map(opt => {
    return Object.assign({
      type: 'array',
      sub: classSingletonOptions,
      rest: true,
    }, opt);
  });

  return makePolyton(SingletonFactory(
    BasePolytonFactory(Class, classSingletonOptions),
      _basePolytonSingletonOptions));
};
