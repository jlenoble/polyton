import {ParallelSingletonFactory} from 'parallel-singletons';

export const PolytonFactory = function (Type,
  defaultKeyfunc = obj => obj.toString()) {
  const Multi = ParallelSingletonFactory(Type, defaultKeyfunc);
  const Single = Multi.getBaseSingleton();

  return (function (Single, Multi) {
    return function (arg0, ...args) {
      if (Array.isArray(arg0)) {
        return Multi(arg0);
      } else {
        return Single(arg0, ...args);
      }
    };
  }(Single, Multi));
};
