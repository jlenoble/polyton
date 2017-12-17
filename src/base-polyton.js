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
      this[_elements] = args.map(arg => new Singleton(...arg));

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
  }

  Object.assign(BasePolyton.prototype, extend);

  BasePolyton.Singleton = Singleton;

  return BasePolyton;
};
