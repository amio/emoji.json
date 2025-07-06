const fs = require('fs')
const path = require('path')
const https = require('https')

const EMOJI_VERSION = 'latest'

main()

async function main () {
  const text = await fetchTestFile(EMOJI_VERSION)

  const version = parseVersion(text)
  console.log(`Version: ${version}`)

  console.log(`Format text to json...`)
  const collected = text.trim().split('\n').reduce((accu, line) => {
    if (line.startsWith('# group: ')) {
      console.log(`  Processing ${line.substr(2)}...`)
      accu.group = line.substr(9)
    } else if (line.startsWith('# subgroup: ')) {
      accu.subgroup = line.substr(12)
    } else if (line.startsWith('#')) {
      accu.comments = accu.comments + line + '\n'
    } else {
      const meta = parseLine(line)
      if (meta) {
        meta.category = `${accu.group} (${accu.subgroup})`
        meta.group = accu.group
        meta.subgroup = accu.subgroup
        accu.full.push(meta)
        accu.compact.push(meta.char)
      } else {
        accu.comments = accu.comments.trim() + '\n\n'
      }
    }
    return accu
  }, { comments: '', full: [], compact: [] })

  console.log(`Processed emojis: ${collected.full.length}`)

  console.log('Write file: emoji.json, emoji-compact.json \n')
  writeFile('emoji.json', collected.full)
  writeFile('emoji-compact.json', collected.compact)
  writeFile('version', version)

  console.log(collected.comments)
}

async function fetchTestFile (ver) {
  const url = `https://unicode.org/Public/emoji/${ver}/emoji-test.txt`

  process.stdout.write(`Fetch emoji-test.txt (${ver})`)

  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let text = ''
      res.setEncoding('utf8')
      res.on('data', (chunk) => {
        process.stdout.write('.')
        text += chunk
      })
      res.on('end', () => {
        process.stdout.write('\n')
        resolve(text)
      })
      res.on('error', reject)
    })
  })
}

function parseVersion (text) {
  const match = text.match(/# Version: (\d+\.\d+)/)

  if (match) {
    return match[1]
  } else {
    throw new Error('Could not find emoji version in the text')
  }
}

function parseLine (line) {
  const data = line.trim().split(/\s+[;#] /)

  if (data.length !== 3) {
    return null
  }

  const [ codes, status, charAndName ] = data
  const [ , char, name ] = charAndName.match(/^(\S+) E\d+\.\d+ (.+)$/)

  return { codes, char, name }
}

function writeFile(filename, data) {
  fs.writeFileSync(
    path.resolve(__dirname, '../', filename),
    typeof data === 'string' ? data : JSON.stringify(data),
    'utf8'
  )
}
