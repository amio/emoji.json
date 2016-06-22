# emoji.json

Just an emoji.json.

Generated from [full-emoji-list](http://unicode.org/emoji/charts/full-emoji-list.html) with [this script](https://gist.github.com/amio/cad657690e027e80a614f3ba2141397b).

### Usage

**install with npm**

`npm i emoji.json` then:

```javascript
var emoji = require('emoji.json')
console.log(emoji[2])
// {
//   "no": "3",
//   "code": "1F602",
//   "char": "😂",
//   "name": "FACE WITH TEARS OF JOY",
//   "date": "2010ʲ",
//   "default": "emoji",
//   "keywords": "face, joy, laugh, tear"
// }
```

**fetch from web**

https://npmcdn.com/emoji.json/emoji.json
