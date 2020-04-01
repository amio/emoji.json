const fs = require('fs')
const path = require('path')
const https = require('https')

const EMOJI_VERSION = '13.0'

main(process.argv[2])

function addStructured({structured, group, subgroup}, meta) {
  const s = structured
  const data = {
    version: meta.version,
    char: meta.char,
    key: meta.key,
  }

  if (!s[group]) s[group] = {}
  if (!s[group][subgroup]) s[group][subgroup] = {}
  if (!s[group][subgroup][meta.name]) s[group][subgroup][meta.name] = {}
  const p = s[group][subgroup][meta.name]
  
  if (meta.variant) {
    if (!p.variants) p.variants = {}
    p.variants[meta.variant] = data
  } else {
    s[group][subgroup][meta.name] = data  
  }
}

async function main (ver = EMOJI_VERSION) {
  const text = await getTestFile(ver)
  const version = parseFloat(ver)

  console.log(`Format text to json...`)
  let lineNo = 0
  const collected = text.trim().split('\n').reduce((accu, line) => {
    if (line.startsWith('# group: ')) {
      console.log(`  Processing ${line.substr(2)}...`)
      accu.group = line.substr(9)
    } else if (line.startsWith('# subgroup: ')) {
      accu.subgroup = line.substr(12)
    } else if (line.startsWith('#')) {
      accu.comments = accu.comments + line + '\n'
    } else {
      const meta = parseLine(line, lineNo++)
      
      if (meta) {
        if (meta.version > version) return accu

        meta.category = `${accu.group} (${accu.subgroup})`
        meta.group = accu.group
        meta.subgroup = accu.subgroup

        accu.full.push(meta)
        accu.compact.push(meta.char)
        addStructured(accu, meta)         
      } else {
        accu.comments = accu.comments.trim() + '\n\n'
      }
    }
    return accu
  }, { comments: '', full: [], compact: [], structured: {} })

  console.log(`Processed emojis: ${collected.full.length}`)

  console.log('Write file: emoji.json, emoji-compact.json \n')
  await writeFiles(collected)

  console.log(collected.comments)
}

async function getTestFile (ver) {
  const url = `https://unicode.org/Public/emoji/${EMOJI_VERSION}/emoji-test.txt`

  process.stdout.write(`Fetch emoji-test.txt (v${ver}) from ${url}`)
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

function parseLine (line, lineNo) {
  const data = line.trim().split(/\s+[;#] /)

  if (data.length !== 3) {
    return null
  }

  const [ codes, status, charAndName ] = data
  const [ , char, version, name, variant ] = charAndName.match(/^(\S+) E(\d+\.\d+) (.+?)(?:\: (.*))?$/)
  return { codes, char, version: parseFloat(version), name, variant, key: lineNo }
}

const rel = (...args) => path.resolve(__dirname, ...args)

function writeFiles({ full, compact, structured }) {
  fs.writeFileSync(rel('../emoji.json'), JSON.stringify(full), 'utf8')
  fs.writeFileSync(rel('../emoji-compact.json'), JSON.stringify(compact), 'utf8')
  fs.writeFileSync(rel('../emoji-structured.json'), JSON.stringify(structured), 'utf8')
}
