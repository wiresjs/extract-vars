[![Build Status](https://travis-ci.org/wiresjs/extract-vars.svg?branch=master)](https://travis-ci.org/wiresjs/extract-vars)

# Extract Watchables

extract-vars is a unique library that helps to extract variables from a javascript expression that could be possibly watched.
In spite of its light weight extract-vars is a pretty powerful library. You can combine it with [AsyncWatch](https://github.com/wiresjs/async-watch) and achieve a very performant watcher.

THe library is written to support 2-way binding framework development.

It is written in beautiful typescript, so you get typings along once installed. 

## Features

* Extracts all watchable variables from a string exression
* Uses a solid test set
* Does not use RegEx at all (hence costs nothing)
* Typings for typescript included
* Universal dist.js (works on both frontend and server)

## Use cases

Variable "dig" is exposed to window.

Extracts variables that should be watched. (imagine ng-class case)
```js
dig(`{"active" : user.name === 'hello', disabled : !user.age > 18 && user.sex === 1}`)
// ["user.name", "user.age", "user.sex"]
```


Variable assignment, declaration are ignored as for one cannot watch them.
```js
dig(`user.getFullName(user.name, "hello") user.age; var a = "111";e`) 
// ["user.name", "user.age"]
```

Submit an issue if you find a bug.

Star it you like it. 


