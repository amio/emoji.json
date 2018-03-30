const fs = require('fs')
const emoji = require('..')

// const compactEmoji = emoji.map(({char, name}) => [char, name])
const compactEmoji = emoji.map(({char}) => char)

function writeJSONFile (fname, json) {
  fs.writeFile(fname, JSON.stringify(json), err => {
    if (err) return console.error(err)
    console.info(`${fname} generated`)
  })
}

writeJSONFile('emoji-compact.json', compactEmoji)
