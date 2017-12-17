const _keys = Symbol();

export const BasePolytonFactory = function (
  Singleton,
  {
    properties,
    extend,
  }
) {
  class BasePolyton {
    constructor (...args) {
      this[_keys] = args.map(_args => {
        const singleton = new Singleton(..._args);
        return singleton.getKey();
      });

      const _properties = Object.assign({
        elements: {
          get () {
            return this[_keys].map(key => Singleton.singleton(key));
          },
        },

        length: {
          get () {
            return this[_keys].length;
          },
        },
      }, properties);

      Object.defineProperties(this, _properties);
    }

    get (...args) {
      return Singleton.get(...args);
    }
  }

  BasePolyton.Singleton = Singleton;

  return BasePolyton;
};
