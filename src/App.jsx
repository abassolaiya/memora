import { useState } from 'react'
import Card from './Card'
import Editor from './Editor'
import { LAYOUTS, HAS_PHOTO } from './Card'
import { CATS, make } from './data'

const SAMPLE = [1, 3, 5, 2, 4, 9, 1, 3]

const NAV = [['home', 'Dashboard'], ['cats', 'Templates'], ['mine', 'My Designs']]

export default function App() {
  const [view, setView] = useState('home')
  const [cat, setCat] = useState(null)
  const [design, setDesign] = useState(null)
  const [saved, setSaved] = useState([])
  const [query, setQuery] = useState('')
  const [flt, setFlt] = useState('all')

  const go = (v) => { setView(v); window.scrollTo(0, 0) }
  const cats = CATS.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
  const openTemplate = (c, n) => { setDesign(make(c, n)); go('edit') }
  const save = () => setSaved([...saved, JSON.parse(JSON.stringify(design))])
  const catName = (id) => CATS.find((c) => c.id === id).name

  return (
    <div className="app">
      <aside>
        <div className="logo"><i>✦</i>Memora</div>
        {NAV.map(([k, label]) => (
          <button key={k} className={'nav' + (view === k || (k === 'cats' && view === 'cat') ? ' on' : '')} onClick={() => go(k === 'cats' ? 'home' : k)}>
            {label}
          </button>
        ))}
        <div className="user">
          <div className="av">AB</div>
          <div><b>Ayotunde</b><br /><small style={{ color: 'var(--mut)' }}>ayotunde@memora.com</small></div>
        </div>
      </aside>

      <main>
        <div className="top">
          <input placeholder="Search card types…" value={query} onChange={(e) => { setQuery(e.target.value); setView('home') }} />
          <button className="btn" onClick={() => go('home')}>+ Create New Design</button>
        </div>

        {view === 'home' && (
          <div>
            <div className="banner">
              <h1>Welcome back, Ayotunde!</h1>
              <p>Ready to craft your next memorable event?</p>
              <p>Pick a card type below to browse its templates.</p>
            </div>
            <div className="stats">
              <div className="stat"><b>{CATS.length}</b><span>Card types</span></div>
              <div className="stat"><b>{CATS.length * 50}</b><span>Templates</span></div>
              <div className="stat"><b>{saved.length}</b><span>Saved designs</span></div>
            </div>
            <div className="sec"><h2>Choose a card type</h2></div>
            <div className="grid">
              {cats.map((c) => (
                <button key={c.id} className="tile" onClick={() => { setCat(c); go('cat') }}>
                  <Card d={make(c, SAMPLE[CATS.indexOf(c)])} />
                  <b>{c.name}</b>
                  <small>50 templates</small>
                </button>
              ))}
            </div>
          </div>
        )}

        {view === 'cat' && (
          <div>
            <div className="mt">
              <button className="btn ghost" onClick={() => go('home')}>← Back</button>
              <h2>{cat.name} · 50 templates</h2>
              <select value={flt} onChange={(e) => setFlt(e.target.value)} style={{ marginLeft: 'auto', padding: 8, borderRadius: 9, border: '1px solid var(--bd)', background: 'var(--surf)', color: 'var(--tx)' }}>
                <option value="all">All templates</option><option value="photo">With photo slot</option><option value="plain">No photo</option>
              </select>
            </div>
            <div className="grid">
              {Array.from({ length: 50 }, (_, n) => n).filter((n) => flt === 'all' || (flt === 'photo') === !!HAS_PHOTO[n % 10]).map((n) => (
                <button key={n} className="tile" onClick={() => openTemplate(cat, n)}>
                  <Card d={make(cat, n)} />
                  <small>#{n + 1} · {LAYOUTS[n % 10]}</small>
                </button>
              ))}
            </div>
          </div>
        )}

        {view === 'edit' && design && <Editor d={design} setD={setDesign} onBack={() => go('cat')} onSave={save} />}

        {view === 'mine' && (
          <div>
            <div className="sec"><h2>My Designs</h2></div>
            {saved.length ? (
              <div className="grid">
                {saved.map((s, i) => (
                  <button key={i} className="tile" onClick={() => { setDesign(s); setCat(CATS.find((c) => c.id === s.cat)); go('edit') }}>
                    <Card d={s} />
                    <small>{catName(s.cat)}</small>
                  </button>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--mut)' }}>Nothing saved yet. Edit a template and press Save (kept for this session).</p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
