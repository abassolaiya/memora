import { useRef } from 'react'
import Card, { LAYOUTS, HAS_PHOTO, PATTERNS, SLOTS } from './Card'
import { FONTS, toHex } from './data'

const COLORS = [['bg', 'Background'], ['ac', 'Accent'], ['tx', 'Text']]
const FONT_CSS = "@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&amp;family=Great+Vibes&amp;family=Cinzel:wght@600&amp;family=Poppins:wght@600&amp;family=Lobster&amp;family=Dancing+Script:wght@700&amp;family=Abril+Fatface&amp;family=Bebas+Neue&amp;family=Inter&amp;display=swap');"

export default function Editor({ d, setD, onBack, onSave }) {
  const fileRef = useRef()
  const target = useRef(null) // null = single photo, number = gallery slot
  const prog = d.layout >= 10 // church program layouts: gallery + lineup
  const order = d.cat === 'church' ? [10, 11, 12, 13, 14, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  const fields = prog
    ? [['title', 'Title'], ['sub', 'Subtitle'], ['name', 'Church / host name'], ['date', 'Date & venue']]
    : [['title', 'Title'], ['sub', 'Subtitle'], ['body', 'Message'], ['name', 'Name'], ['date', 'Date & venue']]
  const imgs = d.imgs || []
  const program = d.program || []

  const setText = (k, v) => setD({ ...d, t: { ...d.t, [k]: v } })
  const setColor = (k, v) => setD({ ...d, c: { ...d.c, [k]: v } })
  const setRow = (i, k, v) => setD({ ...d, program: program.map((r, j) => (j === i ? { ...r, [k]: v } : r)) })
  const clearSlot = (i) => setD({ ...d, imgs: Object.assign([null, null, null, null], imgs, { [i]: null }) })

  const choose = (slot) => { target.current = slot; fileRef.current.click() }
  const onPick = (k) => {
    if (k === 'photo') choose(null)
    else if (k.startsWith('photo:')) choose(+k.slice(6))
    else if (k === 'program') document.getElementById('f-program-0')?.focus()
    else document.getElementById('f-' + k)?.focus()
  }

  const loadPhoto = (f) => {
    if (!f) return
    const slot = target.current
    const r = new FileReader()
    r.onload = () => {
      const im = new Image()
      im.onload = () => {
        const k = Math.min(1, 1200 / Math.max(im.width, im.height))
        const cv = document.createElement('canvas')
        cv.width = im.width * k; cv.height = im.height * k
        cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height)
        const url = cv.toDataURL('image/jpeg', 0.85)
        setD((p) => (slot == null ? { ...p, img: url } : { ...p, imgs: Object.assign([null, null, null, null], p.imgs, { [slot]: url }) }))
      }
      im.src = r.result
    }
    r.readAsDataURL(f)
  }

  const download = () => {
    let svg = new XMLSerializer().serializeToString(document.getElementById('card-svg'))
    svg = svg.replace('>', `><defs><style>${FONT_CSS}</style></defs>`)
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
    a.download = `${d.cat}-card.svg`
    a.click()
  }

  return (
    <div>
      <div className="mt">
        <button className="btn ghost" onClick={onBack}>← Templates</button>
        <h2>Edit your card</h2>
      </div>
      <div className="edit">
        <div className="canvas"><Card d={d} id="card-svg" onPick={onPick} /></div>
        <div className="panel">
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { loadPhoto(e.target.files[0]); e.target.value = '' }} />
          <label>
            Layout
            <select value={d.layout} onChange={(e) => setD({ ...d, layout: +e.target.value })}>
              {order.map((i) => <option key={i} value={i}>{LAYOUTS[i]}{HAS_PHOTO[i] ? ' 📷' : ''}</option>)}
            </select>
          </label>

          {prog ? (
            <label>
              Photos ({SLOTS[d.layout]} slots)
              <div className="slots">
                {Array.from({ length: SLOTS[d.layout] }, (_, i) => (
                  <div key={i} className="slot" style={imgs[i] ? { backgroundImage: `url(${imgs[i]})` } : undefined} onClick={() => choose(i)}>
                    {imgs[i] ? <b onClick={(e) => { e.stopPropagation(); clearSlot(i) }}>×</b> : '+'}
                  </div>
                ))}
              </div>
            </label>
          ) : (
            <>
              <div className="row">
                <button className="btn ghost" style={{ flex: 1 }} onClick={() => choose(null)}>{d.img ? 'Change photo' : 'Upload photo'}</button>
                {d.img && <button className="btn ghost" onClick={() => setD({ ...d, img: null })}>Remove</button>}
              </div>
              {!HAS_PHOTO[d.layout] && <small style={{ color: 'var(--mut)' }}>This layout has no photo slot. Pick a layout marked 📷 to show your photo.</small>}
            </>
          )}

          <label>
            Background pattern
            <select value={d.pat} onChange={(e) => setD({ ...d, pat: +e.target.value })}>
              {PATTERNS.map((n, i) => <option key={n} value={i}>{n}</option>)}
            </select>
          </label>

          {fields.map(([k, label]) => (
            <label key={k}>
              {label}
              {k === 'body' ? (
                <textarea id={'f-' + k} rows="3" value={d.t[k]} onChange={(e) => setText(k, e.target.value)} />
              ) : (
                <input type="text" id={'f-' + k} value={d.t[k]} onChange={(e) => setText(k, e.target.value)} />
              )}
            </label>
          ))}

          {d.cat === 'church' && (
            <label>
              Program lineup
              {prog ? (
                <>
                  <input type="text" id="f-lineup" value={d.t.lineup || ''} placeholder="Heading" onChange={(e) => setText('lineup', e.target.value)} />
                  {program.map((r, i) => (
                    <div className="prow" key={i}>
                      <input type="text" id={'f-program-' + i} style={{ width: 70 }} maxLength={8} placeholder="Time" value={r.time} onChange={(e) => setRow(i, 'time', e.target.value)} />
                      <input type="text" style={{ flex: 1 }} maxLength={30} placeholder="Item" value={r.item} onChange={(e) => setRow(i, 'item', e.target.value)} />
                      <button className="x" onClick={() => setD({ ...d, program: program.filter((_, j) => j !== i) })}>×</button>
                    </div>
                  ))}
                  {program.length < 8 && <button className="btn ghost" onClick={() => setD({ ...d, program: [...program, { time: '', item: '' }] })}>+ Add item ({program.length}/8)</button>}
                </>
              ) : <small style={{ color: 'var(--mut)', fontWeight: 400 }}>Pick one of the first five church layouts to show the lineup.</small>}
            </label>
          )}

          <label>
            Font
            <select value={d.font} onChange={(e) => setD({ ...d, font: e.target.value })}>
              {FONTS.map((f) => <option key={f}>{f}</option>)}
            </select>
          </label>
          <label>
            Title size: {d.ts}
            <input type="range" min="26" max="90" value={d.ts} onChange={(e) => setD({ ...d, ts: +e.target.value })} />
          </label>
          <div className="row">
            {COLORS.map(([k, label]) => (
              <label key={k}>
                {label}
                <input type="color" value={toHex(d.c[k])} onChange={(e) => setColor(k, e.target.value)} />
              </label>
            ))}
          </div>
          <div className="row">
            <button className="btn" style={{ flex: 1 }} onClick={download}>Download SVG</button>
            <button className="btn ghost" onClick={onSave}>Save</button>
          </div>
          <small style={{ color: 'var(--mut)' }}>Tip: click any text or photo on the card to edit it.</small>
        </div>
      </div>
    </div>
  )
}
