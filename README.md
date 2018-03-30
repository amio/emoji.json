# emoji.json [![npm](https://img.shields.io/npm/v/emoji.json.svg?style=flat-square)](https://www.npmjs.com/package/emoji.json)

Just an emoji.json.

Generated from [emoji-list](https://unicode.org/emoji/charts/emoji-list.html) with [this script](tools/gen-json.js).

> NOTE: There are no Emoji versions 6.0-10.0 as a decision was made in 2017 to align emoji version numbers with their respective Unicode versions starting with version 11.0.

### Usage

**install with npm**

`npm install emoji.json` then:

```javascript
var emoji = require('emoji.json')
console.log(emoji[2])
// {
//   no: 3,
//   codes: '1F602',
//   char: '😂',
//   name: 'face with tears of joy',
//   keywords: 'face | face with tears of joy | joy | laugh | tear'
// }
```

if you care about file size:

```javascript
var emojiCompact = require('emoji.json/emoji-compact.json')
console.log(emojiCompact)
// ["😀","😁","😂","🤣" ...]
```

**fetch from web**

- https://unpkg.com/emoji.json/emoji.json
- https://unpkg.com/emoji.json/emoji-compact.json
