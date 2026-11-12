import { useId } from 'react'
import { wrap } from './data'

export const LAYOUTS = ['Classic frame', 'Arch photo', 'Full photo', 'Circle photo', 'Diagonal photo', 'Polaroid', 'Top band', 'Editorial', 'Badge', 'Framed photo', 'Gallery strip', 'Hero + thumbs', 'Side column', 'Photo collage', 'Stained windows']
export const HAS_PHOTO = [0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1]
export const PATTERNS = ['None', 'Dots', 'Diagonal', 'Crosses', 'Rings']

// y: first title baseline, a: m(iddle)/s(tart), x: text x, mw: body wrap, bm: max body lines, cap: max title size
const SPEC = [
  { y: 390, a: 'm', x: 300, mw: 30, bm: 3, cap: 90 },
  { y: 520, a: 'm', x: 300, mw: 30, bm: 2, cap: 56 },
  { y: 520, a: 'm', x: 300, mw: 28, bm: 2, cap: 56 },
  { y: 450, a: 'm', x: 300, mw: 30, bm: 2, cap: 60 },
  { y: 500, a: 'm', x: 300, mw: 30, bm: 2, cap: 56 },
  { y: 530, a: 'm', x: 300, mw: 30, bm: 2, cap: 52 },
  { y: 430, a: 'm', x: 300, mw: 30, bm: 3, cap: 80 },
  { y: 340, a: 's', x: 70, mw: 26, bm: 3, cap: 80 },
  { y: 470, a: 'm', x: 300, mw: 30, bm: 3, cap: 70 },
  { y: 480, a: 'm', x: 300, mw: 30, bm: 2, cap: 56 },
]
// motif placements: [x, y, scale, colour]
const MS = [
  [[300, 170, 1, 'ac']], [[62, 70, .4, 'ac'], [538, 70, .4, 'ac']], [[300, 110, .8, '#fff']],
  [[60, 60, .4, 'ac'], [540, 740, .4, 'ac']], [[300, 365, .45, 'ac']], [[300, 412, .35, 'ac']],
  [[300, 150, 1.2, 'bg']], [[110, 120, .9, 'ac']], [[300, 270, 1.3, 'ac']], [[524, 84, .4, 'ac']],
]
const STAR = 'M0,-50 L14,-15 L50,-15 L21,6 L32,42 L0,20 L-32,42 L-21,6 L-50,-15 L-14,-15Z'

function Motif({ cat, col }) {
  switch (cat) {
    case 'birthday':
      return (<g><g fill={col}><ellipse cx="-34" cy="-18" rx="24" ry="30" /><ellipse cx="0" cy="-38" rx="24" ry="30" opacity=".7" /><ellipse cx="34" cy="-14" rx="24" ry="30" opacity=".85" /></g>
        <path d="M-34 12 L0 62M0 -8 L0 62M34 16 L0 62" stroke={col} fill="none" strokeWidth="2" /></g>)
    case 'wedding':
      return (<g fill="none" stroke={col} strokeWidth="7"><circle cx="-20" cy="0" r="32" /><circle cx="20" cy="0" r="32" /></g>)
    case 'burial':
      return (<g fill={col}>{[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx="0" cy="-30" rx="11" ry="30" transform={`rotate(${a})`} opacity=".85" />)}<circle r="8" opacity=".5" /></g>)
    case 'season':
      return (<g stroke={col} strokeWidth="6" strokeLinecap="round" fill="none">{[0, 60, 120].map((a) => <path key={a} d="M-52 0H52M-38 -12L-52 0L-38 12M38 -12L52 0L38 12" transform={`rotate(${a})`} />)}</g>)
    case 'church':
      return (<g fill={col}><rect x="-9" y="-62" width="18" height="124" rx="3" /><rect x="-40" y="-28" width="80" height="18" rx="3" /></g>)
    case 'thanks':
      return <path d="M0 36C-70 -10 -45 -58 0 -22C45 -58 70 -10 0 36Z" fill={col} />
    case 'grad':
      return (<g fill={col}><polygon points="-70,-10 0,-40 70,-10 0,20" /><path d="M-38 6V34Q0 54 38 34V6L0 24Z" opacity=".75" /><rect x="62" y="-8" width="4" height="40" /><circle cx="64" cy="36" r="6" /></g>)
    default:
      return <path d={STAR} fill={col} transform="scale(1.3)" />
  }
}

