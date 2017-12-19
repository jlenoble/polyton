const _elements = Symbol();

export const BasePolytonFactory = function (
  Singleton,
  {
    properties,
    extend,
  }
) {
  class BasePolyton {
    constructor (...args) {
      this[_elements] = args.map(arg => Array.isArray(arg) ?
        new Singleton(...arg) : new Singleton(arg));

      const _properties = Object.assign({
        elements: {
          get () {
            return this[_elements].concat();
          },
        },

        length: {
          get () {
            return this[_elements].length;
          },
        },
      }, properties);

      Object.defineProperties(this, _properties);
    }

    get (...args) {
      return Singleton.get(...args);
    }

    // Array-like methods
    concat (...args) {
      return new BasePolyton.Polyton(...this[_elements], ...args);
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

    some (fn) {
      return this[_elements].some(fn);
    }

    every (fn) {
      return this[_elements].every(fn);
    }

    // Pairs convenience helpers, (a, b) !== (b, a)
    forEachPair (fn) {
      const elements = this[_elements];

      for (let i = 0, l = this[_elements].length; i < l; i++) {
        for (let j = 0; j < l; j++) {
          if (i === j) {
            continue;
          }
          fn(elements[i], elements[j]);
        }
      }
    }

    mapPair (fn) {
      const elements = this[_elements];
      const map = [];

      for (let i = 0, l = this[_elements].length; i < l; i++) {
        for (let j = 0; j < l; j++) {
          if (i === j) {
            continue;
          }
          map.push(fn(elements[i], elements[j]));
        }
      }

      return map;
    }

    // Pairs convenience helpers, {a, b} === {b, a}
    forEachTriangular (fn) {
      const elements = this[_elements];

      for (let i = 0, l = this[_elements].length; i < l; i++) {
        for (let j = i + 1; j < l; j++) {
          fn(elements[i], elements[j]);
        }
      }
    }

    mapTriangular (fn) {
      const elements = this[_elements];
      const map = [];

      for (let i = 0, l = this[_elements].length; i < l; i++) {
        for (let j = i + 1; j < l; j++) {
          map.push(fn(elements[i], elements[j]));
        }
      }

      return map;
    }
  }

  Object.assign(BasePolyton.prototype, extend);

  BasePolyton.Singleton = Singleton;

  return BasePolyton;
};
