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

  const {customArgs, extend, properties} = basePolytonOptions;

  return makeBasePolyton(SingletonFactory(Class, options, {customArgs}),
    {extend, properties});
};
