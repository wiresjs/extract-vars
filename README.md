# readme

```js
dig(`{"active" : user.name === 'hello', disabled : !user.age > 18 && user.sex === 1}`)
// ["user.name", "user.age", "user.sex"]
```