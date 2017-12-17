import {SingletonFactory} from 'singletons';
import {toArrayOfArrays} from 'argu';
import {BasePolytonFactory} from './base-polyton';

/*
Singleton: S(x) = y && y=y' => x=x'
SingletonFactory: F(Y,X) = S
BasePolyton: B(x,x',x"...) = [S(x),S(x'),S(x")...] = [y,y',y"...] = b
BasePolytonFactory: G(Y,X) = B
Polyton: P(x1,x2,x2) = b && b=b' => x1=x1', x2=x2', x3=x3'
PolytonFactory: H(Y,X) = P

A Polyton is a singleton array of like singletons
*/

const getBasePolytonOptions = ({properties, extend}) => {
  return {properties, extend};
};

const getPolytonHintsOrKeyfunc = ({unordered, unique}) => {
  return [Object.assign({
    type: 'array',
    sub: ['object'],
    rest: true,
  }, {unordered, unique})];
};

const getPolytonOptions = (ClassSingleton, {
  preprocess,
  postprocess,
  customArgs = [],
}) => {
  return {
    preprocess (args) {
      const _args = preprocess ? preprocess(args) : args;
      return _args.map(arg => [new ClassSingleton(...arg)]);
    },
    postprocess,
    customArgs,
  };
};

export const PolytonFactory = function (
  Class,
  classHintsOrKeyfunc,
  classOptions = {},
  polytonOptions = {}
) {
  const ClassSingleton = SingletonFactory(
    Class,
    classHintsOrKeyfunc,
    classOptions
  );

  const BasePolyton = BasePolytonFactory(
    ClassSingleton,
    getBasePolytonOptions(polytonOptions)
  );

  const PolytonSingleton = SingletonFactory(
    BasePolyton,
    getPolytonHintsOrKeyfunc(polytonOptions),
    getPolytonOptions(ClassSingleton, polytonOptions)
  );

  const Polyton = function (...args) {
    // Makes sure to pass [...args1], [...args2], [...args3], etc to Singleton
    return PolytonSingleton(...toArrayOfArrays(args));
  };

  Polyton.Singleton = ClassSingleton;
  Polyton.singletonGet = ClassSingleton.get;
  Polyton.singletonKey = ClassSingleton.key;
  Polyton.singletonSingleton = ClassSingleton.singleton;

  Polyton.get = (...args) => {
    return Polyton.singleton(Polyton.key(...args));
  };
  Polyton.key = (...args) => {
    return PolytonSingleton.key(...args.map(
      arg => [new ClassSingleton(...arg)]));
  };
  Polyton.singleton = PolytonSingleton.singleton;

  Polyton.BasePolyton = BasePolyton;
  BasePolyton.Polyton = Polyton;

  return Polyton;
};
