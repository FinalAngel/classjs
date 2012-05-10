************
Why class.js
************

I started learning JavaScript roughly in 2002 without the use of any framework.
Back than Prototype was the big player and I did not understand its concept.
I also had issues with Prototype’s none-modular approach splitting animation
(script-aculo-us) from the core library.

After I finishing my study I came across MooTools and quickly adapted my code to
a more modular and re-usable style. At a certain point of my career the requirements
for use of jQuery grew. jQuery’s popularity grow and we had to adapt.

I am not a big fan of jQuery, especially jQuery’s UI approach. It is missing any
modular structure and is almost impossible to extend. The fame of jQuery makes it
hard to find a plugin for your case. If you end up finding one you end up changing
the code to work for your specific case. This is wrong. I should be able to take
the plugin and extend it, leaving the code untouched. This enables me to easily
update and maintain the plugin without re-implementing your own changes.

There is also a second reason. A lot of developers do not understand the principles
of prototypal inheritance. All in all JavaScript is one of the few popular languages
which adapts this concept. This is confusing and leads to misinterpretation.

This is why I created class.js.

