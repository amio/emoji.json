const fs = require('fs')
const path = require('path')
const https = require('https')

const EMOJI_VERSION = '15.1'

const EMOJI_ITEM_REGEX = {
  "codes": /^([A-F0-9\s?]+)\S$/,
  // About regex for char
  // Authentication failed when using /\p{Extended_Pictographic}/ug to verify emoji with code 1F603. https://stackoverflow.com/a/64007175
  // Authentication failed when using /\p{RGI_Emoji}/v to verify emoji with code 263A. https://stackoverflow.com/a/69115223
  // Authentication failed when using /[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\u{1F9B0}-\u{1F9B3}]+/gu to verify emoji with code 1F603. https://stackoverflow.com/a/69115223
  // Change it after having appropriate validation rules.
  "char": /^(\s*)(\S+(?:\s+\S+)*)(\s*)$/, // https://stackoverflow.com/a/46897898
  "name": /^(\s*)(\S+(?:\s+\S+)*)(\s*)$/, // https://stackoverflow.com/a/46897898
  "status": /^component|fully-qualified|minimally-qualified|unqualified$/, // Format document in https://unicode.org/Public/emoji/15.1/emoji-test.txt
  "version": /^\d+\.\d+$/,
  "category": /^(\s*)(\S+(?:\s+\S+)*)(\s*)$/, // https://stackoverflow.com/a/46897898
  "group": /^(\s*)(\S+(?:\s+\S+)*)(\s*)$/, // https://stackoverflow.com/a/46897898
  "subgroup": /^(\s*)(\S+(?:\s+\S+)*)(\s*)$/, // https://stackoverflow.com/a/46897898
}

main()

async function main () {
  const text = await getTestFile(EMOJI_VERSION)

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
  await writeFiles(collected)

  console.log(collected.comments)
}

async function getTestFile (ver) {
  const url = `https://unicode.org/Public/emoji/${ver}/emoji-test.txt`

  process.stdout.write(`Fetch emoji-test.txt (v${EMOJI_VERSION})`)
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

function parseLine (line) {
  const data = line.trim().split(/\s+[;#] /)

  if (data.length !== 3) {
    return null
  }

  const [ codes, status, charAndName ] = data
  const [ , char, version, name ] = charAndName.match(/^(\S+) E(\d+\.\d+) (.+)$/)

  return { codes, char, name, status, version }
}

function get_type (obj) {
  // https://stackoverflow.com/a/7390612
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

function verify_full (data) {
  if(get_type(data) === 'array'){
    data.forEach((item) => {
      if(get_type(item) === 'object'){
        const key_lost = Object.keys(EMOJI_ITEM_REGEX).filter(x => !Object.keys(item).includes(x)); // https://stackoverflow.com/a/1723220
        const key_add = Object.keys(item).filter(x => !Object.keys(EMOJI_ITEM_REGEX).includes(x)); // https://stackoverflow.com/a/1723220
        if(key_lost.length === 0){
          if(key_add.length === 0){
            for (const key in EMOJI_ITEM_REGEX) {
              if (Object.hasOwnProperty.call(EMOJI_ITEM_REGEX, key)) {
                const regex = EMOJI_ITEM_REGEX[key];
                if(regex.test(item[key])){
                  // Verify success
                }else{
                  throw Error(`TypeError: Regular "${regex}" validation failed for value "${item[key]}" with key named "${key}" in ${JSON.stringify(item)}.`);
                }
              }else{
                throw Error(`TypeError: Function Object.hasOwnProperty.call() throw error in ${JSON.stringify(item)}.`);
              }
            }
          }else{
            throw Error(`TypeError: The new key named "${key_add.join(', ')}" is added in ${JSON.stringify(item)}. But no verification rules are specified for it. Please add rules for it in the variable EMOJI_ITEM_REGEX.`);
          }
        }else{
          throw Error(`TypeError: Expected key named "${key_lost.join(', ')}". They are lost in ${JSON.stringify(item)}. If this is expected, remove the rule for it in the variable EMOJI_ITEM_REGEX.`);
        }
      }else{
        throw Error(`TypeError: Expected object, received ${get_type(item)} in ${JSON.stringify(item)}.`);
      }
    })
  }else{
    throw Error(`TypeError: Expected array, received ${get_type(data)}.`);
  }
}

const rel = (...args) => path.resolve(__dirname, ...args)

function writeFiles({ full, compact }) {
  verify_full(full)
  fs.writeFileSync(rel('../emoji.json'), JSON.stringify(full), 'utf8')
  fs.writeFileSync(rel('../emoji-compact.json'), JSON.stringify(compact), 'utf8')
}
