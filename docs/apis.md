## PolytonFactory API !heading

* `PolytonFactory(Class, classHintsOrKeyfunc, classOptions, polytonOptions)`: Returns a `Polyton` constructor that will generate singletons of class `Class`.
* `classHintsOrKeyfunc` indicates how to process the initializing arguments for each singletons. See package [keyfunc](https://www.npmjs.com/package/keyfunc) for a detailed discussion on how to present this argument.
* `classOptions` is optional. It is a literal object with the possible following properties:

```js
{
  preprocess (convertedArgs) { // Array of Arrays

    // convertedArgs result from a first preprocessing on a per type basis;
    // See customArgs for option customArgs:convert

    // Do whatever you want on it so that in the end its subarrays contain only
    // arguments of the correct type and order to initialize a Class object.

    // 'this' is meaningless in this context, as no instance is either created
    // or remembered yet.

    return preprocessedArgs; // Array of Arrays
  },

  postprocess (preprocessedArgs) { // Array of Arrays

    // Final postprocessing
    // Use 'this' to reference the created or remembered Class instance

  }, // Returns nothing

  spread (arg) { // arg has type Class
    // Do some transformation
    return arrayOfConvertibleObjects; // Spread again if contains spreadable types
  },

  shallowSpread (arg) { // arg has type Class
    // Do some transformation
    return arrayOfConvertibleObjects; // No further spreading will occur
  }, 

  customArgs: [ // CustomArgs that are not converted are NOT used to initialize
    // Class objects, but they are still potentially reduced and/or postprocessed
    // so that the instance created or recalled may be tweaked/updated
    [Type, {
      convert (arg) { // arg has type Type

        // Do some transformation

        return convertedArg // So that it is a proper input for Class ctor
      },

      reduce (args) { // Arrays of all args of type Type

        // args is not convertedArgs but the Type args you passed to Polyton
        // Reduce them here to something

        return reducedArg; // May be of type Type or not
      },

      spread (arg) { // arg has type Type
        // Do some transformation
        return arrayOfConvertibleObjects; // Spread again if contains spreadable types
      },

      shallowSpread (arg) { // arg has type Type
        // Do some transformation
        return arrayOfConvertibleObjects; // No further spreading will occur
      },

      postprocess (reducedArg || arg) { // !convertedArg, !preprocessedArg

        // Use 'this' to reference the created or remembered Class instance

      } // Returns nothing
    }],

    [Type2, etc...}],

    etc...
  ]
}
```  

* `polytonOptions`: It is a literal object with the same options as above plus 4 others. The identical options are applied at the level of the BasePolyton singleton that wraps a collection of singletons of type Class. The same rules apply to this singleton. The four other options are:

```js
{
  unordered: true || false || undefined, // If true, the order of Class singletons doesn't matter

  unique: true || false || undefined, // If true, identical Class singletons
  // resulting from the sequence of init args are collapsed to one instance

  properties: { // Extend polyton with custom properties
    // This is mostly used to access the properties of the Class singletons in one go
    prop1: {
      value: 42,
    },

    prop2: {
      get () {
        return this.reduce(doStuff, init); // Reduce all Class singletons to some meaningful piece of data
      },
    },

    props: {
      get () {
        return this.map(el => el.prop); // Collect all prop property from Class singletons
      },
    },
  },

  extend: {
    method (a, b, c) {
      this.forEach(el => doStuff(el, a, b, c)); // Apply method to all Class singletons
    },
  },
}
```

## Instance Polyton API !heading

* `Polyton(...args)`: Creates a Polyton from a list of arrays of arguments. Each array contains the arguments to create an invidual underlying singleton.
* `instance.length`: Returns the number of singletons within the polyton.
* `instance.elements`: Returns a copy of the array of singletons within the polyton.
* `prototype.get(...args)`: `args` are the arguments from which some singleton was initialized; this method returns the corresponding singleton.
* `prototype.forEach(func)`: Loops over all singletons within the polyton.
* `prototype.map(func)`: Returns an array mapping all singletons within the polyton with the function `func`.
* `prototype.reduce(func)`: Returns the reduced value obtained from reducing the array of singletons within the polyton with function func.
* `prototype.concat(...args)`: Returns the concatenated Polyton from args. Args as already existing Polytons is allowed.
* `prototype.some(func)`: Returns true if one singleton validates func.
* `prototype.every(func)`: Returns true if all singletons validate func.
* `prototype.forEachPair(func)`: Loops over all singletons within the polyton, applying func to all possible pairs of singletons, [a, b] being considered distinct from [b, a], excluding [a, a].
* `prototype.forEachTriangular(func)`: Loops over all singletons within the polyton, applying func to all possible pairs of singletons, [a, b] being identified with [b, a], excluding [a, a].
* `prototype.mapPair(func)`: Loops over all singletons within the polyton, applying func to all possible pairs of singletons, [a, b] being considered distinct from [b, a], excluding [a, a]. Returns array of results.
* `prototype.mapTriangular(func)`: Loops over all singletons within the polyton, applying func to all possible pairs of singletons, [a, b] being identified with [b, a], excluding [a, a]. Returns array of results.

## Static Polyton API !heading

* `get(...args)`: Given the arguments that were used to create it, returns the corresponding Polyton (not to be confused with `prototype.get` method that returns individual Singletons).
