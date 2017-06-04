## PolytonFactory API !heading

* `PolytonFactory(Class, classSingletonOptions, basePolytonSingletonOptions, basePolytonOptions)`: Returns a `Polyton` constructor that will generate singletons of class `Class`. `classSingletonOptions` indicates how to process the initializing arguments for each singletons. See package [keyfunc](https://www.npmjs.com/package/keyfunc) for a detailed discussion on how to present this argument.
* `basePolytonSingletonOptions` is optional and is used when the polytons themselves must be indexed in a special way. By default, polytons are just referenced by an array of all the arguments that were used to create the singletons it contains. With this argument, you can make the order of the arguments unimportant (option 'unordered') or collapse them if they appear more than once (option 'unique'), or both (option ['unordered', 'unique']).
* Last argument `basePolytonOptions` is also optional and is used to extend the `BasePolyton` prototype: it is an object with property 'extend' containing all new (or to be overridden) method declarations. It can also have property 'preprocess'. In such a case, the arguments passed to the Polyton are preprocessed before being passed to individual underlying Singletons. This helps a lot keeping a clean indexing. To add properties to instances, use option 'properties'.

##  Instance Polyton API !heading

* `Polyton(...args)`: Creates a Polyton from a list of arrays of arguments. Each array contains the arguments to create an invidual underlying singleton.
* `prototype.length`: Returns the number of singletons within the polyton.
* `prototype.elements`: Returns a copy of the array of singletons within the polyton.
* `prototype.at(n)`: Returns nth singleton within the polyton.
* `prototype.get(...args)`: `args` are the arguments from which some singleton was initialized; this method returns the corresponding singleton.
* `prototype.forEach(func)`: Loops over all singletons within the polyton.
* `prototype.map(func)`: Returns an array mapping all singletons within the polyton with the function `func`.
* `prototype.reduce(func)`: Returns the reduced value obtained from reducing the array of singletons within the polyton with function func.
* `prototype.concat(...args)`: Returns the concatenated Polyton from args. Args as already existing Polytons is allowed.

## Static Polyton API !heading

`get(...args)`: Given the arguments that were used to create it, returns the corresponding Polyton (not to be confused with `prototype.get` method that returns individual Singletons).
