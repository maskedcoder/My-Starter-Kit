# CSS Design

The CSS here is heavily borrowed/adapted from [Harry Roberts](https://github.com/csswizardry/). It is sort of a mixture of [BEM](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/), [ITCSS](http://csswizardry.net/talks/2014/11/itcss-dafed.pdf), and [random things](http://csswizardry.com/2015/03/more-transparent-ui-code-with-namespaces/) [gleaned](http://csswizardry.com/2015/03/immutable-css/) [from](http://csswizardry.com/2014/07/hacks-for-dealing-with-specificity/) his [blog](http://csswizardry.com/#section:articles), and [elsewhere](https://cssguidelin.es/). Note that "adapting" means that things may be slightly different, for whatever reason or another.

## Organization

Using the ITCSS scheme, files are grouped into 7 categories:

  1. **Settings** - Variables and configurations
  2. **Tools** - Mixins and functions
  3. **Generic** - Resets
  4. **Base** - Element styling
  5. **Objects** - Structural, reusable styles
  6. **Components** - Complete UI components
  7. **Trumps** - Overrides

Each of these categories has its own folder except Settings. All Settings are in the file `_settings.scss`. For a better explanation of the ITCSS layers, [read this pdf](http://csswizardry.net/talks/2014/11/itcss-dafed.pdf).

## Conventions

In addition to using the ITCSS scheme, (most) classes will also use prefixes to help identify their purpose. These prefixes are:

  1. `o-` An Object
  2. `c-` A UI Component
  3. `u-` A Utility class
  4. `t-` Adds a Theme to a view
  5. `is-`, `has-` For specific conditions. For example, a dropdown menu might use `.is-open`
  6. `_-` A hack

Another prefix, which will not be in the CSS, is `js-` which indicates that the class is for JavaScript to hook onto. This prevents styling changes from interfering with JavaScript functionality.

See [More Transparent UI Code with Namespacees](http://csswizardry.com/2015/03/more-transparent-ui-code-with-namespaces/) for a more complete explanation.
