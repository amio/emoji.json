# emoji.json [![npm](https://img.shields.io/npm/v/emoji.json.svg?style=flat-square)](https://www.npmjs.com/package/emoji.json)

[![Greenkeeper badge](https://badges.greenkeeper.io/amio/emoji.json.svg)](https://greenkeeper.io/)

Just an emoji.json.

Generated from [full-emoji-list](http://unicode.org/emoji/charts/full-emoji-list.html) with [this script](https://gist.github.com/amio/cad657690e027e80a614f3ba2141397b).

### Usage

**install with npm**

`npm install emoji.json` then:

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

if you care about file size:

```javascript
var emojiCompact = require('emoji.json/emoji-compact.json')
console.log(emojiCompact)
// {
//   "header": ["default","char","name","keywords"],
//   "data": [
//     ["emoji","😀","GRINNING FACE","face, grin"],
//     ["emoji","😁","GRINNING FACE WITH SMILING EYES","eye, face, grin, smile"],
//     ["emoji","😂","FACE WITH TEARS OF JOY","face, joy, laugh, tear"],
//     ...
//   ]
// }
```

**fetch from web**

- https://unpkg.com/emoji.json/emoji.json
- https://unpkg.com/emoji.json/emoji-compact.json
