const fs = require('fs')
const emoji = require('..')

const header = JSON.stringify(['default', 'char', 'name', 'keywords'])
const data = emoji.map(item => {
  return '\n    ' + JSON.stringify(
    [item.default, item.char, item.name, item.keywords]
  )
})
const compactEmoji = `{
  "header": ${header},
  "data": [${data}]
}`

fs.writeFile('emoji-compact.json', compactEmoji)
