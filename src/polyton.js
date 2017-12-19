import {SingletonFactory} from 'singletons';
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
    type: 'object',
    rest: true,
  }, {unordered, unique})];
};

const getPolytonOptions = (ClassSingleton, {
  preprocess,
  postprocess,
  spread,
  shallowSpread,
  customArgs = [],
}) => {
  return {
    preprocess (args) {
      const _args = preprocess ? preprocess(args) : args;
      return _args.map(arg => Array.isArray(arg) ? new ClassSingleton(...arg) :
        new ClassSingleton(arg));
    },
    postprocess,
    spread,
    shallowSpread,
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

  const Polyton = SingletonFactory(
    BasePolyton,
    getPolytonHintsOrKeyfunc(polytonOptions),
    getPolytonOptions(ClassSingleton, polytonOptions)
  );

  Polyton.Singleton = ClassSingleton;

  Polyton.safeGet = Polyton.get;
  Polyton.get = Polyton.looseGet;

  Polyton.BasePolyton = BasePolyton;
  BasePolyton.Polyton = Polyton;

  return Polyton;
};
