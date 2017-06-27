# emoji.json [![npm](https://img.shields.io/npm/v/emoji.json.svg?style=flat-square)](https://www.npmjs.com/package/emoji.json)

Just an emoji.json.

Generated from [full-emoji-list](http://unicode.org/emoji/charts/full-emoji-list.html) with [this script](tools/gen-json.js).

### Usage

**install with npm**

`npm install emoji.json` then:

```javascript
var emoji = require('emoji.json')
console.log(emoji[2])
// {
//   "no": 3,
//   "code": "1F602",
//   "char": "😂",
//   "name": "FACE WITH TEARS OF JOY"
// }
```

if you care about file size:

```javascript
var emojiCompact = require('emoji.json/emoji-compact.json')
console.log(emojiCompact)
// [
//     ["😀","GRINNING FACE"],
//     ["😁","GRINNING FACE WITH SMILING EYES"],
//     ["😂","FACE WITH TEARS OF JOY"],
//     ...
//   ]
```

**fetch from web**

- https://unpkg.com/emoji.json/emoji.json
- https://unpkg.com/emoji.json/emoji-compact.json