// five motif treatments, picked by template variant
function Decor({ cat, col, v, s }) {
  const m = <Motif cat={cat} col={col} />
  if (s < 0.6 || v === 0) return m
  if (v === 1) return <g><circle r="82" fill="none" stroke={col} strokeWidth="3" /><g transform="scale(.7)">{m}</g></g>
  if (v === 2) return <g>{[-120, 0, 120].map((x) => <g key={x} transform={`translate(${x},0) scale(.5)`}>{m}</g>)}</g>
  if (v === 3) return <g><path d="M-210 0H-100M100 0H210" stroke={col} strokeWidth="3" />{m}</g>
  return <g><g transform="scale(.85)">{m}</g>{[[-90, -40], [95, -45], [-100, 40], [105, 45], [0, -90]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4" fill={col} />)}</g>
}

function PlainCard({ d, id, onPick }) {
  const { layout: L, t, c, font, cat, pat = 0, v = 0, img } = d
  const uid = useId().replace(/:/g, '')
  const [pid, cid, gid] = ['p', 'c', 'g'].map((k) => k + uid)
  const sp = SPEC[L], left = sp.a === 's', full = L === 2
  const ts = Math.min(d.ts, sp.cap)
  const tcol = full ? '#fff' : c.tx, acol = full ? '#fff' : c.ac
  const pick = (k) => (onPick ? () => onPick(k) : undefined)
  const st = { cursor: onPick ? 'pointer' : 'default', fontFamily: `'${font}',serif` }
  const sans = { ...st, fontFamily: 'Inter,sans-serif' }

  // stack the text blocks so nothing overlaps
  const tl = wrap(t.title, Math.max(6, Math.floor(470 / (ts * 0.55)))).slice(0, sp.bm === 2 ? 2 : 3)
  let y = sp.y + (tl.length - 1) * ts * 1.05 + 46
  const subY = y
  y += 44
  const bl = wrap(t.body, sp.mw).slice(0, sp.bm)
  const bodyY = y
  y += (bl.length - 1) * 28 + 56
  const nameY = y, dateY = y + 38
  const T = { x: sp.x, textAnchor: left ? 'start' : 'middle' }

  const photo = (x, yy, w, h) => (
    <g clipPath={`url(#${cid})`} onClick={pick('photo')} style={{ cursor: onPick ? 'pointer' : 'default' }}>
      {img ? <image href={img} x={x} y={yy} width={w} height={h} preserveAspectRatio="xMidYMid slice" /> : (
        <g>
          <rect x={x} y={yy} width={w} height={h} fill={`url(#${gid})`} />
          <g transform={`translate(${x + w / 2},${yy + h / 2})`} fill="#fff" opacity=".75">
            <path d="M-40 20L-14 -14L6 8L18 -6L40 20Z" /><circle cx="22" cy="-22" r="8" />
            {onPick && <text y="52" textAnchor="middle" fontSize="16" fontFamily="Inter,sans-serif">Click to add photo</text>}
          </g>
        </g>
      )}
    </g>
  )

  return (
    <svg id={id} viewBox="0 0 600 800" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id={pid} width="28" height="28" patternUnits="userSpaceOnUse">
          {pat === 1 && <circle cx="14" cy="14" r="2.2" fill={c.ac} />}
          {pat === 2 && <path d="M-4 32L32 -4" stroke={c.ac} strokeWidth="1.5" />}
          {pat === 3 && <path d="M14 8V20M8 14H20" stroke={c.ac} strokeWidth="1.5" />}
          {pat === 4 && <circle cx="14" cy="14" r="9" fill="none" stroke={c.ac} strokeWidth="1.2" />}
        </pattern>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={c.ac} /><stop offset="1" stopColor={full ? '#222' : c.bg} /></linearGradient>
        <linearGradient id={gid + 'o'} x1="0" y1="0" x2="0" y2="1"><stop offset=".3" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".8" /></linearGradient>
        <clipPath id={cid}>
          {L === 1 && <path d="M120 420V210A180 180 0 0 1 480 210V420Z" />}
          {L === 2 && <rect width="600" height="800" />}
          {L === 3 && <circle cx="300" cy="200" r="150" />}
          {L === 4 && <polygon points="0,0 600,0 600,300 0,430" />}
          {L === 5 && <rect x="150" y="70" width="300" height="300" />}
          {L === 9 && <rect x="60" y="60" width="456" height="330" />}
        </clipPath>
      </defs>

      <rect width="600" height="800" fill={c.bg} />
      {pat > 0 && <rect width="600" height="800" fill={`url(#${pid})`} opacity=".16" />}

      {L === 0 && <g fill="none" stroke={c.ac}><rect x="24" y="24" width="552" height="752" strokeWidth="4" /><rect x="38" y="38" width="524" height="724" strokeWidth="1.5" /></g>}
      {L === 1 && <><path d="M108 432V210A192 192 0 0 1 492 210V432Z" fill="none" stroke={c.ac} strokeWidth="3" />{photo(120, 30, 360, 390)}</>}
      {L === 2 && <>{photo(0, 0, 600, 800)}<rect width="600" height="800" fill={`url(#${gid}o)`} /></>}
      {L === 3 && <><circle cx="300" cy="200" r="168" fill="none" stroke={c.ac} strokeWidth="3" />{photo(150, 50, 300, 300)}</>}
      {L === 4 && <>{photo(0, 0, 600, 430)}<circle cx="300" cy="365" r="46" fill={c.bg} stroke={c.ac} strokeWidth="4" /></>}
      {L === 5 && <g transform="rotate(-4 300 250)"><rect x="130" y="50" width="340" height="400" fill="#fff" stroke="#0002" />{photo(150, 70, 300, 300)}</g>}
      {L === 6 && <path d="M0 0H600V270Q450 340 300 285T0 300Z" fill={c.ac} />}
      {L === 7 && <g><rect width="14" height="800" fill={c.ac} /><circle cx="520" cy="120" r="160" fill="none" stroke={c.ac} strokeWidth="3" opacity=".3" /></g>}
      {L === 8 && <g><polygon points="0,0 200,0 0,200" fill={c.ac} /><polygon points="600,800 400,800 600,600" fill={c.ac} opacity=".8" /><circle cx="300" cy="270" r="118" fill={c.ac} opacity=".15" /><circle cx="300" cy="270" r="118" fill="none" stroke={c.ac} strokeWidth="3" /></g>}
      {L === 9 && <><rect x="84" y="84" width="456" height="330" fill="none" stroke={c.ac} strokeWidth="3" />{photo(60, 60, 456, 330)}<circle cx="524" cy="84" r="32" fill={c.bg} stroke={c.ac} strokeWidth="3" /></>}

      {MS[L].map(([x, yy, s, k], i) => (
        <g key={i} transform={`translate(${x},${yy}) scale(${s})`}>
          <Decor cat={cat} col={k === 'ac' ? c.ac : k === 'bg' ? c.bg : k} v={L === 7 ? 0 : v} s={s} />
        </g>
      ))}

      {tl.map((s, i) => <text key={i} {...T} y={sp.y + i * ts * 1.05} fontSize={ts} fill={tcol} style={st} onClick={pick('title')}>{s}</text>)}
      <text {...T} y={subY} fontSize="24" fill={acol} style={st} onClick={pick('sub')}>{t.sub}</text>
      {bl.map((s, i) => <text key={'b' + i} {...T} y={bodyY + i * 28} fontSize="20" fill={tcol} opacity=".85" style={sans} onClick={pick('body')}>{s}</text>)}
      <text {...T} y={nameY} fontSize="34" fill={tcol} style={st} onClick={pick('name')}>{t.name}</text>
      <text {...T} y={dateY} fontSize="20" fill={acol} style={sans} onClick={pick('date')}>{t.date}</text>
    </svg>
  )
}

// ---------- Church program layouts: multi-photo gallery + order of service ----------
export const SLOTS = { 10: 3, 11: 4, 12: 3, 13: 4, 14: 3 } // photo slots per program layout
const CFG = {
  10: { ty: 122, sy: 158, ls: 392, rh: 32 }, 11: { ty: 268, sy: 302, ls: 458, rh: 29 },
  12: { ty: 102, sy: 138, ls: 215, rh: 44 }, 13: { ty: 395, sy: 429, ls: 488, rh: 28 },
  14: { ty: 322, sy: 358, ls: 432, rh: 30 },
}

function ProgramCard({ d, id, onPick }) {
  const { layout: L, t, c, font, cat, pat = 0, imgs = [], program = [] } = d
  const uid = useId().replace(/:/g, '')
  const pid = 'p' + uid, gid = 'g' + uid
  const cfg = CFG[L]
  const pick = (k) => (onPick ? () => onPick(k) : undefined)
  const cur = onPick ? 'pointer' : 'default'
  const st = { cursor: cur, fontFamily: `'${font}',serif` }
  const sans = { ...st, fontFamily: 'Inter,sans-serif' }
  const ts = Math.max(22, Math.min(d.ts, 44, Math.floor(500 / (Math.max((t.title || '').length, 1) * 0.55))))

  const slot = (i, x, y, w, h, arch) => {
    const cid = `c${uid}${i}`
    const shape = arch ? `M${x} ${y + h}V${y + w / 2}A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2}V${y + h}Z` : null
    const k = Math.min(1, Math.min(w, h) / 130)
    return (
      <g key={i} onClick={pick('photo:' + i)} style={{ cursor: cur }}>
        <clipPath id={cid}>{arch ? <path d={shape} /> : <rect x={x} y={y} width={w} height={h} rx="6" />}</clipPath>
        <g clipPath={`url(#${cid})`}>
          {imgs[i] ? <image href={imgs[i]} x={x} y={y} width={w} height={h} preserveAspectRatio="xMidYMid slice" /> : (
            <g>
              <rect x={x} y={y} width={w} height={h} fill={`url(#${gid})`} />
              <g transform={`translate(${x + w / 2},${y + h / 2}) scale(${k})`} fill="#fff" opacity=".75">
                <path d="M-40 20L-14 -14L6 8L18 -6L40 20Z" /><circle cx="22" cy="-22" r="8" />
                {onPick && <text y="52" textAnchor="middle" fontSize="16" fontFamily="Inter,sans-serif">Photo {i + 1}</text>}
              </g>
            </g>
          )}
        </g>
        {arch ? <path d={shape} fill="none" stroke={c.ac} strokeWidth="2.5" /> : <rect x={x} y={y} width={w} height={h} rx="6" fill="none" stroke={c.ac} strokeWidth="2" />}
      </g>
    )
  }

  const rows = program.slice(0, 8)
  const lineup = (cx, y0, rh, side) => {
    const ctr = side === 'c'
    const tx = ctr ? cx - 14 : cx, ix = ctr ? cx + 14 : cx + 70
    const x1 = ctr ? 60 : cx - 4, x2 = ctr ? 540 : 570
    return (
      <g>
        <text x={ctr ? 300 : cx} y={y0 - 24} textAnchor={ctr ? 'middle' : 'start'} fontSize="18" letterSpacing="3" fill={c.ac} style={st} onClick={pick('lineup')}>{(t.lineup || '').toUpperCase()}</text>
        {rows.map((r, i) => (
          <g key={i} onClick={pick('program')} style={{ cursor: cur }}>
            <text x={tx} y={y0 + i * rh} textAnchor={ctr ? 'end' : 'start'} fontSize="17" fontWeight="700" fill={c.ac} style={sans}>{r.time}</text>
            <text x={ix} y={y0 + i * rh} fontSize="17" fill={c.tx} style={sans}>{r.item}</text>
            <line x1={x1} x2={x2} y1={y0 + i * rh + rh * 0.3} y2={y0 + i * rh + rh * 0.3} stroke={c.ac} opacity=".3" strokeDasharray="2 4" />
          </g>
        ))}
      </g>
    )
  }

  const motif = (x, y, s, badge) => (
    <g transform={`translate(${x},${y})`}>
      {badge && <circle r="30" fill={c.bg} stroke={c.ac} strokeWidth="3" />}
      <g transform={`scale(${s})`}><Motif cat={cat} col={c.ac} /></g>
    </g>
  )

  return (
    <svg id={id} viewBox="0 0 600 800" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id={pid} width="28" height="28" patternUnits="userSpaceOnUse">
          {pat === 1 && <circle cx="14" cy="14" r="2.2" fill={c.ac} />}
          {pat === 2 && <path d="M-4 32L32 -4" stroke={c.ac} strokeWidth="1.5" />}
          {pat === 3 && <path d="M14 8V20M8 14H20" stroke={c.ac} strokeWidth="1.5" />}
          {pat === 4 && <circle cx="14" cy="14" r="9" fill="none" stroke={c.ac} strokeWidth="1.2" />}
        </pattern>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={c.ac} /><stop offset="1" stopColor={c.bg} /></linearGradient>
      </defs>
      <rect width="600" height="800" fill={c.bg} />
      {pat > 0 && <rect width="600" height="800" fill={`url(#${pid})`} opacity=".16" />}

      {L === 10 && <>
        <rect x="20" y="20" width="560" height="760" fill="none" stroke={c.ac} strokeWidth="3" />
        {[0, 1, 2].map((i) => slot(i, 46 + i * 174, 185, 160, 130))}{motif(300, 62, 0.45)}
      </>}
      {L === 11 && <>
        {slot(0, 40, 36, 520, 190)}{[1, 2, 3].map((i) => slot(i, 40 + (i - 1) * 180, 326, 160, 76))}{motif(300, 226, 0.35, true)}
      </>}
      {L === 12 && <>
        <line x1="240" x2="240" y1="180" y2="664" stroke={c.ac} strokeWidth="2" />
        {[0, 1, 2].map((i) => slot(i, 36, 180 + i * 166, 190, 152))}{motif(300, 52, 0.45)}
      </>}
      {L === 13 && <>
        {slot(0, 36, 30, 258, 150)}{slot(1, 306, 30, 258, 150)}{slot(2, 36, 192, 258, 150)}{slot(3, 306, 192, 258, 150)}{motif(300, 186, 0.35, true)}
      </>}
      {L === 14 && <>
        {[0, 1, 2].map((i) => slot(i, 36 + i * 182, 40, 164, 200, true))}{motif(300, 272, 0.35)}
      </>}

      <text x="300" y={cfg.ty} textAnchor="middle" fontSize={ts} fill={c.tx} style={st} onClick={pick('title')}>{t.title}</text>
      <text x="300" y={cfg.sy} textAnchor="middle" fontSize="22" fill={c.ac} style={st} onClick={pick('sub')}>{t.sub}</text>
      {L === 12 ? lineup(252, cfg.ls, cfg.rh, 'r') : lineup(300, cfg.ls, cfg.rh, 'c')}
      <text x="300" y="726" textAnchor="middle" fontSize="30" fill={c.tx} style={st} onClick={pick('name')}>{t.name}</text>
      <text x="300" y="758" textAnchor="middle" fontSize="18" fill={c.ac} style={sans} onClick={pick('date')}>{t.date}</text>
    </svg>
  )
}

export default function Card(props) {
  return props.d.layout >= 10 ? <ProgramCard {...props} /> : <PlainCard {...props} />
}
