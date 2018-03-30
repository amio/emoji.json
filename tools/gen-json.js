{
  const { $$, copy } = window // Chrome Console API

  const andrs = $$('td.andr')
  const trs = andrs.map(e => e.parentElement)

  const emojis = trs.map(tr => {
    const tds = tr.children
    const codes = tds[1].innerText.replace(/U\+/g, '')
    return {
      no: parseInt(tds[0].innerText),
      codes: codes,
      char: codes.split(' ').map(s => String.fromCodePoint(parseInt(s, 16))).join(''),
      name: tds[3].innerText,
      keywords: tds[4].innerText
    }
  })

  console.log(emojis)
  copy(JSON.stringify(emojis, null, 2))
}
