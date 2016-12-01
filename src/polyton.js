import {SingletonFactory} from 'singletons';
import {toArray, toArrayOfArrays} from './argu';

const _init = Symbol();
const _elements = Symbol();

export const BasePolytonFactory = function (Class, options) {
  function makeBasePolyton (Singleton) {
    return class BasePolyton {
      constructor(...args) {
        // Use a symbol so it won't be overridden
        this[_elements] = args.map(arg => new Singleton(...toArray(arg)));

        Object.defineProperties(this, {
          elements: {
            get () {
              return [...this[_elements]];
            },
          },

          length: {
            get() {
              return this[_elements].length;
            }
          }
        });
      }

      at(n) {
        return this[_elements][n];
      }

      get(...args) {
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
    }
  }

  return makeBasePolyton(SingletonFactory(Class, options));
};

export const PolytonFactory = function (Class, options) {
  function makePolyton(Singleton) {
    return function (...args) {
      return Singleton(toArrayOfArrays(...args));
    }
  }

  return makePolyton(SingletonFactory(
    BasePolytonFactory(Class, options), ['literal']));
};
