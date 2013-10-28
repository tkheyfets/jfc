Javascript Files Combiner (jfc)
===============================

The simple utility to assemble javascript modules into one application.

How to install
--------------

```
$ npm install jfc
```

How to use
--------

Let it be ~/dev/app -directory with this structure:

```
app/
    index.js
    module1/
        index.js
        controller.js
        model.js
    module2/
        index.js
        controller.js
        view.js
    app.js
    helpers.js
```

####app/index.js####
```
//@import app
```

####app/app.js####
```
(function(w) {
    var d = w.document;
    //@import helpers
    //@import module1/index
    //@import module2/index
}).call(this, window);
```


#### Using in terminal ####

```
$ jfc ~/dev/app script.js
```

#### Using in node ####

```
var jfc = require('jfc').assemble;

jfc('~/dev/app', script.js);
```

#### Output example (script.js) ####
```
(function(w) {
    var 
        App = {},
        d = w.document;
    
    App.helpers = {
        helperHello : function(name) { console.log('Hello, ' + name + '!'); }
    };
    
    App.Controller1 = {
        controlIt: function() {
            return 'Smth#1.';
        }
    };
    
    App.Model1 = {
        name : 'Test'
    };
    
    App.Controller2 = {
        controlIt: function() {
            return 'Smth#2';
        }
    };
    
    App.View2 = {
        goodView: 'SomeView#2'
    };
}).call(this, window);
```

Release Notes
-------------
* 0.3.2 - made jfc as collection of functions, added method *assemble* instead of *jfc*
* 0.2.2 - added .npmignore, added documentation, removed globalPrefer from package.json, 
* 0.2.1 - added path relative function, started using path module
* 0.2.0 - added support for input file or directory as index, created two files to separate terminal command and nodejs module function
* 0.1.2 - fixed issues with path, added basic tests
* 0.1.0 - initial commit, added basic assemble support