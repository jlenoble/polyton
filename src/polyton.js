import {SingletonFactory} from 'singletons';
import {toArrayOfArrays} from './argu';

const _init = Symbol();
const _elements = Symbol();

const BasePolytonFactory = function (Class, options) {
  function makeBasePolyton (Singleton) {
    let BasePolyton = function (args) {
      this[_init](args);
    };

    BasePolyton.prototype[_init] = function (args) {
      // Use a symbol so it won't be overridden
      this[_elements] = args.map(arg => new Singleton(...arg));

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
    };

    BasePolyton.prototype.at = function (n) {
      return this[_elements][n];
    }

    BasePolyton.prototype.get = function (...args) {
      let foundElt;
      this[_elements].some(elt => {
        if (elt === Singleton.get(...args)) {
          foundElt = elt;
          return true;
        }
        return false;
      });
      return foundElt;
    };

    return BasePolyton;
  }

  return makeBasePolyton(SingletonFactory(Class, options));
};

export const PolytonFactory = function (Class, options) {
  return (function (Singleton) {
    return function (...args) {
      return Singleton(toArrayOfArrays(...args));
    }
  }(SingletonFactory(BasePolytonFactory(Class, options), ['literal'])));
};
