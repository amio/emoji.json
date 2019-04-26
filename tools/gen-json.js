{
  const { $$, copy } = window // Chrome Console API

  const andrs = $$('th.bighead, td.andr')
  const trs = andrs.map(el => {
    if (el.tagName === 'TD') {
      return el.parentElement
    }
    return el
  })

  let category
  const emojis = trs.map(el => {
    if (el.tagName === 'TH') {
      category = el.innerText
      return
    }
    const tds = el.children
    const codes = tds[1].innerText.replace(/U\+/g, '')
    return {
      no: parseInt(tds[0].innerText),
      codes: codes,
      char: codes.split(' ').map(s => String.fromCodePoint(parseInt(s, 16))).join(''),
      name: tds[3].innerText,
      keywords: tds[4].innerText,
      category
    }
  }).filter(x => x)

  console.log(emojis)
  copy(JSON.stringify(emojis, null, 2))
}
