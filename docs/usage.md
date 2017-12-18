## Usage !heading

A Polyton is an ordered list of singletons, and is itself a singleton, so that you can create and manage singletons straightforwardly.

`PolytonFactory` takes 4 arguments. The first one is a Type constructor for all the underlying singletons. The second one is an array of hints for the types of arguments that will be used to create the singletons (or a function generating a unique key for different set of arguments, the hints being just used to generate such a function internally). The third one is optional and provides methods to modify the arguments passed to the underlying singletons. The fourth one provides options to apply on the resulting polyton.

In the following example, 3 plane equations are created as singletons in one go. They are grouped as a Polyton in a specific order.

#include "build/docs/examples/usage.test.md"
