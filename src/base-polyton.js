import {toArrayOfArrays} from 'argu';

const _keys = Symbol();
const _elements = Symbol();

export const BasePolytonFactory = function (
  Singleton,
  {
    properties,
    extend,
  }
) {
  const initArgs = args => {
    let array = [];
    args.forEach(arg => {
      if (arg instanceof BasePolyton) {
        array = array.concat(arg.initArgs);
      } else {
        array.push(arg);
      }
    });
    return toArrayOfArrays(array);
  };

  class BasePolyton {
    constructor (...args) {
      const _initArgs = initArgs(args);

      this[_keys] = _initArgs.map(_args => {
        const singleton = new Singleton(..._args);
        return singleton.getKey();
      });

      this[_elements] = this[_keys].map(key => Singleton.singleton(key));

      const _properties = Object.assign({
        initArgs: {
          value: _initArgs,
        },

        elements: {
          get () {
            return this[_elements].concat();
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
  }

  Object.assign(BasePolyton.prototype, extend);

  BasePolyton.Singleton = Singleton;

  return BasePolyton;
};
