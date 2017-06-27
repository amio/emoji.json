{
  const { $$, copy } = window // Chrome Console API
  const ids = $$('td.rchars')
  const trs = ids.map(e => e.parentElement).filter(x => x.children.length === 16)
  const db = trs.map(tr => {
    const tds = tr.children
    return {
      no: parseInt(tds[0].innerText),
      code: tds[1].innerText.replace(/U\+/g, ''),
      char: tds[2].innerText,
      name: tds[15].innerText
    }
  })
  copy(JSON.stringify(db, null, 2))
}
