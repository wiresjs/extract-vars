# Extract Watchables

extract-vars is a unique library that helps to extract variables from a javascript expression that could be possibly watched.
In spite of its weight extract-vars is a pretty responsible library. You can combine it with [AsyncWatch](https://github.com/wiresjs/async-watch) and achieve a very performant watcher.


It is written in beautiful typescript, so you get typings along once installed.

## Use cases

Variable "dig" is exposed to window.

```js
dig(`{"active" : user.name === 'hello', disabled : !user.age > 18 && user.sex === 1}`)
// ["user.name", "user.age", "user.sex"]
```
