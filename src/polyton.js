import {SingletonFactory} from 'singletons';
import {toArrayOfArrays} from 'argu';
import {BasePolytonFactory} from './base-polyton';
import {reduceOptions} from './helpers';

/*
Singleton: S(x) = y && y=y' => x=x'
SingletonFactory: F(Y,X) = S
BasePolyton: B(x,x',x"...) = [S(x),S(x'),S(x")...] = [y,y',y"...] = b
BasePolytonFactory: G(Y,X) = B
Polyton: P(x1,x2,x2) = b && b=b' => x1=x1', x2=x2', x3=x3'
PolytonFactory: H(Y,X) = P

A Polyton is a singleton array of like singletons
*/

const idFunc = args => args;

const formatBasePolytonSingletonOptions = (options, classSingletonOptions) => {
  // Prevent from side effects by filtering the options passed to
  // the Singleton wrapping the BasePolyton
  // Valid options are 'unordered' and 'unique', nothing else.
  // 'set' is not used any more to prevent confusion with the eponymous type
  const validOptions = (Array.isArray(options) ? options : [options])
    .reduce(reduceOptions, {});

  return [Object.assign({
    type: 'array',
    sub: classSingletonOptions,
    rest: true,
  }, validOptions)];
};

export const PolytonFactory = function (
  Class,
  classSingletonOptions,
  basePolytonSingletonOptions,
  basePolytonOptions = {
    preprocess: idFunc,
    postprocess: idFunc,
  }
) {
  // A Polyton is a Singleton wrapping Singletons
  function makePolyton (Singleton) {
    const Polyton = function (...args) {
      // Makes sure to pass [...args1], [...args2], [...args3], etc to Singleton
      return Singleton(...toArrayOfArrays(args));
    };
    Polyton.get = Singleton.get;
    return Polyton;
  }

  // Allows to have unordered and/or unique [...args1], [...args2], etc
  const _basePolytonSingletonOptions = formatBasePolytonSingletonOptions(
    basePolytonSingletonOptions, classSingletonOptions);

  const {preprocess, postprocess} = basePolytonOptions;

  // BasePolyton wraps Singletons but is NOT a Singleton
  const BasePolyton = BasePolytonFactory(Class, classSingletonOptions,
    basePolytonOptions);

  // Polyton intercepts all the args and ensure the "Singletonness" of
  // the wrapped BasePolyton
  const Polyton = makePolyton(SingletonFactory(BasePolyton,
    _basePolytonSingletonOptions, {preprocess, postprocess}));
  BasePolyton.Polyton = Polyton;
  Polyton.BasePolyton = BasePolyton;

  return Polyton;
};
