import { useRef } from 'react'
import Card, { LAYOUTS, HAS_PHOTO, PATTERNS } from './Card'
import { FONTS, toHex } from './data'

const FIELDS = [['title', 'Title'], ['sub', 'Subtitle'], ['body', 'Message'], ['name', 'Name'], ['date', 'Date & venue']]
const COLORS = [['bg', 'Background'], ['ac', 'Accent'], ['tx', 'Text']]
const FONT_CSS = "@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&amp;family=Great+Vibes&amp;family=Cinzel:wght@600&amp;family=Poppins:wght@600&amp;family=Lobster&amp;family=Dancing+Script:wght@700&amp;family=Abril+Fatface&amp;family=Bebas+Neue&amp;family=Inter&amp;display=swap');"

export default function Editor({ d, setD, onBack, onSave }) {
  const setText = (k, v) => setD({ ...d, t: { ...d.t, [k]: v } })
  const setColor = (k, v) => setD({ ...d, c: { ...d.c, [k]: v } })

  const fileRef = useRef()
  const loadPhoto = (f) => {
    if (!f) return
    const r = new FileReader()
    r.onload = () => {
      const im = new Image()
      im.onload = () => {
        const k = Math.min(1, 1200 / Math.max(im.width, im.height))
        const cv = document.createElement('canvas')
        cv.width = im.width * k; cv.height = im.height * k
        cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height)
        setD((p) => ({ ...p, img: cv.toDataURL('image/jpeg', 0.85) }))
      }
      im.src = r.result
    }
    r.readAsDataURL(f)
  }
  const onPick = (k) => (k === 'photo' ? fileRef.current.click() : document.getElementById('f-' + k)?.focus())

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
        <div className="canvas">
          <Card d={d} id="card-svg" onPick={onPick} />
        </div>
        <div className="panel">
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { loadPhoto(e.target.files[0]); e.target.value = '' }} />
          <label>
            Layout
            <select value={d.layout} onChange={(e) => setD({ ...d, layout: +e.target.value })}>
              {LAYOUTS.map((n, i) => <option key={n} value={i}>{n}{HAS_PHOTO[i] ? ' 📷' : ''}</option>)}
            </select>
          </label>
          <div className="row">
            <button className="btn ghost" style={{ flex: 1 }} onClick={() => fileRef.current.click()}>{d.img ? 'Change photo' : 'Upload photo'}</button>
            {d.img && <button className="btn ghost" onClick={() => setD({ ...d, img: null })}>Remove</button>}
          </div>
          {!HAS_PHOTO[d.layout] && <small style={{ color: 'var(--mut)' }}>This layout has no photo slot. Pick a layout marked 📷 to show your photo.</small>}
          <label>
            Background pattern
            <select value={d.pat} onChange={(e) => setD({ ...d, pat: +e.target.value })}>
              {PATTERNS.map((n, i) => <option key={n} value={i}>{n}</option>)}
            </select>
          </label>
          {FIELDS.map(([k, label]) => (
            <label key={k}>
              {label}
              {k === 'body' ? (
                <textarea id={'f-' + k} rows="3" value={d.t[k]} onChange={(e) => setText(k, e.target.value)} />
              ) : (
                <input type="text" id={'f-' + k} value={d.t[k]} onChange={(e) => setText(k, e.target.value)} />
              )}
            </label>
          ))}
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
          <small style={{ color: 'var(--mut)' }}>Tip: click any text on the card to edit it.</small>
        </div>
      </div>
    </div>
  )
}
