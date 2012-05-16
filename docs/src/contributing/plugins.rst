*******
Plugins
*******

Creating and extending plugins is the entire purpose of class.js.
To encourage users to write and extend plugins, we need to establish some common guidelines.


Creating a plugin
=================

First of all, create a JavaScript file and include the following information within the top of your script:

* the authors name
* the plugins version
* the plugins license
* the plugins dependencies

For example::

    /**
     * @author      Angelo Dini
     * @version     1.0
     * @copyright   Distributed under the BSD License.
     * @requires    class.js, jQuery
     */

You can include the information at any style of your choice whatsoever.
Just insure that you include the required information within the development and minified versions alike.


====


Creating a namespace is important to keep the amount of global variables as low as possible.

I prefere to use Cl as the shorthand for **Cl** ass::

    var Cl = window.Cl || {};

You are welcome to use this namespace as well. You might want to crossreference the core plugins
for already reservated names like Cl.Lightbox or Cl.Carousel.


====


Creating a closure allows you to create an environment where you don't have to worry about other
plugins namespaces. class.js uses this system by itself::

    (function(){
        // your code here
    })();

    // you might want to pass some custom variables
    (function($){
        // your code here
    })(jQuery);


====


When choosing names be descriptive and use CamelCase for naming conventions::

    Cl.MyPlugin = new Class({
        initialize: function () {
            return 'My first plugin';
        }
    });


====


If we combine those techniques your plugin would look like this::

    /**
     * @author      Angelo Dini, Distributed under the BSD License.
     * @version     1.0
     * @requires    class.js, jQuery
     */
    (function(){
        Cl.MyPlugin = new Class({
            initialize: function () {
                return 'My first plugin';
            }
        });
    })();


Submitting a plugin
===================

If you successfully created a plugin worth spreading let us know https://twitter.com/finalangel and we will
include it within the plugins list. We just require the a website or download link.


Core plugins
============

Besides the above described plugins we maintain several core plugins like ``Cl.Lightbox`` or
``Cl.Carousel``. Those core plugins differ in various ways:

**A core plugin requires tests and documentation** preferable within the repository itself,
with the option of external documentation. This allows for an easy development process and
insures a high level of quality. Those plugins receive a **reserved namespace** like
``Cl.AutoComplete`` and will be listed separately.

It is also a **must** to provide an example page in which the functionality of the plugin can
be demonstrated. Either through using github or a dedicated microsite.

You are encouraged to use classjs as a name prefix when using a subversion system. For
example ``classjs-lightbox`` or ``classjs-autocomplete``.

Your plugin also needs to be easily extendable while providing meaningful options.