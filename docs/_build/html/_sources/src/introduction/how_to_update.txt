*************
How to update
*************

Update from Beta to 1.0
=======================

There are no special adjustments required for this version.
Beta releases will not be covered by any adaptation.
Therefore consult the Changelog for more details.


Update from classy.js to class.js
=================================

There is not **yet** an official adapter from classy.js (Divio internal version) to class.js.
You need to change your code to be compatible with class.js. Please follow this guide for a smooth transition:

Comparison from old to new::

    var Animal = Class.$extend(obj); // old
    var Animal = new Class(obj); // new

    var Tiger = Animal.$extend(obj); // old
    var Tiger = Animal.extend(obj); // new

    Class.$classyVersion; // old
    Class.version; // new

    Class.$withData(obj); // old
    Class.setOptions(obj); // new

    Class.$noConflict(); // old
    Class.noConflict(); // new

    this.$super(); // old
    this.parent(); // new

    initialize: function () {} // identical in both versions

    implement: [array] // identical in both version

Additionally class.js provides the following features::

    Class.getOptions();
    Class.implement([array]);