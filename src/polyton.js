import {SingletonFactory} from 'singletons';
import {toArrayOfArrays} from 'argu';

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

export const PolytonFactory = function (
  Class,
  classSingletonOptions,
  basePolytonSingletonOptions,
  basePolytonOptions = {
    preprocess: idFunc,
    postprocess: idFunc,
  }
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

  const {preprocess, postprocess} = basePolytonOptions;

  const BasePolyton = BasePolytonFactory(Class, classSingletonOptions,
    basePolytonOptions);
  const Polyton = makePolyton(SingletonFactory(BasePolyton,
    _basePolytonSingletonOptions, {preprocess, postprocess}));
  BasePolyton.Polyton = Polyton;

  return Polyton;
};
