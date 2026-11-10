export const FONTS = ['Playfair Display', 'Great Vibes', 'Cinzel', 'Poppins', 'Lobster', 'Dancing Script', 'Abril Fatface', 'Bebas Neue']

export const CATS = [
  { id: 'birthday', name: 'Birthday Cards', h: 330, s: 80, def: { title: 'Happy Birthday', sub: 'Let’s celebrate!', body: 'Join us for cake, games and fun as we celebrate.', name: 'Tolu turns 30', date: 'Sat, 14 Dec · 4pm · Lagos' } },
  { id: 'wedding', name: 'Wedding Cards', h: 20, s: 55, def: { title: 'Wedding', sub: 'Together with their families', body: 'Request the honour of your presence at their wedding ceremony.', name: 'Ada & Femi', date: '12 April 2027 · 11am' } },
  { id: 'burial', name: 'Burial Programs', h: 35, s: 15, dark: 1, def: { title: 'In Loving Memory', sub: 'Celebration of Life', body: 'Gone but never forgotten. Rest in perfect peace.', name: 'Chief Samuel Okon', date: '1950 – 2026' } },
  { id: 'season', name: 'Season’s Greetings', h: 200, s: 70, def: { title: 'Season’s Greetings', sub: 'Merry Christmas & Happy New Year', body: 'Wishing you joy, peace and love this season.', name: 'The Ayotunde Family', date: '2026' } },
  { id: 'church', name: 'Church Programs', h: 230, s: 50, def: { title: 'Sunday Service', sub: 'Worship with us', body: 'Come and experience the presence of God. All are welcome.', name: 'Grace Chapel', date: 'Sun · 9am · Main Auditorium' } },
  { id: 'thanks', name: 'Thanks & Appreciation', h: 150, s: 55, def: { title: 'Thank You', sub: 'With heartfelt gratitude', body: 'Thank you for being part of our special day. We are grateful.', name: 'The Johnsons', date: 'With love' } },
  { id: 'grad', name: 'Graduation Parties', h: 260, s: 65, def: { title: 'Graduation Party', sub: 'Class of 2026', body: 'Come celebrate this big achievement with food and music.', name: 'Chidi Eze', date: '20 July · 3pm' } },
  { id: 'induct', name: 'Induction Parties', h: 45, s: 80, def: { title: 'Induction Ceremony', sub: 'You are invited', body: 'Join us as we welcome our new members into the fold.', name: 'Rotary Club Lagos', date: 'Fri, 5 Sept · 6pm' } },
]

const hsl = (h, s, l) => `hsl(${h % 360},${s}%,${l}%)`

// five colour moods: pastel, dark, vivid, cream duotone, jewel
export function palette(cat, i) {
  const h = cat.h + i * 37, s = cat.s
  const mode = cat.dark ? [1, 4][i % 2] : i % 5
  return [
    { bg: hsl(h, s * 0.6, 94), ac: hsl(h, s, 42), tx: hsl(h, 40, 15) },
    { bg: hsl(h, s * 0.5, 13), ac: hsl(h, s, 66), tx: hsl(h, 20, 93) },
    { bg: hsl(h, s, 40), ac: hsl(h + 30, 90, 82), tx: '#ffffff' },
    { bg: hsl(40, 40, 92), ac: hsl(h, s, 35), tx: hsl(h, 30, 18) },
    { bg: hsl(h, s * 0.8, 24), ac: hsl(h + 40, 70, 75), tx: hsl(h, 30, 95) },
  ][mode]
}

// Template n (0-49): layout = n % 10 (10 layouts), variant v = floor(n / 10) (5 variants)
// variant changes palette, font, background pattern and motif treatment
export function make(cat, n) {
  const l = n % 10, v = Math.floor(n / 10)
  return {
    cat: cat.id, layout: l, v, pat: v, img: null,
    t: { ...cat.def },
    c: palette(cat, (3 * l + v) % 10),
    font: FONTS[(n * 3 + v) % 8],
    ts: cat.id === 'wedding' || cat.id === 'thanks' ? 64 : 46,
  }
}

export function wrap(s, max) {
  const out = []
  let line = ''
  ;(s || '').split(' ').forEach((w) => {
    if ((line + ' ' + w).trim().length > max) { out.push(line); line = w }
    else line = (line + ' ' + w).trim()
  })
  if (line) out.push(line)
  return out
}

export function toHex(c) {
  if (c[0] === '#') return c
  const m = c.match(/[\d.]+/g).map(Number)
  const h = m[0], s = m[1] / 100, l = m[2] / 100
  const a = s * Math.min(l, 1 - l)
  const f = (n) => {
    const k = (n + h / 30) % 12
    return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)))).toString(16).padStart(2, '0')
  }
  return '#' + f(0) + f(8) + f(4)
}
