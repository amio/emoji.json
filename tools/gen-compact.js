const fs = require('fs')
const emoji = require('..')

const compactEmoji = emoji.map(item => {
  return JSON.stringify(
    [item.char, item.name]
  )
})

fs.writeFile('emoji-compact.json', compactEmoji, (err) => {
  if (err) return console.error(err)

  console.log('emoji-compact.json generated.')
})
