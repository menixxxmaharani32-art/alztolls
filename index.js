// ALZTOOLS - SATU FILE (index.js) UNTUK VERCEL. Tampilan dan backend ada di sini.
const express = require("express");
const dnsP = require('dns').promises;
const HTML = require('./home');

// AlzTools backend (Vercel Serverless). Semua host dan key diisi lewat Environment Variables di Vercel.
const SV = {
  tiktok:    { p: 'TT_DL',    allow: /(^|\.)tiktok\.com$/,    param: 'url',      kind: 'dl' },
  instagram: { p: 'IG_DL',    allow: /(^|\.)instagram\.com$/, param: 'url',      kind: 'dl' },
  ttstalk:   { p: 'TT_STALK', param: 'username', kind: 'st' },
  igstalk:   { p: 'IG_STALK', param: 'username', kind: 'st' },
  mediafire: { kind: 'bp' },
  youtube:   { kind: 'yt' },
};
const isUrl = v => typeof v === 'string' && /^https?:\/\//i.test(v);

function walk(d, k, f) {
  if (Array.isArray(d)) d.forEach(v => walk(v, k, f));
  else if (d && typeof d === 'object') for (const [kk, v] of Object.entries(d)) walk(v, kk.toLowerCase(), f);
  else if (isUrl(d)) f.push([k, d]);
}
function find(d, k) {
  if (!d || typeof d !== 'object') return null;
  for (const [kk, v] of Object.entries(d)) {
    if (kk.toLowerCase() === k) {
      if (v != null && typeof v !== 'object') return v;
      if (v && typeof v === 'object' && typeof v.count === 'number') return v.count;
    }
  }
  for (const v of Object.values(d)) { const r = find(v, k); if (r != null) return r; }
  return null;
}
const pick = (d, ks) => { for (const k of ks) { const r = find(d, k); if (r != null && r !== '') return r; } return null; };

function parseDl(data) {
  const found = []; walk(data, '', found);
  let video = null, audio = null, cover = null;
  const dd = (data && typeof data.data === 'object' && data.data) || data || {};
  if (isUrl(dd.play)) video = dd.play;
  if (isUrl(dd.music)) audio = dd.music;
  if (isUrl(dd.cover)) cover = dd.cover;
  for (const [k, x] of found) {
    let p = ''; try { p = new URL(x).pathname.toLowerCase(); } catch {}
    if (!audio && (/(music|audio|mp3|sound)/.test(k) || /\.(mp3|m4a)$/.test(p))) audio = x;
    else if (!video && (/(nowm|play|video|download|hdplay|src)/.test(k) || p.endsWith('.mp4'))) video = x;
    else if (!cover && /(cover|thumb|image|display)/.test(k)) cover = x;
  }
  if (!video && !audio) return null;
  return { title: pick(data, ['title', 'desc', 'caption']), cover, video, audio };
}
const AV_KEYS = ['avatarlarger', 'avatar_larger', 'profile_pic_url_hd', 'avatarmedium', 'avatar_medium', 'profile_pic_url', 'avatar', 'avatar_url', 'avatarthumb', 'avatar_thumb', 'profile_picture', 'profilepicture', 'profile_image'];
const fixAv = v => {
  if (typeof v !== 'string' || !v) return null;
  if (v.startsWith('//')) v = 'https:' + v;
  else if (v.startsWith('/')) v = 'https://www.tikwm.com' + v;
  v = v.replace(/^http:\/\//i, 'https://');
  return isUrl(v) ? v : null;
};
function parseSt(data) {
  const avatars = [];
  for (const k of AV_KEYS) { const a = fixAv(find(data, k)); if (a && !avatars.includes(a)) avatars.push(a); }
  const profile = {
    username: pick(data, ['unique_id', 'uniqueid', 'username', 'user_name']),
    name: pick(data, ['nickname', 'full_name', 'fullname', 'name']),
    avatar: avatars[0] || null,
    avatars,
    bio: pick(data, ['signature', 'biography', 'bio', 'description']),
    followers: pick(data, ['followercount', 'follower_count', 'followers', 'edge_followed_by']),
    following: pick(data, ['followingcount', 'following_count', 'following', 'edge_follow']),
    posts: pick(data, ['videocount', 'video_count', 'media_count', 'posts', 'edge_owner_to_timeline_media']),
  };
  if (!profile.username && !profile.name && profile.followers == null) return null;
  return { profile };
}

// Tambahkan alamat gambar (proxy berlapis) ke profil. Peramban memuat /img, server yang mencari foto lewat beberapa jalur.
function withAv(p, user, action) {
  const c = (p.avatars && p.avatars.length ? p.avatars : (p.avatar ? [p.avatar] : [])).slice(0, 3);
  const qs = c.map(x => 'u=' + encodeURIComponent(x));
  qs.push('p=' + (action === 'igstalk' ? 'ig' : 'tt'), 'n=' + encodeURIComponent(user));
  const { avatars, ...rest } = p;
  return { ...rest, avatar: c[0] || null, avatar_src: '/img?' + qs.join('&') };
}

// Coba satu API RapidAPI. cfg = { host, path, param }. Dipakai oleh env (PREFIX_HOST ...) dan oleh preset bawaan.
async function attemptCfg(cfg, key, sv, val, env) {
  const host = String(cfg.host || '').trim().replace(/^https?:\/\//i, '').replace(/\/.*$/, '');
  if (!key) return { err: 'RAPIDAPI_KEY belum diisi di Vercel.', code: 500 };
  let path = String(cfg.path || '/').trim().replace(/^https?:\/\/[^/]+/i, '');
  if (!path.startsWith('/')) path = '/' + path;
  const param = cfg.param || sv.param;
  const url = path.includes('{q}')
    ? 'https://' + host + path.replace('{q}', encodeURIComponent(val))
    : 'https://' + host + path + (path.includes('?') ? '&' : '?') + param + '=' + encodeURIComponent(val);
  let r, data;
  try {
    r = await fetch(url, { headers: { 'X-RapidAPI-Key': key, 'X-RapidAPI-Host': host }, signal: AbortSignal.timeout(8000) });
    data = await r.json().catch(() => null);
  } catch (e) {
    return { err: 'Tidak bisa terhubung ke RapidAPI.', code: 502 };
  }
  if (!r.ok || !data) {
    const msg = r.status === 403 ? 'Belum berlangganan API ini di RapidAPI.'
      : r.status === 429 ? 'Kuota atau batas permintaan habis.'
      : 'API bermasalah (kode ' + r.status + ').';
    return { err: msg, code: r.status };
  }
  const out = sv.kind === 'dl' ? parseDl(data) : parseSt(data);
  if (!out) return { err: 'Data tidak ditemukan.', code: 404, raw: env.DEBUG === '1' ? data : undefined };
  return { out };
}
// Coba satu API dari env. pfx contoh: TT_DL, TT_DL2 ... TT_DL6 (masing-masing _HOST, _PATH, _PARAM, _KEY)
const attempt = (pfx, sv, val, env) => attemptCfg({ host: env[pfx + '_HOST'], path: env[pfx + '_PATH'], param: env[pfx + '_PARAM'] }, env[pfx + '_KEY'] || env.RAPIDAPI_KEY, sv, val, env);
// Preset RapidAPI bawaan: otomatis dicoba SETELAH sumber tanpa key, hanya kalau RAPIDAPI_KEY terisi. Kalau belum subscribe API-nya, hasilnya 403 dan langsung dilewati.
// Matikan dengan RAPID_PRESET=0. (Nama host/path ditulis dari ingatan, ganti lewat env PREFIX_HOST kalau berbeda.)
const RAPID_PRESET = {
  tiktok:    [{ host: 'tiktok-scraper7.p.rapidapi.com', path: '/', param: 'url' }, { host: 'tiktok-video-no-watermark2.p.rapidapi.com', path: '/', param: 'url' }],
  ttstalk:   [{ host: 'tiktok-scraper7.p.rapidapi.com', path: '/user/info', param: 'unique_id' }, { host: 'tiktok-api23.p.rapidapi.com', path: '/api/user/info', param: 'uniqueId' }],
  instagram: [{ host: 'instagram-downloader-download-instagram-videos-stories.p.rapidapi.com', path: '/index', param: 'url' }, { host: 'instagram-scraper-api2.p.rapidapi.com', path: '/v1/post_info', param: 'code_or_id_or_url' }],
  igstalk:   [{ host: 'instagram-scraper-api2.p.rapidapi.com', path: '/v1/info', param: 'username_or_id_or_url' }, { host: 'instagram-looter2.p.rapidapi.com', path: '/profile', param: 'username' }],
};

// ===== Sumber TANPA KEY (dicoba lebih dulu, hemat kuota RapidAPI). Matikan dengan KEYLESS=0 =====
let TTLIB = null;
try { TTLIB = require('@tobyg74/tiktok-api-dl'); } catch (e) {}
const withTimeout = (p, ms) => Promise.race([p, new Promise((_, rj) => setTimeout(() => rj(new Error('timeout')), ms))]);
const first = v => Array.isArray(v) ? v[0] : v;
const tw = x => (!x ? null : String(x).startsWith('/') ? 'https://www.tikwm.com' + x : x);

const ttlibDl = ver => async u => {
  if (!TTLIB) return null;
  const r = await withTimeout(TTLIB.Downloader(u, { version: ver }), 9000);
  if (!r || r.status !== 'success' || !r.result) return null;
  const x = r.result;
  const video = ver === 'v3' ? (x.videoHD || x.videoWatermark) : first(x.video && x.video.playAddr) || x.direct;
  const audio = typeof x.music === 'string' ? x.music : first(x.music && x.music.playUrl);
  if (!video && !audio) return null;
  return { title: x.desc || null, cover: first(x.cover) || first(x.video && x.video.cover) || (x.author && x.author.avatar) || null, video: video || null, audio: audio || null };
};
const KEYLESS = {
  tiktok: [
    ['tikwm', async u => {
      const r = await fetch('https://www.tikwm.com/api/?hd=1&url=' + encodeURIComponent(u), { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(7000) });
      const d = (await r.json()).data;
      if (!d) return null;
      const video = tw(d.play || d.hdplay), audio = tw(d.music);
      return (video || audio) ? { title: d.title || null, cover: tw(d.cover), video, audio } : null;
    }],
    ['ttlib-v3', ttlibDl('v3')],
    ['ttlib-v1', ttlibDl('v1')],
    ['ttlib-v2', ttlibDl('v2')],
  ],
  ttstalk: [
    ['tikwm', async u => {
      const r = await fetch('https://www.tikwm.com/api/user/info?unique_id=' + encodeURIComponent(u), { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(7000) });
      const d = (await r.json()).data;
      return d ? parseSt(d) : null;
    }],
    ['ttlib-stalk', async u => {
      if (!TTLIB) return null;
      const r = await withTimeout(TTLIB.StalkUser(u), 9000);
      if (!r || r.status !== 'success' || !r.result) return null;
      const a = r.result.user || {}, b = r.result.stats || {};
      const avs = [a.avatarLarger, a.avatarMedium, a.avatar, a.avatarThumb].map(fixAv).filter((x, i, arr) => x && arr.indexOf(x) === i);
      return { profile: { username: a.username, name: a.nickname, avatar: avs[0] || null, avatars: avs, bio: a.signature, followers: b.followerCount, following: b.followingCount, posts: b.videoCount } };
    }],
  ],
};

// ===== Tambahan sumber TANPA KEY untuk TikTok + Instagram (semua dijalankan BERSAMAAN, yang valid pertama dipakai) =====
// Tambah sendiri lewat env tanpa ubah kode (pisah koma, pakai {u} untuk link/username ter-encode):
//   TT_DL_FREE, IG_DL_FREE, TT_STALK_FREE, IG_STALK_FREE   contoh: IG_DL_FREE=https://api.contoh.com/igdl?url={u}
let BTCH = null;
try { BTCH = require('btch-downloader'); } catch (e) {}
function parseDlIg(data) {
  const r = parseDl(data); if (r) return r;
  const found = []; walk(data, '', found);
  const isImg = x => /\.(jpe?g|png|webp|gif|heic)(\?|$)/i.test(x) || /(thumb|cover|avatar|profile|image|poster|preview)/i.test(x);
  const c = found.find(([k, x]) => /(url|link|download|media|src)/.test(k) && !isImg(x) && !/instagram\.com\/(p|reel|tv)\//i.test(x));
  if (!c) return null;
  const cv = found.find(([k, x]) => isImg(x) && /(thumb|cover|image|poster|preview|display)/.test(k + x));
  return { title: pick(data, ['title', 'caption', 'desc']), cover: cv ? cv[1] : null, video: c[1], audio: null };
}
const klGet = (tpl, hdr, ms) => async u => {
  const r = await fetch(tpl.replace('{u}', encodeURIComponent(u)), { headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json', ...(hdr || {}) }, signal: AbortSignal.timeout(ms || 7000) });
  const d = await r.json().catch(() => null);
  if (!d) throw new Error('kode ' + r.status);
  return d;
};
const hostOf = t => { try { return new URL(t.replace('{u}', 'x')).hostname; } catch (e) { return 'env'; } };
const tplDl = (n, t, ig) => [n, async u => (ig ? parseDlIg : parseDl)(await klGet(t)(u))];
const tplSt = (n, t) => [n, async u => parseSt(await klGet(t)(u))];
const IG_APP = { 'x-ig-app-id': '936619743392459', 'User-Agent': 'Instagram 76.0.0.15.395 Android (24/7.0; 640dpi; 1440x2560; samsung; SM-G930F; herolte; samsungexynos8890; en_US; 138226743)', Accept: '*/*' };
const libDl = (lib, fn, ig) => async u => {
  if (!BTCH || !BTCH[fn]) return null;
  const r = await withTimeout(BTCH[fn](u), 9000);
  return r ? (ig ? parseDlIg : parseDl)(r) : null;
};
KEYLESS.tiktok.push(
  tplDl('siputzx-tt', 'https://api.siputzx.my.id/api/d/tiktok?url={u}'),
  tplDl('ryzumi-tt', 'https://api.ryzumi.vip/api/downloader/ttdl?url={u}'),
  tplDl('vreden-tt', 'https://api.vreden.my.id/api/tiktok?url={u}'),
  tplDl('nekolabs-tt', 'https://api.nekolabs.web.id/downloader/tiktok?url={u}'),
  ['btch-tt', libDl('btch', 'ttdl')],
);
KEYLESS.ttstalk.push(
  tplSt('siputzx-ttstalk', 'https://api.siputzx.my.id/api/stalk/tiktok?username={u}'),
  tplSt('ryzumi-ttstalk', 'https://api.ryzumi.vip/api/stalk/tiktok?username={u}'),
  tplSt('vreden-ttstalk', 'https://api.vreden.my.id/api/ttstalk?query={u}'),
);
KEYLESS.instagram = [
  tplDl('siputzx-ig', 'https://api.siputzx.my.id/api/d/igdl?url={u}', true),
  tplDl('ryzumi-ig', 'https://api.ryzumi.vip/api/downloader/igdl?url={u}', true),
  tplDl('vreden-ig', 'https://api.vreden.my.id/api/igdownload?url={u}', true),
  tplDl('nekolabs-ig', 'https://api.nekolabs.web.id/downloader/instagram?url={u}', true),
  tplDl('agatz-ig', 'https://api.agatz.xyz/api/instagram?url={u}', true),
  ['btch-ig', libDl('btch', 'igdl', true)],
];
KEYLESS.igstalk = [
  ['ig-web', async u => {
    const d = await klGet('https://i.instagram.com/api/v1/users/web_profile_info/?username={u}', IG_APP)(u);
    const x = d && d.data && d.data.user;
    return x ? parseSt(x) : null;
  }],
  tplSt('siputzx-igstalk', 'https://api.siputzx.my.id/api/stalk/instagram?username={u}'),
  tplSt('ryzumi-igstalk', 'https://api.ryzumi.vip/api/stalk/instagram?username={u}'),
  tplSt('vreden-igstalk', 'https://api.vreden.my.id/api/igstalk?query={u}'),
];
// Gabungkan sumber bawaan + sumber tambahan dari env.
function keylessFor(sv, action, env) {
  const extra = String(env[sv.p + '_FREE'] || '').split(',').map(x => x.trim()).filter(x => /^https?:\/\//i.test(x) && x.includes('{u}'));
  const mk = sv.kind === 'dl' ? (n, t) => tplDl(n, t, action === 'instagram') : tplSt;
  return [...(KEYLESS[action] || []), ...extra.map(t => mk('env:' + hostOf(t), t))];
}

// Ubah link pendek TikTok (vt./vm.) menjadi link video lengkap, karena sebagian API hanya menerima link lengkap.
async function expandTT(u) {
  try {
    const x = new URL(u), h = x.hostname.toLowerCase();
    if (!(/^(vt|vm)\./.test(h) || /^\/t\//.test(x.pathname))) return u;
    const r = await fetch(u, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(5000) });
    const f = new URL(r.url);
    if (/\/video\/\d+/.test(f.pathname)) return f.origin + f.pathname;
  } catch (e) {}
  return u;
}

// ===== Lewati sfl.gl: beberapa API dijalankan BERSAMAAN, hasil pertama yang valid dipakai, sisanya dibatalkan =====
// Bawaan: mesin 'native' (alur gerbang SafelinkU langsung dari server, tanpa API pihak ketiga) + instance publik Xenox sebagai cadangan. Tambah cadangan lewat env SFL_API1_URL ... SFL_API6_URL (lihat README di bawah).
//   SFL_APIn_URL     alamat API. Pakai {u} untuk link ter-encode. GET: kalau tidak ada {u}, ?url=... ditambahkan otomatis.
//   SFL_APIn_METHOD  GET (default) atau POST
//   SFL_APIn_HEADERS JSON header, contoh {"Authorization":"Bearer KEY"}
//   SFL_APIn_BODY    body POST, default {"url":"{raw}"}   ({raw} = link asli, {u} = ter-encode)
//   SFL_BUILTIN=0    matikan API bawaan.   SFL_TIMEOUT_MS  batas total (default 55000)
const SFL_HOST = /(^|\.)(sfl\.gl|safelinku\.com|idsly\.com|idsly\.bid)$/i;
const SFL_BUILTIN = [
  { name: 'native', native: true },
  { name: 'xenox', url: 'https://bypass-url-omega.vercel.app/api/mgvt?url={u}', method: 'GET', headers: {} },
  { name: 'ikyyxd', url: 'https://api.ikyyxd.my.id/tools/skiplink/sfl?url={u}', method: 'GET', headers: {} },
  { name: 'xenox2', url: 'https://bypass-url-omega.vercel.app/api?url={u}', method: 'GET', headers: {} },
];
function sflEngines(env) {
  const list = env.SFL_BUILTIN === '0' ? [] : SFL_BUILTIN.slice();
  for (let i = 1; i <= 6; i++) {
    const url = env['SFL_API' + i + '_URL'];
    if (!url) continue;
    let headers = {}; try { headers = JSON.parse(env['SFL_API' + i + '_HEADERS'] || '{}'); } catch (e) {}
    list.push({ name: 'api' + i, url, method: String(env['SFL_API' + i + '_METHOD'] || 'GET').toUpperCase(), headers, body: env['SFL_API' + i + '_BODY'] || '{"url":"{raw}"}' });
  }
  return list;
}
// Ambil tautan tujuan dari JSON apa pun: abaikan link sfl.gl & host API itu sendiri, utamakan MediaFire dan key bernama bypassed/destination/dst.
function sflPick(data, apiHost) {
  const found = []; walk(data, '', found);
  const ok = found.filter(([k, x]) => { try { const h = new URL(x).hostname.toLowerCase(); return !SFL_HOST.test(h) && h !== apiHost; } catch (e) { return false; } });
  const score = ([k, x]) => (/mediafire\.com/i.test(x) ? 100 : 0) + (/(bypass|destination|target|final|direct|resolved|result|dst)/.test(k) ? 10 : 0) - (/(source|original|input|origin)/.test(k) ? 50 : 0);
  ok.sort((a, b) => score(b) - score(a));
  return ok.length ? ok[0][1] : null;
}
// --- Mesin native: ikuti gerbang SafelinkU (ray_id/alias -> redirect.php -> /api/session -> /api/verify -> /api/go), rantai sfl.gl -> perantara -> tujuan ---
const sflSleep = (ms, signal) => new Promise((ok, no) => { const t = setTimeout(ok, ms); if (signal) signal.addEventListener('abort', () => { clearTimeout(t); no(new Error('dibatalkan')); }, { once: true }); });
function sflJar() {
  const m = new Map();
  return {
    set(h) { const l = typeof h.getSetCookie === 'function' ? h.getSetCookie() : (h.get('set-cookie') ? [h.get('set-cookie')] : []); for (const s of l) { const p = String(s).split(';')[0], i = p.indexOf('='); if (i > 0) m.set(p.slice(0, i).trim(), p.slice(i + 1).trim()); } },
    get: k => m.get(k),
    header: () => [...m].map(([k, v]) => k + '=' + v).join('; '),
  };
}
async function sflFetch(url, o, jar, signal) {
  let method = o.method || 'GET', body = o.body, cur = url;
  const h = { 'User-Agent': UA_D, 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8', 'Accept-Language': 'en-US,en;q=0.9', ...(o.headers || {}) };
  for (let n = 0; n < 10; n++) {
    const ck = jar.header(); if (ck) h.Cookie = ck;
    const r = await fetch(cur, { method, headers: h, body, redirect: 'manual', signal });
    jar.set(r.headers);
    const loc = r.status >= 300 && r.status < 400 && r.headers.get('location');
    if (loc) { h.Referer = cur; cur = new URL(loc, cur).href; method = 'GET'; body = undefined; delete h['Content-Type']; continue; }
    r.finalUrl = cur; return r;
  }
  throw new Error('terlalu banyak pengalihan');
}
function sflToken(xsrf) {
  let x = String(xsrf); try { x = decodeURIComponent(x); } catch (e) {}
  const fp = crypto.createHash('sha256').update('webgl:ANGLE (Intel, Intel(R) UHD Graphics Direct3D11 vs_5_0 ps_5_0, D3D11)||audio:12.345678901234||canvas:abcdef123||fonts:20/25||system:8CPU,8GB,Win32,0,1,0||env:Asia/Jakarta,1920,1080,24,en-US||network:4g,10,50').digest('hex');
  const o = '#' + Buffer.from(fp).toString('base64');
  return x.slice(0, 128 - o.length) + o;
}
async function sflHop(pageUrl, html, jar, signal) {
  const inp = n => { const t = html.match(new RegExp('<input[^>]*name=["\']' + n + '["\'][^>]*>', 'i')), v = t && /value=["\']([^"\']*)["\']/i.exec(t[0]); return v ? v[1] : null; };
  const form = html.match(/<form[^>]+action=["']([^"']+)["']/i), ray = inp('ray_id'), alias = inp('alias');
  if (!form || !ray || !alias) throw new Error('gerbang tidak dikenali');
  const pa = new URL(form[1], pageUrl), origin = pa.protocol + '//' + pa.host;
  const r2 = await sflFetch(origin + '/redirect.php?ray_id=' + encodeURIComponent(ray) + '&alias=' + encodeURIComponent(alias), { headers: { Referer: pageUrl } }, jar, signal);
  const page1 = r2.finalUrl, x1 = jar.get('XSRF-TOKEN');
  if (!x1) throw new Error('XSRF-TOKEN tidak ada (kemungkinan diblokir)');
  const hd = { Origin: origin, Referer: page1, 'Content-Type': 'application/json', Accept: 'application/json, text/plain, */*', 'X-Requested-With': 'XMLHttpRequest' };
  const post = (path, obj) => sflFetch(origin + path, { method: 'POST', headers: hd, body: JSON.stringify(obj) }, jar, signal);
  const s1 = await (await post('/api/session', { _token: sflToken(x1) })).json().catch(() => ({}));
  let page2 = page1;
  if ((s1.step || 1) === 1) {
    await sflSleep(800, signal);
    const v = await (await post('/api/verify', { _a: 0, captcha: null, passcode: null })).json().catch(() => ({}));
    let target = v.target || '/redirect.php'; if (target.startsWith('/')) target = origin + target;
    const r3 = await sflFetch(target, { headers: { Referer: page1 } }, jar, signal);
    page2 = r3.finalUrl; hd.Referer = page2;
    await post('/api/session', { _token: sflToken(jar.get('XSRF-TOKEN') || x1) });
  }
  await sflSleep(1500, signal);
  hd.Referer = page2;
  const key = 500, go = await (await post('/api/go', { key, size: (1920 + key) * 2 + '.' + (1080 + key) * 2 })).json().catch(() => null);
  if (!go || !go.url) throw new Error('/api/go tidak memberi tautan');
  const ready = /^https?:\/\//i.test(go.url) ? go.url : new URL(go.url, origin).href;
  const rr = await sflFetch(ready, { headers: { Referer: page2 } }, jar, signal), body = await rr.text();
  const d = body.match(/window\.location\.href\s*=\s*["']([^"']+)["']/i);
  return d ? d[1].replace(/\\\//g, '/').replace(/\\u0026/g, '&') : ready;
}
async function sflNative(raw, signal) {
  let cur = raw; const seen = new Set();
  for (let hop = 0; hop < 8; hop++) {
    if (seen.has(cur)) break; seen.add(cur);
    const jar = sflJar(), r = await sflFetch(cur, {}, jar, signal); cur = r.finalUrl || cur;
    const html = await r.text();
    if (/name=["']ray_id["']|redirect\.php/i.test(html)) {
      const dest = await sflHop(cur, html, jar, signal);
      if (!dest || dest === cur) throw new Error('gerbang tidak memberi tujuan');
      cur = dest;
      if (/(^|\.)mediafire\.com$/i.test(new URL(cur).hostname)) return cur;
      continue;
    }
    const mr = html.match(/<meta[^>]+http-equiv=["']refresh["'][^>]+content=["'][^"']*url=([^"']+)["']/i);
    if (mr) { cur = new URL(mr[1].trim(), cur).href; continue; }
    break;
  }
  if (cur === raw || SFL_HOST.test(new URL(cur).hostname)) throw new Error('tidak bisa melewati gerbang');
  return cur;
}
async function sflRun(e, raw, signal) {
  if (e.native) return sflNative(raw, signal);
  const u = encodeURIComponent(raw);
  let url = e.url.replace('{u}', u);
  if (e.method === 'GET' && !e.url.includes('{u}')) url += (url.includes('?') ? '&' : '?') + 'url=' + u;
  const init = { method: e.method, headers: { 'User-Agent': UA_D, 'Accept': 'application/json', ...e.headers }, signal };
  if (e.method === 'POST') {
    init.body = e.body.replace('{raw}', JSON.stringify(raw).slice(1, -1)).replace('{u}', u);
    if (!init.headers['Content-Type']) init.headers['Content-Type'] = 'application/json';
  }
  const r = await fetch(url, init);
  let data = null; try { data = JSON.parse(await r.text()); } catch (er) {}
  if (!data) throw new Error('balasan bukan JSON (kode ' + r.status + ')');
  if (data.status === false || data.success === false || data.ok === false) throw new Error(String(data.error || data.message || 'ditolak API'));
  const out = sflPick(data, new URL(url).hostname.toLowerCase());
  if (!out) throw new Error('tautan tujuan tidak ditemukan' + (data.error ? ': ' + data.error : ''));
  return out;
}
async function sflHandle(raw, env, send) {
  let host = ''; try { host = new URL(raw).hostname.toLowerCase(); } catch (e) {}
  if (!SFL_HOST.test(host)) return send(400, { ok: false, error: 'Tautan harus dari sfl.gl.' });
  const engs = sflEngines(env);
  if (!engs.length) return send(500, { ok: false, error: 'Layanan lagi down, coba lagi nanti ya.' });
  const ac = new AbortController(), timer = setTimeout(() => ac.abort(), +env.SFL_TIMEOUT_MS || 55000), errs = [];
  try {
    const hit = await Promise.any(engs.map(async e => {
      try { return { via: e.name, url: await sflRun(e, raw, ac.signal) }; }
      catch (er) { errs.push(e.name + ': ' + ((er && er.message) || er)); throw er; }
    }));
    ac.abort();
    return send(200, { ok: true, url: hit.url, host: new URL(hit.url).hostname, ...(env.DEBUG === '1' ? { via: hit.via, tried: errs } : {}) });
  } catch (e) {
    return send(502, { ok: false, error: 'Layanan lagi down, coba lagi nanti ya.', ...(env.DEBUG === '1' ? { tried: errs } : {}) });
  } finally { clearTimeout(timer); }
}

// ===== YouTube Clip: banyak sumber TANPA KEY dijalankan BERSAMAAN, hasil valid pertama dipakai, sisanya dibatalkan =====
// Sumber: (1) Innertube YouTube langsung dengan 5 klien berbeda, (2) puluhan instance Piped + Invidious (daftar otomatis + bawaan),
//         (3) Cobalt (opsional lewat env), (4) @distube/ytdl-core (opsional). Instance publik sering mati, jadi sengaja dibuat banyak.
// Ada 2 mode:
//   ?action=youtube&info=1&url=...   cepat, hanya judul + cover + DURASI (dipakai untuk menyesuaikan slider otomatis)
//   ?action=youtube&q=720&url=...    ambil link video/audio untuk klip
// Env opsional (tanpa ubah kode):
//   YT_PIPED=host1,host2   YT_INVIDIOUS=host1,host2   host tambahan (tanpa https://)
//   YT_COBALT=https://a,https://b   instance Cobalt (POST /).  YT_COBALT_KEY=kunci  (header Authorization: Api-Key ...)
//   YT_BUILTIN=0 matikan sumber bawaan.  YT_AUTO=0 matikan daftar instance otomatis.
//   YT_TIMEOUT_MS (default 9000)  YT_INFO_TIMEOUT_MS (default 6500)  DEBUG=1 tampilkan sumber mana yang berhasil
const YT_HOST = /(^|\.)(youtube\.com|youtube-nocookie\.com|youtu\.be)$/i;
const YT_PIPED = ['pipedapi.kavin.rocks', 'pipedapi-libre.kavin.rocks', 'pipedapi.leptons.xyz', 'pipedapi.nosebs.ru', 'piped-api.privacy.com.de', 'pipedapi.adminforge.de', 'api.piped.yt', 'pipedapi.drgns.space', 'pipedapi.owo.si', 'pipedapi.ducks.party', 'piped-api.codespace.cz', 'pipedapi.reallyaweso.me', 'api.piped.private.coffee', 'pipedapi.darkness.services', 'pipedapi.orangenet.cc'];
const YT_INV = ['inv.nadeko.net', 'yewtu.be', 'invidious.nerdvpn.de', 'invidious.privacyredirect.com'];
let YTDL = null;
try { YTDL = require('@distube/ytdl-core'); } catch (e) {}

function ytId(raw) {
  let x; try { x = new URL(raw); } catch (e) { return null; }
  const h = x.hostname.toLowerCase();
  if (!YT_HOST.test(h)) return null;
  const id = /(^|\.)youtu\.be$/.test(h) ? x.pathname.slice(1).split('/')[0]
    : (x.searchParams.get('v') || (x.pathname.match(/^\/(?:shorts|embed|live|v)\/([^/?#]+)/) || [])[1]);
  return /^[A-Za-z0-9_-]{11}$/.test(id || '') ? id : null;
}
const hOf = s => parseInt(String(s || '').replace(/\D.*$/, ''), 10) || 0; // '720p60' -> 720
// Pilih stream gabungan (video + suara) dengan tinggi paling dekat di bawah permintaan; kalau tidak ada, yang terendah.
function ytBest(list, want) {
  const ok = list.filter(x => isUrl(x.url));
  if (!ok.length) return null;
  const under = ok.filter(x => x.h <= want).sort((a, b) => b.h - a.h);
  return (under[0] || ok.sort((a, b) => a.h - b.h)[0]).url;
}
const ytHead = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', 'Accept': 'application/json' };
const ytTh = d => { const t = d || []; return t.length ? t[t.length - 1].url : null; };

// Setiap sumber punya tanda tangan sama: fn(id, want, signal, raw, mo). mo = true -> cukup judul/cover/durasi.
const ytPiped = host => async (id, want, signal, raw, mo) => {
  const r = await fetch('https://' + host + '/streams/' + id, { headers: ytHead, signal });
  const d = await r.json().catch(() => null);
  if (!d || d.error || !d.title) throw new Error((d && (d.message || d.error)) || 'kode ' + r.status);
  const meta = { title: d.title, cover: d.thumbnailUrl || null, duration: +d.duration || null };
  if (mo) return meta;
  const vids = (d.videoStreams || []).filter(x => !x.videoOnly && /mp4/i.test(x.mimeType || x.format || '')).map(x => ({ url: x.url, h: hOf(x.quality) }));
  const aud = (d.audioStreams || []).filter(x => /mp4|m4a/i.test(x.mimeType || x.format || '')).sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))[0];
  const video = ytBest(vids, want);
  if (!video && !aud) throw new Error('stream kosong');
  return { ...meta, video, audio: aud ? aud.url : null };
};
const ytInv = host => async (id, want, signal, raw, mo) => {
  const base = 'https://' + host, abs = u => (!u ? null : String(u).startsWith('/') ? base + u : u);
  const r = await fetch(base + '/api/v1/videos/' + id + '?local=true', { headers: ytHead, signal });
  const d = await r.json().catch(() => null);
  if (!d || d.error || !d.title) throw new Error((d && d.error) || 'kode ' + r.status);
  const th = (d.videoThumbnails || []).find(t => t.quality === 'high' || t.quality === 'medium');
  const meta = { title: d.title, cover: abs(th && th.url), duration: +d.lengthSeconds || null };
  if (mo) return meta;
  const vids = (d.formatStreams || []).filter(x => !x.container || x.container === 'mp4').map(x => ({ url: abs(x.url), h: hOf(x.qualityLabel || x.quality) }));
  const aud = (d.adaptiveFormats || []).filter(x => /^audio\/mp4/.test(x.type || '')).sort((a, b) => (+b.bitrate || 0) - (+a.bitrate || 0))[0];
  const video = ytBest(vids, want);
  if (!video && !aud) throw new Error('stream kosong');
  return { ...meta, video, audio: aud ? abs(aud.url) : null };
};
const ytCobalt = (b, key) => async (id, want, signal, raw, mo) => {
  if (mo) throw new Error('cobalt tidak punya info durasi');
  const hd = { ...ytHead, 'Content-Type': 'application/json' };
  if (key) hd.Authorization = 'Api-Key ' + key;
  const r = await fetch(b.replace(/\/+$/, '') + '/', { method: 'POST', headers: hd, body: JSON.stringify({ url: raw, videoQuality: String(want), downloadMode: 'auto' }), signal });
  const d = await r.json().catch(() => null);
  if (!d || d.status === 'error' || !isUrl(d.url)) throw new Error((d && d.error && (d.error.code || d.error)) || 'kode ' + r.status);
  return { title: d.filename || null, cover: null, duration: null, video: d.url, audio: null };
};

// --- RapidAPI YouTube (paling stabil, memakai RAPIDAPI_KEY yang sudah ada). Isi YT_RAPID_HOST + YT_RAPID_PATH di Vercel. ---
// Contoh: YT_RAPID_HOST=yt-api.p.rapidapi.com  YT_RAPID_PATH=/dl?id={id}
//         YT_RAPID2_HOST=youtube-media-downloader.p.rapidapi.com  YT_RAPID2_PATH=/v2/video/details?videoId={id}
// Bisa sampai 3 API (YT_RAPID, YT_RAPID2, YT_RAPID3); kunci per API lewat YT_RAPIDn_KEY, kalau kosong pakai RAPIDAPI_KEY.
// Kalau PATH hanya memberi info video (tanpa link), isi YT_RAPID_DL dengan path endpoint unduhan, boleh pakai {id} dan {q} (kualitas, mis. 720).
const ytRapid = (host, path, key, dl) => async (id, want, signal, raw, mo) => {
  if (mo) throw new Error('hemat kuota, tidak dipakai untuk info');
  // Link halaman YouTube / gambar bukan file unduhan, jangan pernah dipakai.
  const bad = u => /^https?:\/\/([a-z0-9-]+\.)*(youtube\.com|youtu\.be|ytimg\.com|ggpht\.com)(\/|$|:)/i.test(u);
  host = String(host || '').trim().replace(/^https?:\/\//i, '').replace(/\/.*$/, '');
  const norm = p => { p = String(p || '').trim().replace(/^https?:\/\/[^/]+/i, ''); return p.startsWith('/') ? p : '/' + p; };
  const call = async p => {
    p = norm(p);
    let r;
    try {
      r = await fetch('https://' + host + p.replace('{id}', encodeURIComponent(id)).replace('{q}', String(want)), { headers: { 'X-RapidAPI-Key': key, 'X-RapidAPI-Host': host }, signal });
    } catch (e) {
      const c = e && e.cause;
      throw new Error((e && e.name === 'AbortError' ? 'waktu habis' : 'gagal terhubung (' + ((c && (c.code || c.message)) || (e && e.message) || 'error') + ')') + ' ke ' + host + p.split('?')[0]);
    }
    const d = await r.json().catch(() => null);
    if (!r.ok || !d) throw new Error(r.status === 403 ? 'belum berlangganan API ini' : r.status === 429 ? 'kuota habis' : 'kode ' + r.status);
    return d.data && typeof d.data === 'object' && !Array.isArray(d.data) ? d.data : d;
  };
  const pull = x => {
    const fm = [].concat(x.formats || [], (x.videos && x.videos.items) || []);
    const vids = fm.filter(f => f && isUrl(f.url) && !bad(f.url) && f.hasAudio !== false && !/audio\//i.test(f.mimeType || '') && (!(f.mimeType || f.extension || f.mime) || /mp4/i.test(f.mimeType || f.extension || f.mime))).map(f => ({ url: f.url, h: f.height || hOf(f.qualityLabel || f.quality) }));
    const am = [].concat((x.adaptiveFormats || []).filter(f => /^audio\/mp4/i.test(f.mimeType || '')), ((x.audios && x.audios.items) || []).filter(f => /m4a|mp4/i.test(f.extension || f.mimeType || '')));
    const aud = am.filter(f => f && isUrl(f.url) && !bad(f.url)).sort((a, b) => (+b.bitrate || +b.averageBitrate || 0) - (+a.bitrate || +a.averageBitrate || 0))[0];
    let video = ytBest(vids, want), audio = aud ? aud.url : null;
    if (!video && !audio) {
      // Bentuk data tidak dikenal: cari sendiri semua link di dalam JSON dan tebak video/audio dari nama kunci atau jenis berkas.
      const fnd = []; walk(x, '', fnd);
      const ok = fnd.filter(([k, u]) => !bad(u) && !/\.(jpe?g|png|webp|gif)(\?|$)/i.test(u) && !/(thumb|cover|image|avatar|poster)/i.test(k));
      const isAud = ([k, u]) => /(audio|mp3|m4a|sound)/i.test(k + ' ' + u);
      const media = ([k, u]) => /\.(mp4|webm|m4a|mp3)(\?|$)/i.test(u) || /googlevideo\.com/i.test(u) || /(download|dl|file|link|mp4|video|audio|mp3)/i.test(k);
      const vv = ok.find(f => !isAud(f) && media(f)), aa = ok.find(f => isAud(f) && media(f));
      video = vv ? vv[1] : null; audio = aa ? aa[1] : null;
    }
    return video || audio ? { video, audio } : null;
  };
  const x = await call(path || '/dl?id={id}');
  let got = pull(x);
  if (!got && dl) got = pull(await call(dl));
  if (!got) throw new Error('respons tanpa link unduhan (kunci: ' + Object.keys(x).slice(0, 8).join(', ') + ')' + (dl ? '' : '. Isi YT_RAPID_DL dengan path endpoint unduhan'));
  const th = Array.isArray(x.thumbnail) ? x.thumbnail : Array.isArray(x.thumbnails) ? x.thumbnails : [];
  return { title: x.title || (x.videoDetails && x.videoDetails.title) || null, cover: ytTh(th) || (typeof x.thumbnail === 'string' ? x.thumbnail : null), duration: +x.lengthSeconds || +x.duration || +x.length || null, video: got.video, audio: got.audio };
};

// --- Innertube langsung (tanpa library, tanpa key). Tiap klien = satu sumber terpisah, jadi kalau satu diblokir yang lain tetap jalan. ---
const UA_VR = 'com.google.android.apps.youtube.vr.oculus/1.65.10 (Linux; U; Android 12L; eureka-user Build/SQ3A.220605.009.A1) gzip';
const YT_CLIENTS = [
  { n: 'android_vr', id: 28, ua: UA_VR, ctx: { clientName: 'ANDROID_VR', clientVersion: '1.65.10', deviceMake: 'Oculus', deviceModel: 'Quest 3', osName: 'Android', osVersion: '12L', androidSdkVersion: 32 } },
  { n: 'tv_embed', id: 85, ua: 'Mozilla/5.0 (PlayStation; PlayStation 4/12.00) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15', ctx: { clientName: 'TVHTML5_SIMPLY_EMBEDDED_PLAYER', clientVersion: '2.0', thirdParty: { embedUrl: 'https://www.youtube.com/' } } },
  { n: 'ios', id: 5, ua: 'com.google.ios.youtube/20.10.4 (iPhone16,2; U; CPU iOS 18_3_2 like Mac OS X;)', ctx: { clientName: 'IOS', clientVersion: '20.10.4', deviceMake: 'Apple', deviceModel: 'iPhone16,2', osName: 'iPhone', osVersion: '18.3.2.22D82' } },
  { n: 'android', id: 3, ua: 'com.google.android.youtube/20.10.38 (Linux; U; Android 11) gzip', ctx: { clientName: 'ANDROID', clientVersion: '20.10.38', osName: 'Android', osVersion: '11', androidSdkVersion: 30 } },
  { n: 'mweb', id: 2, ua: 'Mozilla/5.0 (iPad; CPU OS 16_7_10 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1', ctx: { clientName: 'MWEB', clientVersion: '2.20250311.03.00' } },
];
// Link googlevideo terikat IP server. Uji dulu dari server; kalau lolos, dialirkan lewat /ytp supaya peramban tidak ditolak.
async function ytProbe(url, ua, signal) {
  try {
    const r = await fetch(url, { headers: { 'User-Agent': ua, Range: 'bytes=0-1' }, signal });
    try { r.body && r.body.cancel(); } catch (e) {}
    return r.status === 200 || r.status === 206;
  } catch (e) { return false; }
}
const ytInner = cl => async (id, want, signal, raw, mo) => {
  const r = await fetch('https://www.youtube.com/youtubei/v1/player?prettyPrint=false', {
    method: 'POST', signal,
    headers: { 'Content-Type': 'application/json', 'User-Agent': cl.ua, 'X-YouTube-Client-Name': String(cl.id), 'X-YouTube-Client-Version': cl.ctx.clientVersion, 'Origin': 'https://www.youtube.com' },
    body: JSON.stringify({ context: { client: { ...cl.ctx, hl: 'en', gl: 'US', utcOffsetMinutes: 0 } }, videoId: id, contentCheckOk: true, racyCheckOk: true }),
  });
  const d = await r.json().catch(() => null);
  const vd = d && d.videoDetails;
  if (!vd || !vd.title) throw new Error((d && d.playabilityStatus && (d.playabilityStatus.reason || d.playabilityStatus.status)) || 'kode ' + r.status);
  const meta = { title: vd.title, cover: ytTh(vd.thumbnail && vd.thumbnail.thumbnails), duration: +vd.lengthSeconds || null };
  if (mo) return meta;
  const sd = d.streamingData || {};
  const vids = (sd.formats || []).filter(f => f.url && /video\/mp4/.test(f.mimeType || '')).map(f => ({ url: f.url, h: f.height || hOf(f.qualityLabel) }));
  const aud = (sd.adaptiveFormats || []).filter(f => f.url && /^audio\/mp4/.test(f.mimeType || '')).sort((a, b) => (+b.bitrate || 0) - (+a.bitrate || 0))[0];
  const video = ytBest(vids, want);
  if (!video && !aud) throw new Error('stream kosong');
  if (!(await ytProbe(video || aud.url, cl.ua, signal))) throw new Error('link ditolak (terikat IP)');
  const px = u => '/ytp?c=' + cl.n + '&u=' + encodeURIComponent(u);
  return { ...meta, video: video ? px(video) : null, audio: aud ? px(aud.url) : null };
};
// Halaman tonton: sumber cadangan khusus info (judul, cover, durasi).
const ytWatch = async (id, want, signal, raw, mo) => {
  if (!mo) throw new Error('hanya untuk info');
  const r = await fetch('https://www.youtube.com/watch?v=' + id + '&hl=en&has_verified=1', { headers: { 'User-Agent': ytHead['User-Agent'], 'Accept-Language': 'en-US,en;q=0.9', Cookie: 'SOCS=CAI; CONSENT=YES+1' }, signal });
  const t = await r.text();
  const m = t.match(/"lengthSeconds":"(\d+)"/);
  if (!m) throw new Error('durasi tidak ada di halaman');
  const un = s => (s ? s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') : null);
  const ti = t.match(/<meta name="title" content="([^"]*)"/), im = t.match(/<meta property="og:image" content="([^"]*)"/);
  return { title: un(ti && ti[1]), cover: un(im && im[1]), duration: +m[1] };
};
// oEmbed resmi YouTube: sangat andal untuk judul + cover (tanpa durasi).
const ytOembed = async (norm, signal) => {
  const r = await fetch('https://www.youtube.com/oembed?format=json&url=' + encodeURIComponent(norm), { headers: ytHead, signal });
  const d = await r.json().catch(() => null);
  if (!d || !d.title) throw new Error('oembed gagal');
  return { title: d.title, cover: d.thumbnail_url || null, duration: null };
};
// Cadangan terakhir: mulai setelah 3,5 detik (dibatalkan kalau sumber lain sudah berhasil). Link-nya terikat IP server, jadi bisa ditolak peramban.
const ytLib = async (id, want, signal, raw, mo) => {
  if (!YTDL) throw new Error('@distube/ytdl-core belum terpasang');
  await new Promise(rs => setTimeout(rs, 3500));
  if (signal.aborted) throw new Error('dibatalkan');
  const info = await withTimeout(YTDL.getInfo(raw), 5000);
  const vids = info.formats.filter(f => f.hasVideo && f.hasAudio && f.container === 'mp4').map(f => ({ url: f.url, h: f.height || 0 }));
  const aud = YTDL.filterFormats(info.formats, 'audioonly').filter(f => f.container === 'mp4').sort((a, b) => (b.audioBitrate || 0) - (a.audioBitrate || 0))[0];
  const video = ytBest(vids, want);
  const meta = { title: info.videoDetails.title, cover: ytTh(info.videoDetails.thumbnails), duration: +info.videoDetails.lengthSeconds || null };
  if (mo) return meta;
  if (!video && !aud) throw new Error('stream kosong');
  return { ...meta, video, audio: aud ? aud.url : null };
};

// Daftar instance otomatis (tanpa key): ambil dari direktori resmi Piped & Invidious, disimpan 30 menit di memori. Gagal ambil = pakai daftar bawaan saja.
let YT_CACHE = { t: 0, piped: [], inv: [] };
async function ytLists() {
  if (Date.now() - YT_CACHE.t < 30 * 60 * 1000) return YT_CACHE;
  const get = async u => { try { const r = await fetch(u, { headers: ytHead, signal: AbortSignal.timeout(2500) }); return await r.json(); } catch (e) { return null; } };
  const host = u => { try { return new URL(u).hostname; } catch (e) { return null; } };
  const [p, i] = await Promise.all([get('https://piped-instances.kavin.rocks/'), get('https://api.invidious.io/instances.json?sort_by=health')]);
  const piped = Array.isArray(p) ? p.map(x => host(x && x.api_url)).filter(Boolean) : [];
  const inv = Array.isArray(i) ? i.filter(x => x && x[1] && x[1].api === true && x[1].type === 'https').map(x => x[0]) : [];
  YT_CACHE = { t: Date.now(), piped: piped.slice(0, 10), inv: inv.slice(0, 8) };
  return YT_CACHE;
}
// Susun daftar sumber. mo = true -> mode info (Cobalt & ytdl-core tidak ikut, watch-page ikut).
async function ytEngines(env, mo) {
  const csv = v => String(v || '').split(',').map(x => x.trim().replace(/^https?:\/\//i, '').replace(/\/+$/, '')).filter(Boolean);
  const uniq = a => [...new Set(a)], bi = env.YT_BUILTIN !== '0';
  const auto = env.YT_AUTO === '0' ? { piped: [], inv: [] } : await ytLists();
  return [
    ...(bi ? YT_CLIENTS.map(cl => ['innertube:' + cl.n, ytInner(cl)]) : []),
    ...(bi && mo ? [['watch-page', ytWatch]] : []),
    ...uniq([...(bi ? YT_PIPED : []), ...auto.piped, ...csv(env.YT_PIPED)]).map(h => ['piped:' + h, ytPiped(h)]),
    ...uniq([...(bi ? YT_INV : []), ...auto.inv, ...csv(env.YT_INVIDIOUS)]).map(h => ['invidious:' + h, ytInv(h)]),
    ...(mo ? [] : String(env.YT_COBALT || '').split(',').map(x => x.trim()).filter(isUrl).map(b => ['cobalt:' + new URL(b).hostname, ytCobalt(b, env.YT_COBALT_KEY)])),
    ...(!mo && bi && YTDL ? [['ytdl-core', ytLib]] : []),
    ...(mo ? [] : ['YT_RAPID', 'YT_RAPID2', 'YT_RAPID3'].filter(p => env[p + '_HOST'] && (env[p + '_KEY'] || env.RAPIDAPI_KEY)).map(p => ['rapid:' + env[p + '_HOST'], ytRapid(env[p + '_HOST'], env[p + '_PATH'], env[p + '_KEY'] || env.RAPIDAPI_KEY, env[p + '_DL'])])),
  ];
}

const YT_MEM = new Map(); // cache hasil 10 menit per video + mode
const ytMemGet = k => { const x = YT_MEM.get(k); return x && Date.now() - x.t < 600000 ? x.v : null; };
const ytMemSet = (k, v) => { if (YT_MEM.size > 200) YT_MEM.clear(); YT_MEM.set(k, { t: Date.now(), v }); };

// Mode info: judul + cover + DURASI secepat mungkin. Sumber pertama yang memberi durasi menang; oEmbed melengkapi judul/cover.
async function ytInfo(id, env, send) {
  const mk = 'i|' + id, cached = ytMemGet(mk);
  if (cached) return send(200, { ok: true, ...cached });
  const norm = 'https://www.youtube.com/watch?v=' + id, errs = [];
  const engs = await ytEngines(env, true);
  const ac = new AbortController(), timer = setTimeout(() => ac.abort(), +env.YT_INFO_TIMEOUT_MS || 6500);
  const oe = ytOembed(norm, ac.signal).catch(() => null);
  let hit = null;
  try {
    hit = await Promise.any(engs.map(async ([name, fn]) => {
      try {
        const out = await fn(id, 720, ac.signal, norm, true);
        if (!(+out.duration > 0)) throw new Error('tanpa durasi');
        return { via: name, out };
      } catch (er) { errs.push(name + ': ' + ((er && er.message) || er)); throw er; }
    }));
  } catch (e) {}
  const m = await oe;
  clearTimeout(timer); ac.abort();
  if (!hit && !m) return send(502, { ok: false, error: 'Tidak bisa membaca info video. Coba lagi sebentar lagi.', tried: errs.slice(0, 12) });
  const out = { title: (hit && hit.out.title) || (m && m.title) || null, cover: (hit && hit.out.cover) || (m && m.cover) || null, duration: hit ? hit.out.duration : null };
  if (hit) ytMemSet(mk, out);
  return send(200, { ok: true, ...out, ...(env.DEBUG === '1' ? { via: hit ? hit.via : 'oembed', tried: errs.slice(0, 12) } : {}) });
}

async function ytHandle(q, env, send) {
  const raw = String(q.url || '').trim(), id = ytId(raw);
  if (!id) return send(400, { ok: false, error: 'Tautan YouTube tidak valid.' });
  if (q.info === '1') return ytInfo(id, env, send);
  const want = Math.min(Math.max(+q.q || 720, 144), 1080), norm = 'https://www.youtube.com/watch?v=' + id;
  const mk = 's|' + id + '|' + want, cached = ytMemGet(mk);
  if (cached) return send(200, { ok: true, ...cached });
  const engs = await ytEngines(env, false);
  if (!engs.length) return send(500, { ok: false, error: env.YT_RAPID_HOST && !(env.YT_RAPID_KEY || env.RAPIDAPI_KEY) ? 'RAPIDAPI_KEY belum diisi di Vercel (atau YT_RAPID_KEY).' : 'Belum ada API YouTube. Isi YT_RAPID_HOST dan YT_RAPID_PATH di Vercel.' });
  const ac = new AbortController(), timer = setTimeout(() => ac.abort(), +env.YT_TIMEOUT_MS || 9000), errs = [];
  try {
    const hit = await Promise.any(engs.map(async ([name, fn]) => {
      try { const out = await fn(id, want, ac.signal, norm, false); return { via: name, out }; }
      catch (er) { errs.push(name + ': ' + ((er && er.message) || er)); throw er; }
    }));
    ac.abort();
    ytMemSet(mk, hit.out);
    return send(200, { ok: true, ...hit.out, ...(env.DEBUG === '1' ? { via: hit.via, tried: errs.slice(0, 20) } : {}) });
  } catch (e) {
    const rc = ['YT_RAPID', 'YT_RAPID2', 'YT_RAPID3'].some(p => env[p + '_HOST']), hk = env.YT_RAPID_KEY || env.RAPIDAPI_KEY;
    const re = errs.filter(x => x.startsWith('rapid:')).slice(0, 2).map(x => x.replace(/^rapid:/, '')).join(' | ');
    const em = !rc ? 'API gratis diblokir YouTube. Untuk unduhan stabil isi YT_RAPID_HOST dan YT_RAPID_PATH di Vercel.'
      : !hk ? 'RAPIDAPI_KEY belum diisi di Vercel (atau YT_RAPID_KEY).'
      : 'RapidAPI YouTube gagal: ' + (re || 'tidak ada respons') + '. API gratis juga diblokir.';
    return send(502, { ok: false, error: em, tried: errs.slice(0, 12) });
  } finally { clearTimeout(timer); }
}

// Proxy aliran googlevideo (hanya host googlevideo.com) supaya link terikat-IP tetap bisa diputar/diunduh di peramban. Mendukung Range.

const handler = async (req, res) => {
  const send = (code, obj) => {
    const respond = () => res.status(code).setHeader('Cache-Control', 'no-store').json(obj);
    if (code === 200 && obj && obj.ok && req._commit) { const c = req._commit; req._commit = null; return Promise.race([Promise.resolve().then(c).catch(() => {}), new Promise(r => setTimeout(r, 3500))]).then(respond); }
    respond();
  };
  const env = process.env;
  const q = req.query || {};
  const sv = SV[q.action];
  if (!sv) return send(400, { ok: false, error: 'Aksi tidak dikenal.' });
  let cfg0 = null; try { cfg0 = await getCfg(); } catch (e) {}
  if (cfg0 && cfg0.off.includes(q.action) && !studio(req)) return send(503, { ok: false, maint: true, error: 'Fitur ini sedang dalam perbaikan. Coba lagi nanti.' });
  const cat = q.info === '1' ? null : q.action; // batas harian dihitung per fitur
  let g = null;
  if (cat) {
    try { g = await quota(req, res, cat); } catch (e) { g = { vip: true }; }
    if (g.ok === false) return send(429, { ok: false, limit: true, cat, error: limText(g, cat) });
  }
  if (q.info !== '1' && !(g && g.admin)) req._commit = async () => {
    let w = g && g.who;
    if (!w) { try { w = await whoOf(req, res); } catch (e) { w = 'd:?'; } }
    await Promise.all([g ? quotaCommit(g).catch(statErr) : null, trackUse(q.action, w).catch(statErr), logAct(q.action, w, q.url || q.username).catch(statErr)]);
  };
  if (sv.kind === 'bp') return sflHandle(String(q.url || '').trim(), env, send);
  if (sv.kind === 'yt') return ytHandle(q, env, send);

  let val = String((sv.kind === 'dl' ? q.url : q.username) || '').trim();
  if (sv.kind === 'dl') {
    let host = ''; try { host = new URL(val).hostname.toLowerCase(); } catch {}
    if (!sv.allow.test(host)) return send(400, { ok: false, error: 'Tautan tidak valid untuk fitur ini.' });
  } else {
    val = val.replace(/^@/, '');
    if (!/^[A-Za-z0-9._]{1,40}$/.test(val)) return send(400, { ok: false, error: 'Username tidak valid.' });
  }

  const dbg = env.DEBUG === '1';
  const dec = o => (sv.kind === 'st' && o.profile ? { ...o, profile: withAv(o.profile, val, q.action) } : o);
  const tried = [];
  const engines = env.KEYLESS === '0' ? [] : keylessFor(sv, q.action, env);
  // RapidAPI dari env: PREFIX, PREFIX2 ... PREFIX6
  const list = [sv.p, sv.p + '2', sv.p + '3', sv.p + '4', sv.p + '5', sv.p + '6'].filter(x => env[x + '_HOST']);
  const key = env.RAPIDAPI_KEY;
  const presets = key && env.RAPID_PRESET !== '0' ? (RAPID_PRESET[q.action] || []).filter(c => !list.some(x => env[x + '_HOST'] === c.host)) : [];
  if (!engines.length && !list.length && !presets.length) return send(500, { ok: false, error: 'Variabel ' + sv.p + '_HOST belum diisi di Vercel.' });

  // 1) Semua sumber TANPA KEY BERSAMAAN, hasil valid pertama dipakai.
  if (engines.length) {
    try {
      const hit = await withTimeout(Promise.any(engines.map(async ([name, fn]) => {
        try {
          const out = await fn(val);
          if (!out) throw new Error('Data tidak ditemukan.');
          return { name, out };
        } catch (e) { tried.push({ api: name, error: String((e && e.message) || e) }); throw e; }
      })), +env.KEYLESS_TIMEOUT_MS || 8500);
      return send(200, { ok: true, ...dec(hit.out), ...(dbg ? { via: hit.name, tried } : {}) });
    } catch (e) {}
  }
  // 2) RapidAPI (pakai key) berurutan supaya kuota hemat: env dulu, lalu preset bawaan.
  let full = null;
  for (const pfx of list) {
    let v = val;
    // Kalau PREFIX_FULL=1, API ini dikirimi link lengkap (link pendek diubah dulu). Default: link apa adanya.
    if (q.action === 'tiktok' && env[pfx + '_FULL'] === '1') { if (full === null) full = await expandTT(val); v = full; }
    const r = await attempt(pfx, sv, v, env);
    if (r.out) return send(200, { ok: true, ...dec(r.out), ...(dbg ? { via: pfx, tried } : {}) });
    tried.push({ api: pfx, error: r.err, code: r.code });
  }
  for (const c of presets) {
    const r = await attemptCfg(c, key, sv, val, env);
    if (r.out) return send(200, { ok: true, ...dec(r.out), ...(dbg ? { via: 'preset:' + c.host, tried } : {}) });
    tried.push({ api: 'preset:' + c.host, error: r.err, preset: true });
  }
  const rapid = tried.find(t => t.code);
  const msg = rapid ? rapid.error + (tried.length > 1 ? ' Sumber cadangan juga gagal.' : '')
    : 'Semua sumber gratis gagal.' + (key ? ' Cek langganan RapidAPI atau coba lagi nanti.' : ' Isi RAPIDAPI_KEY di Vercel untuk cadangan.');
  return send(rapid && rapid.code === 404 ? 404 : 502, { ok: false, error: msg, ...(dbg ? { tried } : {}) });
};

const app = express();
app.get('/api', handler);
app.get('/ytp', async (req, res) => {
  try {
    const u = new URL(String(req.query.u || ''));
    if (u.protocol !== 'https:' || !/(^|\.)googlevideo\.com$/i.test(u.hostname)) return res.status(400).end();
    const cl = YT_CLIENTS.find(c => c.n === req.query.c) || YT_CLIENTS[0];
    const hd = { 'User-Agent': cl.ua };
    if (req.headers.range) hd.Range = req.headers.range;
    const r = await fetch(u, { headers: hd, redirect: 'follow' });
    if (r.status !== 200 && r.status !== 206) return res.status(r.status === 403 ? 403 : 502).end();
    res.status(r.status);
    for (const k of ['content-type', 'content-length', 'content-range', 'accept-ranges']) { const v = r.headers.get(k); if (v) res.setHeader(k, v); }
    res.setHeader('Cache-Control', 'no-store');
    if (req.query.dl) res.setHeader('Content-Disposition', cdisp(req.query.n, false));
    const { Readable } = require('stream');
    const st = Readable.fromWeb(r.body);
    req.on('close', () => { try { st.destroy(); } catch (e) {} });
    st.on('error', () => { try { res.end(); } catch (e) {} });
    st.pipe(res);
  } catch (e) { try { res.status(400).end(); } catch (x) {} }
});
const IMG_OK = /(^|\.)(tiktokcdn[a-z0-9-]*\.com|tiktok\.com|tiktokv\.(com|us|eu)|ttwstatic\.com|tikwm\.com|byteimg\.com|ibyteimg\.com|ibytedtos\.com|byteoversea\.com|muscdn\.com|cdninstagram\.com|fbcdn\.net)$/i;
const IMG_FB = /(^|\.)(unavatar\.io|wsrv\.nl)$/i; // hanya dipakai server sendiri, tidak boleh dari input pengguna
const UA_D = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const UA_M = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1';
const HDR = [
  { 'User-Agent': UA_D, 'Referer': 'https://www.tiktok.com/', 'Accept': 'image/avif,image/webp,image/*,*/*;q=0.8' },
  { 'User-Agent': UA_M, 'Accept': 'image/*,*/*;q=0.8' }, // tanpa Referer
];
// Deteksi gambar dari isi file (bukan header), HEIC sengaja ditolak karena tidak tampil di kebanyakan peramban.
function sniff(b) {
  if (b.length < 12) return null;
  if (b[0] === 0xFF && b[1] === 0xD8 && b[2] === 0xFF) return 'image/jpeg';
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4E && b[3] === 0x47) return 'image/png';
  if (b.toString('ascii', 0, 3) === 'GIF') return 'image/gif';
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
  if (b.toString('ascii', 4, 12) === 'ftypavif') return 'image/avif';
  return null;
}
async function grab(url, hdr, ms) {
  const u = new URL(url);
  if (u.protocol !== 'https:' || !(IMG_OK.test(u.hostname) || IMG_FB.test(u.hostname))) throw new Error('host');
  const r = await fetch(u, { redirect: 'follow', headers: hdr, signal: AbortSignal.timeout(ms || 4500) });
  const fh = new URL(r.url).hostname;
  if (!(IMG_OK.test(fh) || IMG_FB.test(fh))) throw new Error('redirect');
  if (!r.ok) throw new Error('http ' + r.status);
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.length > 5 * 1024 * 1024) throw new Error('big');
  const type = sniff(buf);
  if (!type) throw new Error('bukan gambar');
  return { type, buf };
}
const anyOk = async ps => { try { return await Promise.any(ps); } catch (e) { return null; } };
async function ttPageAvatar(user) {
  const r = await fetch('https://www.tiktok.com/@' + encodeURIComponent(user), { headers: { 'User-Agent': UA_D, 'Accept-Language': 'en-US,en;q=0.9' }, signal: AbortSignal.timeout(5000) });
  const t = await r.text();
  const m = t.match(/"avatarLarger":"([^"]+)"/) || t.match(/"avatarMedium":"([^"]+)"/);
  if (!m) throw new Error('avatar tidak ada di halaman');
  return JSON.parse('"' + m[1] + '"');
}
// Urutan: (1) CDN langsung dengan 2 jenis header, (2) lewat wsrv.nl (IP lain + konversi ke JPG), unavatar, dan halaman profil TikTok.
async function resolveImage(cands, plat, user) {
  let img = await anyOk(cands.flatMap(c => HDR.map(h => grab(c, h))));
  if (img) return img;
  const viaW = c => grab('https://wsrv.nl/?url=' + encodeURIComponent(c) + '&w=320&h=320&fit=cover&output=jpg', HDR[1], 6000);
  const tasks = cands.slice(0, 2).map(viaW);
  if (user) {
    tasks.push(grab('https://unavatar.io/' + (plat === 'ig' ? 'instagram' : 'tiktok') + '/' + encodeURIComponent(user) + '?fallback=false', HDR[1], 6000));
    if (plat === 'tt') tasks.push(ttPageAvatar(user).then(async u => {
      const x = await anyOk([grab(u, HDR[0]), grab(u, HDR[1]), viaW(u)]);
      if (!x) throw new Error('gagal');
      return x;
    }));
  }
  return anyOk(tasks);
}

// ===== UNDUH LANGSUNG: server menarik file lalu mengirimnya sebagai lampiran (tidak mengalihkan ke alamat lain) =====
function cdisp(n, inline) {
  const base = String(n || 'file').replace(/[\r\n"\\\/]/g, '').slice(0, 120) || 'file';
  const ascii = base.replace(/[^\x20-\x7E]/g, '_');
  return (inline ? 'inline' : 'attachment') + '; filename="' + ascii + '"; filename*=UTF-8\'\'' + encodeURIComponent(base);
}
function privIp(ip) {
  if (!ip) return true;
  if (ip.includes(':')) { const l = ip.toLowerCase(); return l === '::1' || l === '::' || l.startsWith('fc') || l.startsWith('fd') || l.startsWith('fe80') || l.startsWith('::ffff:'); }
  const p = ip.split('.').map(Number);
  return p[0] === 0 || p[0] === 10 || p[0] === 127 || (p[0] === 169 && p[1] === 254) || (p[0] === 172 && p[1] >= 16 && p[1] <= 31) || (p[0] === 192 && p[1] === 168) || (p[0] === 100 && p[1] >= 64 && p[1] <= 127) || p[0] >= 224;
}
async function safeHost(h) {
  h = String(h || '').toLowerCase();
  if (!h || h === 'localhost' || /\.(local|internal|localhost)$/.test(h) || /^[\d.]+$/.test(h) || h.includes(':') || h.startsWith('[')) return false;
  try { const a = await dnsP.lookup(h, { all: true }); return a.length > 0 && !a.some(x => privIp(x.address)); } catch (e) { return false; }
}
const DL_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
app.get('/dl', async (req, res) => {
  const ac = new AbortController();
  const tm = setTimeout(() => ac.abort(), 20000);
  try {
    let url = new URL(String(req.query.u || ''));
    let r = null;
    for (let hop = 0; hop < 5; hop++) {
      if (url.protocol !== 'https:' || !(await safeHost(url.hostname))) { clearTimeout(tm); return res.status(400).json({ ok: false, error: 'alamat tidak diizinkan' }); }
      const hd = { 'User-Agent': DL_UA, 'Accept': '*/*' };
      if (/(tiktok|tiktokcdn|tiktokv|tikwm|byteoversea|muscdn)/i.test(url.hostname)) hd.Referer = 'https://www.tiktok.com/';
      else if (/(instagram|fbcdn|cdninstagram)/i.test(url.hostname)) hd.Referer = 'https://www.instagram.com/';
      if (req.headers.range) hd.Range = req.headers.range;
      r = await fetch(url, { headers: hd, redirect: 'manual', signal: ac.signal });
      if (r.status >= 300 && r.status < 400 && r.headers.get('location')) { url = new URL(r.headers.get('location'), url); try { r.body && r.body.cancel(); } catch (e) {} continue; }
      break;
    }
    clearTimeout(tm);
    if (!r || (r.status !== 200 && r.status !== 206)) return res.status(r && r.status === 403 ? 403 : 502).json({ ok: false, error: 'sumber menolak' });
    const ct = r.headers.get('content-type') || 'application/octet-stream';
    if (/text\/html/i.test(ct)) { try { r.body && r.body.cancel(); } catch (e) {} return res.status(415).json({ ok: false, error: 'bukan file langsung' }); }
    res.status(r.status);
    for (const k of ['content-type', 'content-length', 'content-range', 'accept-ranges']) { const v = r.headers.get(k); if (v) res.setHeader(k, v); }
    res.setHeader('Content-Disposition', cdisp(req.query.n, req.query.i === '1'));
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    const { Readable } = require('stream');
    const st = Readable.fromWeb(r.body);
    req.on('close', () => { try { st.destroy(); } catch (e) {} });
    st.on('error', () => { try { res.end(); } catch (e) {} });
    st.pipe(res);
  } catch (e) { clearTimeout(tm); try { res.status(502).json({ ok: false, error: 'gagal mengambil file' }); } catch (x) {} }
});

// ===== VIDEO INTRO (tertanam di file ini, tidak perlu folder tambahan) =====
const INTRO_B64 = require('./intro-video');
let INTRO_BUF = null;
app.get('/intro.mp4', (req, res) => {
  if (!INTRO_BUF) INTRO_BUF = Buffer.from(INTRO_B64, 'base64');
  const buf = INTRO_BUF, size = buf.length;
  res.setHeader('Content-Type', 'video/mp4');
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  const rg = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
  if (rg && (rg[1] || rg[2])) {
    const x = rg[1] ? parseInt(rg[1], 10) : size - parseInt(rg[2], 10);
    let y = rg[1] && rg[2] ? parseInt(rg[2], 10) : size - 1;
    y = Math.min(y, size - 1);
    if (x > y || x >= size) { res.status(416).setHeader('Content-Range', 'bytes */' + size); return res.end(); }
    res.status(206).setHeader('Content-Range', 'bytes ' + x + '-' + y + '/' + size);
    res.setHeader('Content-Length', y - x + 1);
    return res.end(buf.subarray(x, y + 1));
  }
  res.setHeader('Content-Length', size);
  res.end(buf);
});
app.get('/img', async (req, res) => {
  try {
    const cands = [].concat(req.query.u || []).map(String).filter(x => { try { const u = new URL(x); return u.protocol === 'https:' && IMG_OK.test(u.hostname); } catch (e) { return false; } }).slice(0, 3);
    const n = String(req.query.n || '');
    const user = /^[A-Za-z0-9._]{1,40}$/.test(n) ? n : '';
    if (!cands.length && !user) return res.status(400).end();
    const img = await resolveImage(cands, req.query.p === 'ig' ? 'ig' : 'tt', user);
    if (!img) return res.status(404).setHeader('Cache-Control', 'no-store').end();
    res.setHeader('Content-Type', img.type);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(img.buf);
  } catch (e) { res.status(400).end(); }
});
// ===== Dasbor admin: /loginadmn (masuk) dan /admin (panel). Akun dari variabel Vercel ADMIN_USER dan ADMIN_PASS. =====
// Data (template meme, harga VIP, metode bayar) disimpan di Supabase kalau SUPABASE_URL dan SUPABASE_SERVICE_KEY diisi (tabel: lihat supabase.sql).
// Tanpa Supabase, data hanya tersimpan di memori server dan hilang saat server restart (cukup untuk mencoba).
// Opsional: ADMIN_SECRET (teks acak panjang untuk menandatangani sesi). Kalau kosong, dibuat dari user dan password.
const crypto = require('crypto');
const ADMIN_HTML = require('./admin').admin;
const LOGIN_HTML = require('./admin').login;
const MEME_FONTS = ['Anton', 'Archivo Black', 'Oswald', 'Comic Neue', 'Impact', 'Arial Black'];
const hesc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// --- Penyimpanan ---
const SB_URL = () => String(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim().replace(/\/+$/, '');
const SB_KEY = () => String(process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || '').trim();
const hasDb = () => !!(SB_URL() && SB_KEY());
const MEM = { kv: new Map(), img: new Map() };
async function sb(path, opt = {}) {
  const r = await fetch(SB_URL() + '/rest/v1/' + path, { ...opt, headers: { apikey: SB_KEY(), Authorization: 'Bearer ' + SB_KEY(), 'Content-Type': 'application/json', ...(opt.headers || {}) }, signal: AbortSignal.timeout(9000) });
  const t = await r.text(); let d = null; try { d = t ? JSON.parse(t) : null; } catch (e) {}
  if (!r.ok) throw new Error((d && (d.message || d.hint)) || 'Supabase kode ' + r.status);
  return d;
}
const kvGet = async (k, def) => {
  if (!hasDb()) return MEM.kv.has(k) ? MEM.kv.get(k) : def;
  const d = await sb('alz_kv?k=eq.' + encodeURIComponent(k) + '&select=v');
  return d && d[0] && d[0].v != null ? d[0].v : def;
};
const kvSet = async (k, v) => {
  if (!hasDb()) { MEM.kv.set(k, v); return; }
  await sb('alz_kv?on_conflict=k', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify({ k, v, updated_at: new Date().toISOString() }) });
};
const imgGet = async id => {
  if (!hasDb()) return MEM.img.get(id) || null;
  const d = await sb('alz_img?id=eq.' + encodeURIComponent(id) + '&select=mime,data');
  return d && d[0] ? d[0] : null;
};
const imgPut = async (id, mime, data) => {
  if (!hasDb()) { MEM.img.set(id, { mime, data }); return; }
  await sb('alz_img', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ id, mime, data }) });
};
const imgDel = async ids => {
  ids = ids.filter(x => /^[a-f0-9]{16}$/.test(x));
  if (!ids.length) return;
  if (!hasDb()) { ids.forEach(i => MEM.img.delete(i)); return; }
  await sb('alz_img?id=in.(' + ids.join(',') + ')', { method: 'DELETE' });
};

// --- Pembersihan data (apa pun dari peramban dianggap tidak tepercaya) ---
const rid = () => crypto.randomBytes(8).toString('hex');
const isId = v => typeof v === 'string' && /^[a-f0-9]{16}$/.test(v);
const txt = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, n);
const num = (v, a, b, d) => { v = +v; return Number.isFinite(v) ? Math.min(b, Math.max(a, v)) : d; };
const hex6 = (v, d) => (/^#[0-9a-fA-F]{6}$/.test(String(v)) ? String(v).toLowerCase() : d);
const cleanMemes = list => (Array.isArray(list) ? list : []).slice(0, 60).filter(m => m && isId(m.id)).map(m => ({
  id: m.id, name: txt(m.name, 60) || 'Template', active: m.active !== false,
  font: MEME_FONTS.includes(m.font) ? m.font : 'Anton', size: num(m.size, 3, 20, 9),
  color: hex6(m.color, '#ffffff'), stroke: hex6(m.stroke, '#000000'), sw: num(m.sw, 0, 25, 12),
  upper: m.upper !== false, topY: num(m.topY, 0, 60, 3), botY: num(m.botY, 0, 60, 3),
}));
const VIP_DEF = { plans: [], methods: [] };
const cleanVip = v => {
  v = v && typeof v === 'object' ? v : {};
  const plans = (Array.isArray(v.plans) ? v.plans : []).slice(0, 30).map(p => ({
    id: isId(p && p.id) ? p.id : rid(), name: txt(p && p.name, 40) || 'Paket', price: Math.round(num(p && p.price, 0, 1e9, 0)),
    days: Math.round(num(p && p.days, 1, 3650, 30)), note: txt(p && p.note, 120), active: !(p && p.active === false),
  }));
  const methods = (Array.isArray(v.methods) ? v.methods : []).slice(0, 30).map(m => {
    const kind = ['bank', 'ewallet', 'qris'].includes(m && m.kind) ? m.kind : 'bank';
    return {
      id: isId(m && m.id) ? m.id : rid(), kind, name: txt(m && m.name, 40) || 'Metode', account: txt(m && m.account, 60), holder: txt(m && m.holder, 60),
      note: txt(m && m.note, 160), qris: kind === 'qris' && isId(m && m.qris) ? m.qris : null, active: !(m && m.active === false),
    };
  });
  return { plans, methods };
};

// --- Sesi: cookie bertanda tangan HMAC, HttpOnly, berlaku 12 jam ---
const admOn = () => !!(process.env.ADMIN_USER && process.env.ADMIN_PASS);
const admSecret = () => process.env.ADMIN_SECRET || crypto.createHash('sha256').update('alz|' + (process.env.ADMIN_USER || '') + '|' + (process.env.ADMIN_PASS || '')).digest('hex');
const sign = s => crypto.createHmac('sha256', admSecret()).update(s).digest('hex');
const safeEq = (a, b) => crypto.timingSafeEqual(crypto.createHash('sha256').update(String(a)).digest(), crypto.createHash('sha256').update(String(b)).digest());
const mkTok = () => { const exp = Date.now() + 12 * 3600 * 1000; return exp + '.' + sign('adm:' + exp); };
const cookieOf = req => { const m = /(?:^|;\s*)alz_adm=([^;]+)/.exec(req.headers.cookie || ''); return m ? m[1] : ''; };
const authed = req => {
  if (!admOn()) return false;
  const t = cookieOf(req), i = t.indexOf('.');
  if (i < 1) return false;
  const exp = +t.slice(0, i);
  return exp > Date.now() && safeEq(t.slice(i + 1), sign('adm:' + exp));
};
// Studio Admin: sesi admin yang sah + header X-Alz (hanya dikirim halaman /admin/studio) = tanpa batas harian, tanpa watermark, tetap bisa dipakai saat fitur 'perbaikan'. Beranda biasa tetap memakai batas normal.
const studio = req => authed(req) && req.headers['x-alz'] === '1';
const isHttps = req => req.secure || String(req.headers['x-forwarded-proto'] || '').split(',')[0] === 'https';
const ckSet = (req, v, age) => 'alz_adm=' + v + '; Path=/; HttpOnly; SameSite=Strict; Max-Age=' + age + (isHttps(req) ? '; Secure' : '');
const secHdr = res => { res.setHeader('Cache-Control', 'no-store'); res.setHeader('X-Robots-Tag', 'noindex, nofollow'); res.setHeader('X-Frame-Options', 'DENY'); res.setHeader('Referrer-Policy', 'no-referrer'); };
const loginPage = msg => LOGIN_HTML.replace('<!--MSG-->', msg ? '<p class="err" role="alert">' + hesc(msg) + '</p>' : '');
const LOGIN_TRY = new Map(); // percobaan gagal per IP (berlaku per instance server)
const ipOf = req => String(req.headers['x-forwarded-for'] || (req.socket && req.socket.remoteAddress) || '').split(',')[0].trim() || 'x';

app.get('/loginadmn', async (req, res) => {
  secHdr(res);
  if (authed(req)) return res.redirect('/admin');
  res.type('html').send(await withLogo(loginPage(admOn() ? '' : 'Admin belum diatur. Isi ADMIN_USER dan ADMIN_PASS di Vercel lalu Redeploy.')));
});
app.post('/loginadmn', express.urlencoded({ extended: false, limit: '4kb' }), async (req, res) => {
  secHdr(res);
  if (!admOn()) return res.status(503).type('html').send(loginPage('Admin belum diatur. Isi ADMIN_USER dan ADMIN_PASS di Vercel lalu Redeploy.'));
  const ip = ipOf(req), rec = LOGIN_TRY.get(ip) || { n: 0, until: 0 };
  if (rec.until > Date.now()) return res.status(429).type('html').send(loginPage('Terlalu banyak percobaan. Coba lagi dalam 15 menit.'));
  const b = req.body || {};
  const okU = safeEq(b.u || '', process.env.ADMIN_USER), okP = safeEq(b.p || '', process.env.ADMIN_PASS);
  if (!(okU && okP)) {
    rec.n++;
    if (rec.n >= 5) { rec.until = Date.now() + 15 * 60 * 1000; rec.n = 0; }
    LOGIN_TRY.set(ip, rec);
    await new Promise(r => setTimeout(r, 700));
    return res.status(401).type('html').send(loginPage('Nama pengguna atau kata sandi salah.'));
  }
  LOGIN_TRY.delete(ip);
  res.setHeader('Set-Cookie', ckSet(req, mkTok(), 43200));
  res.redirect(303, '/admin');
});
app.get('/admin', async (req, res) => {
  secHdr(res);
  if (!authed(req)) return res.redirect('/loginadmn');
  res.type('html').send(await withLogo(ADMIN_HTML));
});
// --- Studio Admin: seluruh alat situs, tanpa batas. Dibuka dari tab "Studio Admin" di dasbor. Wajib sesi admin. ---
const STUDIO_JS = "(function(){window.__ADMIN=1;var f=window.fetch.bind(window);window.fetch=function(u,o){try{var s=typeof u==='string'?u:(u&&u.url)||'';if((s.charAt(0)==='/'&&s.charAt(1)!=='/')||s.indexOf(location.origin)===0){o=o?Object.assign({},o):{};var h=o.headers;if(h&&typeof h.set==='function'){h=new Headers(h);h.set('X-Alz','1')}else{h=Object.assign({},h||{});h['X-Alz']='1'}o.headers=h}}catch(e){}return f(u,o)}})();";
const STUDIO_BAR = '<style>#admbar{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:4px 16px;padding:8px 14px;padding-top:calc(8px + env(safe-area-inset-top,0px));background:#0b1b3a;color:#fff;font:600 12.5px/1.3 Archivo,system-ui,sans-serif}#admbar span,#admbar a{white-space:nowrap}#admbar a{color:#9cc2ff;text-decoration:none}</style><div id="admbar"><span>Studio Admin \u00b7 Unlimited</span><a href="/admin">\u2190 Dasbor</a></div>';
app.get('/admin/studio', async (req, res) => {
  secHdr(res);
  if (!authed(req)) return res.redirect('/loginadmn');
  let h = await homeHtml();
  h = h.replace('<head>', () => '<head><script>' + STUDIO_JS + '</script>').replace('<body>', () => '<body>' + STUDIO_BAR);
  res.type('html').send(h);
});
app.post('/admin/logout', (req, res) => {
  secHdr(res);
  res.setHeader('Set-Cookie', ckSet(req, '', 0));
  res.json({ ok: true });
});

// --- API admin: wajib cookie sesi + header X-Alz ---
const guard = (req, res, next) => {
  if (!authed(req) || req.headers['x-alz'] !== '1') return res.status(401).json({ ok: false, error: 'Sesi habis. Masuk lagi lewat /loginadmn.' });
  secHdr(res);
  next();
};
const jsonBody = express.json({ limit: '3mb' });
const fail = (res, e) => res.status(500).json({ ok: false, error: String((e && e.message) || e) });
app.get('/admin/api/state', guard, async (req, res) => {
  try {
    let dbOk = hasDb(), dbErr = null;
    if (dbOk) { try { await sb('alz_kv?select=k&limit=1'); } catch (e) { dbOk = false; dbErr = String((e && e.message) || e); console.error('supabase:', dbErr); } }
    res.json({ ok: true, db: dbOk ? 'supabase' : 'memory', dbErr, fonts: MEME_FONTS, memes: cleanMemes(await kvGet('memes', [])), vip: cleanVip(await kvGet('vip', VIP_DEF)), logo: await logoId(true) });
  } catch (e) { fail(res, e); }
});
app.post('/admin/api/upload', guard, jsonBody, async (req, res) => {
  try {
    const m = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(String((req.body && req.body.data) || ''));
    if (!m) return res.status(400).json({ ok: false, error: 'Berkas harus gambar JPG, PNG, atau WebP.' });
    const buf = Buffer.from(m[2], 'base64');
    if (buf.length > 1400 * 1024) return res.status(413).json({ ok: false, error: 'Gambar terlalu besar (maksimal 1,4 MB setelah dikompres).' });
    const type = sniff(buf);
    if (type !== m[1]) return res.status(400).json({ ok: false, error: 'Isi berkas bukan gambar yang valid.' });
    const id = rid();
    await imgPut(id, type, m[2]);
    res.json({ ok: true, id });
  } catch (e) { fail(res, e); }
});
app.put('/admin/api/memes', guard, jsonBody, async (req, res) => {
  try {
    const next = cleanMemes(req.body && req.body.memes), old = cleanMemes(await kvGet('memes', []));
    await kvSet('memes', next);
    const keep = new Set(next.map(m => m.id));
    await imgDel(old.filter(m => !keep.has(m.id)).map(m => m.id)).catch(() => {});
    res.json({ ok: true, memes: next });
  } catch (e) { fail(res, e); }
});

// --- Foto profil (pengganti huruf A di logo) ---
let LOGO_C = { t: 0, id: null };
async function logoId(fresh) {
  if (!fresh && Date.now() - LOGO_C.t < 15000) return LOGO_C.id;
  try { const l = await kvGet('logo', null); LOGO_C = { t: Date.now(), id: l && isId(l.id) ? l.id : null }; }
  catch (e) { if (fresh) throw e; LOGO_C.t = Date.now() - 10000; }
  return LOGO_C.id;
}
const MARK_RE = /<span class="mark"><svg[\s\S]*?<\/svg><\/span>/;
async function withLogo(h) {
  const id = await logoId();
  if (!id) return h;
  return h.replace(MARK_RE, () => '<span class="mark" style="background:none;padding:0;overflow:hidden;border-radius:50%;box-shadow:0 0 0 2px var(--ac)"><img src="/mi/' + id + '" alt="" style="width:100%;height:100%;object-fit:cover;display:block"></span>');
}
app.put('/admin/api/logo', guard, jsonBody, async (req, res) => {
  try {
    const id = req.body ? req.body.id : null, old = await logoId(true);
    if (id !== null && (!isId(id) || !(await imgGet(id)))) return res.status(400).json({ ok: false, error: 'Gambar tidak ditemukan. Unggah ulang.' });
    await kvSet('logo', { id: id || null });
    LOGO_C = { t: Date.now(), id: id || null };
    if (old && old !== id) await imgDel([old]).catch(() => {});
    res.json({ ok: true, logo: id || null });
  } catch (e) { fail(res, e); }
});
app.put('/admin/api/vip', guard, jsonBody, async (req, res) => {
  try {
    const next = cleanVip(req.body && req.body.vip), old = cleanVip(await kvGet('vip', VIP_DEF));
    await kvSet('vip', next);
    const keep = new Set(next.methods.map(m => m.qris).filter(Boolean));
    await imgDel(old.methods.map(m => m.qris).filter(x => x && !keep.has(x))).catch(() => {});
    res.json({ ok: true, vip: next });
  } catch (e) { fail(res, e); }
});

// --- Publik: daftar template meme aktif + gambar ---
app.get('/memes.json', async (req, res) => {
  try {
    const items = cleanMemes(await kvGet('memes', [])).filter(m => m.active).map(({ active, ...m }) => m);
    res.setHeader('Cache-Control', 'public, max-age=20, s-maxage=20');
    res.json({ ok: true, items });
  } catch (e) { res.json({ ok: false, items: [] }); }
});
app.get('/mi/:id', async (req, res) => {
  try {
    const id = String(req.params.id || '');
    if (!isId(id)) return res.status(404).end();
    const d = await imgGet(id);
    if (!d) return res.status(404).end();
    res.setHeader('Content-Type', d.mime);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(Buffer.from(d.data, 'base64'));
  } catch (e) { res.status(500).end(); }
});


// ===== Musik latar: admin menambah lagu, diputar otomatis di beranda =====
const cleanMusic = v => (Array.isArray(v) ? v : []).slice(0, 30).filter(m => m && typeof m.id === 'string' && /^[a-f0-9]{16}$/.test(m.id)).map(m => ({ id: m.id, title: txt(m.title, 60) || 'Musik', url: /^https?:\/\//i.test(String(m.url || '')) ? String(m.url).trim().slice(0, 600) : '', fid: isId(m.fid) ? m.fid : '', active: m.active !== false })).filter(m => m.url || m.fid);
const audSniff = b => b.length > 12 && (b.toString('latin1', 0, 3) === 'ID3' || (b[0] === 0xff && (b[1] & 0xe0) === 0xe0) ? 'audio/mpeg' : b.toString('latin1', 4, 8) === 'ftyp' ? 'audio/mp4' : b.toString('latin1', 0, 4) === 'OggS' ? 'audio/ogg' : b.toString('latin1', 0, 4) === 'RIFF' ? 'audio/wav' : null);
app.get('/admin/api/music', guard, async (req, res) => { try { res.json({ ok: true, music: cleanMusic(await kvGet('music', [])) }); } catch (e) { fail(res, e); } });
app.put('/admin/api/music', guard, jsonBody, async (req, res) => {
  try {
    const next = cleanMusic(req.body && req.body.music), old = cleanMusic(await kvGet('music', []));
    await kvSet('music', next); MUS_C.t = 0; AUD_C.clear();
    const keep = new Set(next.map(m => m.fid).filter(Boolean));
    await imgDel(old.map(m => m.fid).filter(x => x && !keep.has(x))).catch(() => {});
    res.json({ ok: true, music: next });
  } catch (e) { fail(res, e); }
});
const MUS_MAX = 5 * 1024 * 1024;
app.post('/admin/api/music/chunk', guard, jsonBody, async (req, res) => {
  try {
    const b = req.body || {}, fid = String(b.fid || ''), i = +b.i, n = +b.n, d = String(b.data || '');
    if (!isId(fid) || !Number.isInteger(i) || !Number.isInteger(n) || n < 1 || n > 8 || i < 0 || i >= n || !/^[A-Za-z0-9+/=]+$/.test(d)) return res.status(400).json({ ok: false, error: 'Data unggahan tidak valid.' });
    const buf = Buffer.from(d, 'base64');
    if (buf.length > 1700 * 1024) return res.status(413).json({ ok: false, error: 'Potongan terlalu besar.' });
    let mime, all = d;
    if (i === 0) { mime = audSniff(buf); if (!mime) return res.status(400).json({ ok: false, error: 'Format harus audio (MP3, M4A, OGG, atau WAV).' }); }
    else { const cur = await imgGet(fid); if (!cur || !/^audio\//.test(cur.mime)) return res.status(400).json({ ok: false, error: 'Unggahan terputus. Ulangi dari awal.' }); mime = cur.mime; all = cur.data + d; }
    if (all.length * 3 / 4 > MUS_MAX + 4096) { await imgDel([fid]).catch(() => {}); return res.status(413).json({ ok: false, error: 'File terlalu besar (maksimal 5 MB).' }); }
    if (!hasDb()) MEM.img.set(fid, { mime, data: all });
    else await sb('alz_img?on_conflict=id', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify({ id: fid, mime, data: all }) });
    if (i < n - 1) return res.json({ ok: true, done: false });
    const list = cleanMusic(await kvGet('music', []));
    list.push({ id: rid(), title: txt(b.title, 60) || 'Musik', url: '', fid, active: true });
    await kvSet('music', list); MUS_C.t = 0;
    res.json({ ok: true, done: true, music: cleanMusic(list) });
  } catch (e) { fail(res, e); }
});
let MUS_C = { t: 0, items: [] };
async function musicItems() {
  if (Date.now() - MUS_C.t < 15000) return MUS_C.items;
  const items = cleanMusic(await kvGet('music', [])).filter(m => m.active).map(m => ({ id: m.id, title: m.title, url: m.fid ? '/ma/' + m.fid : m.url }));
  MUS_C = { t: Date.now(), items }; return items;
}
const AUD_C = new Map(); // cache audio terdecode (instance hangat tidak perlu ambil ulang dari database)
app.get('/music.json', async (req, res) => {
  try {
    const items = await musicItems();
    res.setHeader('Cache-Control', 'public, max-age=20, s-maxage=20');
    res.json({ ok: true, items });
  } catch (e) { res.json({ ok: false, items: [] }); }
});
app.get('/ma/:id', async (req, res) => {
  try {
    const id = String(req.params.id || '');
    if (!isId(id)) return res.status(404).end();
    let c = AUD_C.get(id);
    if (!c) {
      const d = await imgGet(id);
      if (!d || !/^audio\//.test(d.mime)) return res.status(404).end();
      c = { mime: d.mime, b: Buffer.from(d.data, 'base64') };
      AUD_C.set(id, c); if (AUD_C.size > 3) AUD_C.delete(AUD_C.keys().next().value);
    }
    const d = { mime: c.mime }, b = c.b, n = b.length;
    res.setHeader('Content-Type', d.mime); res.setHeader('Accept-Ranges', 'bytes'); res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    const r = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
    if (r && (r[1] || r[2])) {
      const s = r[1] === '' ? Math.max(0, n - +r[2]) : +r[1], e = r[1] === '' || r[2] === '' ? n - 1 : Math.min(+r[2], n - 1);
      if (s <= e && s < n) { const e2 = Math.min(e, s + 1048576 - 1); res.status(206); res.setHeader('Content-Range', 'bytes ' + s + '-' + e2 + '/' + n); res.setHeader('Content-Length', e2 - s + 1); return res.end(b.subarray(s, e2 + 1)); }
      res.status(416); res.setHeader('Content-Range', 'bytes */' + n); return res.end();
    }
    res.setHeader('Content-Length', n); res.end(b);
  } catch (e) { res.status(500).end(); }
});


// ===== VIP: pesanan, akun acak, login, dan batas pemakaian gratis =====
const LIM_DEF = { jj: 5, dl: 2, st: 2, lain: 5 }; // bawaan batas gratis per hari (reset 00:00 WIB), bisa diubah dari dasbor admin
const FEATS = [
  { id: 'tanyaustaz', n: 'Ustad Meme', c: 'jj' }, { id: 'wmp', n: 'Windows Media Player', c: 'jj' }, { id: 'teksputih', n: 'Foto Background Putih', c: 'jj' },
  { id: 'teksputihvideo', n: 'Video Background Putih', c: 'jj' }, { id: 'chatwa', n: 'Chat WA', c: 'jj' }, { id: 'marno', n: 'Marno Blewah', c: 'jj' },
  { id: 'tiktok', n: 'Download TikTok', c: 'dl' }, { id: 'instagram', n: 'Download Instagram', c: 'dl' }, { id: 'youtube', n: 'YouTube Clip', c: 'dl' },
  { id: 'ttstalk', n: 'TikTok Stalker', c: 'st' }, { id: 'igstalk', n: 'Instagram Stalker', c: 'st' },
  { id: 'stiker', n: 'Brat Stiker WA', c: 'lain' }, { id: 'sekali', n: 'Lihat Foto 1x Lihat', c: 'lain' }, { id: 'mediafire', n: 'Lewati Link sfl.gl', c: 'lain' }, { id: 'rumus', n: 'Rumus Matematika', c: 'lain' },
];
const FEAT_IDS = new Set(FEATS.map(f => f.id));
const LIMF = FEATS; // fitur yang punya batas harian sendiri-sendiri
const featName = id => (CFG_C.v && CFG_C.v.nm && CFG_C.v.nm[id]) || (FEATS.find(f => f.id === id) || {}).n || id;
let STAT_ERR = null; // error terakhir saat menyimpan statistik (ditampilkan di dasbor admin)
const statErr = e => { STAT_ERR = { t: Date.now(), m: String((e && e.message) || e).slice(0, 200) }; console.error('stat:', STAT_ERR.m); };
const CATN = { jj: 'Bahan JJ', dl: 'Downloader', st: 'Stalker', lain: 'Lainnya' };
const limText = (g, fid) => g.isVip ? 'Batas harian VIP untuk ' + CATN[g.cat] + ' (' + g.lim + 'x per hari) sudah habis. Reset pukul 00:00 WIB.' : limMsg(featName(fid), g.lim);
const limMsg = (name, n) => n > 0 ? 'Batas gratis ' + name + ' ' + n + 'x per hari sudah habis. Daftar VIP untuk unlimited.' : 'Pemakaian gratis ' + name + ' sedang ditutup. Daftar VIP untuk memakainya.';
const cleanCfg = v => {
  v = v && typeof v === 'object' ? v : {};
  const lim = {}; for (const k of ['jj', 'dl', 'st', 'lain']) lim[k] = Math.round(num(v.lim && v.lim[k], 0, 9999, LIM_DEF[k]));
  const fl = {}; LIMF.forEach(f => { fl[f.id] = Math.round(num(v.fl && v.fl[f.id], 0, 9999, lim[f.c])); });
  const off = [...new Set((Array.isArray(v.off) ? v.off : []).filter(x => FEAT_IDS.has(x)))];
  const nm = {}; FEATS.forEach(f => { const x = txt(v.nm && v.nm[f.id], 40); if (x && x !== f.n) nm[f.id] = x; });
  let wa = String(v.wa == null ? '' : v.wa).replace(/\D/g, ''); if (wa[0] === '0') wa = '62' + wa.slice(1); if (wa.length < 8 || wa.length > 15) wa = '';
  let ch = txt(v.ch, 300).replace(/\s+/g, ''); if (ch && !/^https?:\/\//i.test(ch) && /^(www\.)?(chat\.)?whatsapp\.com\//i.test(ch)) ch = 'https://' + ch; if (!/^https?:\/\//i.test(ch)) ch = '';
  return { lim, fl, off, nm, wa, ch, tr: v.tr !== false };
};
let CFG_C = { t: 0, v: null };
async function getCfg(fresh) {
  if (!fresh && CFG_C.v && Date.now() - CFG_C.t < 8000) return CFG_C.v;
  try { const v = cleanCfg(await kvGet('cfg', null)); CFG_C = { t: Date.now(), v }; return v; }
  catch (e) { if (fresh) throw e; return CFG_C.v || cleanCfg(null); }
}
// Statistik pemakaian: siapa (akun VIP atau perangkat tamu) memakai fitur apa, berapa kali.
async function trackUse(f, who) {
  if (!FEAT_IDS.has(f)) return;
  const dk = dayKey(), s = (await kvGet('stats', null)) || {};
  s.f = s.f || {}; s.d = s.d || {};
  const e = s.f[f] || (s.f[f] = { t: 0, u: {} });
  e.t++;
  const w = e.u[who] || (e.u[who] = { n: 0, d: dk, td: 0, l: 0 });
  if (w.d !== dk) { w.d = dk; w.td = 0; }
  w.n++; w.td++; w.l = Date.now();
  const ks = Object.keys(e.u);
  if (ks.length > 150) ks.sort((a, b) => e.u[a].l - e.u[b].l).slice(0, ks.length - 150).forEach(k => delete e.u[k]);
  const day = s.d[dk] || (s.d[dk] = {}); day[f] = (day[f] || 0) + 1;
  const dks = Object.keys(s.d).sort(); dks.slice(0, Math.max(0, dks.length - 30)).forEach(k => delete s.d[k]);
  if (!s.since) s.since = Date.now();
  await kvSet('stats', s);
}
const cookieGet = (req, n) => { const m = new RegExp('(?:^|;\\s*)' + n + '=([^;]+)').exec(req.headers.cookie || ''); return m ? m[1] : ''; };
const ckPut = (req, n, v, age) => n + '=' + v + '; Path=/; HttpOnly; SameSite=Lax; Max-Age=' + age + (isHttps(req) ? '; Secure' : '');
const dayKey = () => new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);
const encKey = () => crypto.createHash('sha256').update('pw|' + admSecret()).digest();
const encPw = t => { const iv = crypto.randomBytes(12), c = crypto.createCipheriv('aes-256-gcm', encKey(), iv); const b = Buffer.concat([c.update(String(t), 'utf8'), c.final()]); return [iv, c.getAuthTag(), b].map(x => x.toString('base64')).join('.'); };
const decPw = s => { try { const [iv, tag, b] = String(s).split('.').map(x => Buffer.from(x, 'base64')); const d = crypto.createDecipheriv('aes-256-gcm', encKey(), iv); d.setAuthTag(tag); return Buffer.concat([d.update(b), d.final()]).toString('utf8'); } catch (e) { return ''; } };
const randStr = (n, al) => { let o = ''; const b = crypto.randomBytes(n); for (let i = 0; i < n; i++) o += al[b[i] % al.length]; return o; };
function didOf(req, res) {
  let d = cookieGet(req, 'alz_did');
  if (!/^[a-f0-9]{24}$/.test(d)) { d = crypto.randomBytes(12).toString('hex'); res.append('Set-Cookie', ckPut(req, 'alz_did', d, 31536000)); }
  return d;
}
async function usageGet(did) { const u = await kvGet('use:' + did, null), dk = dayKey(); return u && u.d === dk && u.f ? u : { d: dk, f: {} }; }
const vipTok = (id, exp) => id + '.' + exp + '.' + sign('vip:' + id + ':' + exp);
async function vipOf(req) {
  const t = cookieGet(req, 'alz_v').split('.');
  if (t.length !== 3 || !isId(t[0])) return null;
  const exp = +t[1];
  if (!(exp > Date.now()) || !safeEq(t[2], sign('vip:' + t[0] + ':' + exp))) return null;
  const u = (await kvGet('vipusers', [])).find(x => x.id === t[0]);
  return u && u.expiresAt && u.expiresAt > Date.now() ? u : null;
}
async function whoOf(req, res) { const v = await vipOf(req); return v ? 'v:' + v.user : 'd:' + didOf(req, res).slice(0, 8); }
const VIP_LIM = { dl: 5, st: 10 }; // batas harian akun VIP per kategori; Bahan JJ (jj) dan Lainnya unlimited
async function quota(req, res, fid) {
  if (studio(req)) return { vip: true, admin: true, who: 'admin' };
  const v = await vipOf(req);
  if (v) {
    const f = FEATS.find(x => x.id === fid), lim = f && VIP_LIM[f.c];
    if (!lim) return { vip: true, who: 'v:' + v.user };
    const key = 'use:v:' + v.id, u = await kvGet(key, null), dk = dayKey(), cu = u && u.d === dk && u.f ? u : { d: dk, f: {} }, ck = 'c:' + f.c;
    return (cu.f[ck] || 0) >= lim ? { ok: false, u: cu, lim, isVip: true, cat: f.c } : { ok: true, isVip: true, key, u: cu, fid: ck, who: 'v:' + v.user };
  }
  const did = didOf(req, res), u = await usageGet(did), lim = (await getCfg()).fl[fid];
  return (u.f[fid] || 0) >= lim ? { ok: false, u, lim } : { ok: true, did, u, fid, who: 'd:' + did.slice(0, 8) };
}
const quotaCommit = async g => { if (!g || g.vip || !g.ok) return; g.u.f[g.fid] = (g.u.f[g.fid] || 0) + 1; await kvSet(g.key || 'use:' + g.did, g.u); };

// ===== Pantauan: pengunjung, riwayat pemakaian (teks/tautan), panduan bukti transfer =====
const GUIDE_DEF = '1. Nominal transfer harus sama persis dengan total pesanan.\n2. Tanggal, jam, dan status berhasil terlihat jelas.\n3. Nama atau nomor tujuan pembayaran ikut terlihat.\n4. Foto utuh, tidak terpotong, tidak buram, dan tidak diedit.\n5. Satu foto untuk satu pesanan, lalu isi nomor WhatsApp yang aktif.';
const cleanGuide = v => {
  v = v && typeof v === 'object' ? v : {};
  const imgs = (Array.isArray(v.imgs) ? v.imgs : []).slice(0, 4).filter(x => x && isId(x.id)).map(x => ({ id: x.id, cap: txt(x.cap, 80) }));
  const text = String(v.text == null ? GUIDE_DEF : v.text).replace(/\r/g, '').replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, ' ').trim().slice(0, 900);
  return { text, imgs, on: v.on !== false };
};
// Catat pemakaian yang BERHASIL: siapa, layanan apa, dan teks/tautan yang dimasukkan (maks 150 entri terakhir).
async function logAct(f, who, d) {
  if (!FEAT_IDS.has(f)) return;
  d = String(d == null ? '' : d).replace(/\r/g, '').replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, ' ').trim().slice(0, 240);
  const a = await kvGet('acts', null), list = Array.isArray(a) ? a : [];
  list.unshift({ t: Date.now(), f, w: String(who || '?').slice(0, 40), d });
  await kvSet('acts', list.slice(0, 150));
}
// Hitung pengunjung beranda: perangkat unik (cookie), unik per hari, dan total kunjungan. Admin dan bot tidak dihitung.
async function trackVisit(req, res) {
  try {
    if (authed(req) || /bot|crawl|spider|slurp|preview|facebookexternalhit|headless/i.test(String(req.headers['user-agent'] || ''))) return;
    const isNew = !/^[a-f0-9]{24}$/.test(cookieGet(req, 'alz_did')), dk = dayKey(), firstToday = cookieGet(req, 'alz_vd') !== dk;
    didOf(req, res);
    if (firstToday) res.append('Set-Cookie', ckPut(req, 'alz_vd', dk, 172800));
    const s = (await kvGet('vis', null)) || {};
    s.d = s.d || {};
    const day = s.d[dk] || (s.d[dk] = { u: 0, v: 0 });
    day.v++; s.tv = (s.tv || 0) + 1;
    if (firstToday) day.u++;
    if (isNew) s.tu = (s.tu || 0) + 1;
    if (!s.since) s.since = Date.now();
    Object.keys(s.d).sort().slice(0, -60).forEach(k => delete s.d[k]);
    await kvSet('vis', s);
  } catch (e) { statErr(e); }
}

// Riwayat lama (sebelum ada pencatatan teks/tautan): diambil dari statistik pemakaian yang sudah ada.
function legacyUniq(st) { const k = new Set(); Object.values((st && st.f) || {}).forEach(e => Object.keys((e && e.u) || {}).forEach(x => k.add(x))); return k.size; }
function mergeActs(acts, st) {
  acts = Array.isArray(acts) ? acts : [];
  const cut = acts.length ? acts[acts.length - 1].t : Infinity, old = [];
  Object.entries((st && st.f) || {}).forEach(([f, e]) => Object.entries((e && e.u) || {}).forEach(([w, x]) => { if (FEAT_IDS.has(f) && x && x.l && x.l < cut) old.push({ t: x.l, f, w, d: '', old: x.n || 1 }); }));
  return acts.concat(old).sort((a, b) => b.t - a.t).slice(0, 300).map(x => ({ ...x, n: featName(x.f) }));
}
function visSummary(s, now, st) {
  s = s || {};
  const dk = dayKey(), d = s.d || {}, days = [];
  for (let i = 6; i >= 0; i--) { const k = new Date(now + 7 * 3600e3 - i * 86400e3).toISOString().slice(0, 10), x = d[k] || {}; days.push({ d: k, u: x.u || 0, v: x.v || 0 }); }
  const td = d[dk] || {};
  return { tu: (s.tu || 0) + legacyUniq(st), tv: s.tv || 0, tdu: td.u || 0, tdv: td.v || 0, days, since: s.since || null };
}


app.get('/me', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const v = await vipOf(req), did = didOf(req, res), cfg = await getCfg();
    if (studio(req)) return res.json({ ok: true, vip: { user: 'admin', plan: 'Studio Admin', exp: Date.now() + 315576e5, since: Date.now() }, lim: null, off: [], limits: cfg.fl, names: cfg.nm, wa: cfg.wa, ch: cfg.ch, trial: cfg.tr, vlim: null, admin: true });
    let lim = null, vlim = null;
    if (v) { const u = await kvGet('use:v:' + v.id, null), ff = u && u.d === dayKey() && u.f ? u.f : {}; vlim = {}; for (const c of Object.keys(VIP_LIM)) vlim[c] = [ff['c:' + c] || 0, VIP_LIM[c]]; }
    if (!v) { const u = await usageGet(did); lim = {}; LIMF.forEach(f => { lim[f.id] = [u.f[f.id] || 0, cfg.fl[f.id]]; }); }
    res.json({ ok: true, vip: v ? { user: v.user, plan: v.planName, exp: v.expiresAt, since: v.activatedAt } : null, lim, off: cfg.off, limits: cfg.fl, names: cfg.nm, wa: cfg.wa, ch: cfg.ch, trial: cfg.tr, vlim });
  } catch (e) { res.json({ ok: true, vip: null, lim: null, off: [], limits: null, names: {}, wa: '', ch: '', trial: true }); }
});
app.post('/use', express.json({ limit: '4kb' }), async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const f = txt(req.body && req.body.f, 30), cfg = await getCfg(), fl = FEATS.find(x => x.id === f);
    if (!fl) return res.status(400).json({ ok: false, error: 'Fitur tidak dikenal.' });
    if (cfg.off.includes(f) && !studio(req)) return res.status(503).json({ ok: false, maint: true, error: 'Fitur ini sedang dalam perbaikan. Coba lagi nanti.' });
    if (studio(req)) return res.json({ ok: true }); // Studio Admin: tidak dihitung dan tidak masuk statistik
    if (fl.c === 'dl' || fl.c === 'st' || fl.id === 'mediafire') return res.json({ ok: true }); // dihitung di /api
    const g = await quota(req, res, f); // akun VIP juga lewat sini supaya pemakaiannya tercatat
    if (g.ok === false) return res.status(429).json({ ok: false, limit: true, feat: f, error: limText(g, f) });
    await Promise.all([quotaCommit(g).catch(statErr), trackUse(f, g.who).catch(statErr), logAct(f, g.who, req.body && req.body.d).catch(statErr)]);
    res.json({ ok: true });
  } catch (e) { statErr(e); res.json({ ok: true }); }
});

app.get('/vip/plans', async (req, res) => {
  try {
    const v = cleanVip(await kvGet('vip', VIP_DEF));
    res.setHeader('Cache-Control', 'no-store');
    const gd = cleanGuide(await kvGet('guide', null));
    res.json({ ok: true, plans: v.plans.filter(p => p.active), methods: v.methods.filter(m => m.active), guide: gd.on && (gd.text || gd.imgs.length) ? { text: gd.text, imgs: gd.imgs } : null });
  } catch (e) { res.json({ ok: false, plans: [], methods: [] }); }
});
const ORD_RATE = new Map();
app.post('/vip/order', express.json({ limit: '2.5mb' }), async (req, res) => {
  try {
    const ip = ipOf(req), r = ORD_RATE.get(ip) || { n: 0, t: Date.now() };
    if (Date.now() - r.t > 3600e3) { r.n = 0; r.t = Date.now(); }
    if (++r.n > 6) return res.status(429).json({ ok: false, error: 'Terlalu banyak pesanan. Coba lagi nanti.' });
    ORD_RATE.set(ip, r);
    const b = req.body || {}, v = cleanVip(await kvGet('vip', VIP_DEF));
    const plan = v.plans.find(p => p.id === b.planId && p.active), meth = v.methods.find(m => m.id === b.methodId && m.active);
    if (!plan || !meth) return res.status(400).json({ ok: false, error: 'Paket atau metode pembayaran tidak valid.' });
    const contact = txt(b.contact, 60);
    if (contact.length < 3) return res.status(400).json({ ok: false, error: 'Isi kontak WhatsApp.' });
    const m = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(String(b.proof || ''));
    if (!m) return res.status(400).json({ ok: false, error: 'Bukti transfer harus berupa gambar.' });
    const buf = Buffer.from(m[2], 'base64');
    if (buf.length > 1800 * 1024) return res.status(413).json({ ok: false, error: 'Gambar bukti terlalu besar.' });
    if (sniff(buf) !== m[1]) return res.status(400).json({ ok: false, error: 'Isi berkas bukan gambar yang valid.' });
    const pid = rid(); await imgPut(pid, m[1], m[2]);
    const o = { id: rid(), planName: plan.name, price: plan.price, days: plan.days, methodName: meth.name, contact, proof: pid, status: 'pending', createdAt: Date.now() };
    const orders = await kvGet('orders', []); orders.unshift(o);
    await kvSet('orders', orders.slice(0, 300));
    res.json({ ok: true, id: o.id });
  } catch (e) { fail(res, e); }
});
app.get('/vip/order/:id', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const id = String(req.params.id || ''); if (!isId(id)) return res.status(404).json({ ok: false, gone: true });
    const o = (await kvGet('orders', [])).find(x => x.id === id);
    if (!o) return res.status(404).json({ ok: false, gone: true });
    const out = { ok: true, status: o.status, planName: o.planName, price: o.price };
    if (o.status === 'approved') { out.username = o.username; out.password = decPw(o.pw); }
    res.json(out);
  } catch (e) { res.status(500).json({ ok: false }); }
});
const VLOGIN = new Map();
app.post('/vip/login', express.json({ limit: '2kb' }), async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const ip = ipOf(req), rec = VLOGIN.get(ip) || { n: 0, until: 0 };
    if (rec.until > Date.now()) return res.status(429).json({ ok: false, error: 'Terlalu banyak percobaan. Coba lagi dalam 15 menit.' });
    const b = req.body || {}, un = txt(b.u, 30).toLowerCase(), users = await kvGet('vipusers', []);
    const u = users.find(x => x.user === un);
    if (!u || !safeEq(decPw(u.pw), String(b.p || ''))) {
      if (++rec.n >= 6) { rec.until = Date.now() + 15 * 60 * 1000; rec.n = 0; }
      VLOGIN.set(ip, rec);
      await new Promise(r => setTimeout(r, 600));
      return res.status(401).json({ ok: false, error: 'Username atau password salah.' });
    }
    VLOGIN.delete(ip);
    if (u.expiresAt && u.expiresAt <= Date.now()) return res.status(403).json({ ok: false, error: 'Masa VIP akun ini sudah habis.' });
    if (!u.expiresAt) { u.activatedAt = Date.now(); u.expiresAt = u.activatedAt + u.days * 86400e3; await kvSet('vipusers', users); }
    res.append('Set-Cookie', ckPut(req, 'alz_v', vipTok(u.id, u.expiresAt), Math.max(60, Math.floor((u.expiresAt - Date.now()) / 1000))));
    res.json({ ok: true });
  } catch (e) { fail(res, e); }
});
app.post('/vip/logout', (req, res) => { res.append('Set-Cookie', ckPut(req, 'alz_v', '', 0)); res.json({ ok: true }); });

// --- Admin: setujui pesanan, lihat dan hapus akun VIP ---
const vipData = async () => {
  const orders = (await kvGet('orders', [])).map(({ pw, ...o }) => o);
  const users = (await kvGet('vipusers', [])).map(u => ({ id: u.id, user: u.user, pass: decPw(u.pw), planName: u.planName, days: u.days, createdAt: u.createdAt, activatedAt: u.activatedAt, expiresAt: u.expiresAt, trial: !!u.trial }));
  return { orders, users };
};
app.get('/admin/api/vipdata', guard, async (req, res) => { try { res.json({ ok: true, ...(await vipData()) }); } catch (e) { fail(res, e); } });
app.post('/admin/api/orders/:id/:act', guard, jsonBody, async (req, res) => {
  try {
    const id = String(req.params.id), act = req.params.act, orders = await kvGet('orders', []), o = orders.find(x => x.id === id);
    if (!o) return res.status(404).json({ ok: false, error: 'Pesanan tidak ditemukan.' });
    if (act === 'approve' || act === 'reject') {
      if (o.status !== 'pending') return res.status(400).json({ ok: false, error: 'Pesanan ini sudah diproses.' });
      if (act === 'approve') {
        const users = await kvGet('vipusers', []);
        let un; do { un = 'vip' + randStr(5, 'abcdefghjkmnpqrstuvwxyz23456789'); } while (users.some(u => u.user === un));
        const pw = randStr(9, 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789');
        const u = { id: rid(), user: un, pw: encPw(pw), planName: o.planName, days: o.days, createdAt: Date.now(), activatedAt: null, expiresAt: null, orderId: o.id };
        users.unshift(u); await kvSet('vipusers', users);
        Object.assign(o, { status: 'approved', username: un, pw: encPw(pw), userId: u.id, doneAt: Date.now() });
      } else Object.assign(o, { status: 'rejected', doneAt: Date.now() });
      await kvSet('orders', orders);
    } else if (act === 'delete') {
      await kvSet('orders', orders.filter(x => x.id !== id));
      await imgDel([o.proof]).catch(() => {});
    } else return res.status(400).json({ ok: false, error: 'Aksi tidak dikenal.' });
    res.json({ ok: true, ...(await vipData()) });
  } catch (e) { fail(res, e); }
});
app.delete('/admin/api/vipusers/:id', guard, async (req, res) => {
  try {
    const id = String(req.params.id);
    await kvSet('vipusers', (await kvGet('vipusers', [])).filter(u => u.id !== id));
    res.json({ ok: true, ...(await vipData()) });
  } catch (e) { fail(res, e); }
});


// --- Admin: pantau pemakaian fitur, matikan fitur (perbaikan), atur batas harian ---
app.get('/admin/api/usage', guard, async (req, res) => {
  try {
    const cfg = await getCfg(true), s = (await kvGet('stats', null)) || {}, dk = dayKey(), now = Date.now();
    const vusers = await kvGet('vipusers', []), orders = await kvGet('orders', []);
    const agg = {}, vu = {};
    const feats = FEATS.map(f => {
      const e = (s.f && s.f[f.id]) || { t: 0, u: {} }, all = Object.entries(e.u || {});
      all.forEach(([k, w]) => {
        const td = w.d === dk ? w.td : 0;
        const a = agg[k] || (agg[k] = { k, vip: k[0] === 'v', name: k.slice(2), n: 0, td: 0, l: 0, fs: 0 });
        a.n += w.n; a.td += td; a.fs++; a.l = Math.max(a.l, w.l || 0);
        if (k[0] === 'v') vu[k.slice(2)] = (vu[k.slice(2)] || 0) + w.n;
      });
      const users = all.map(([k, w]) => ({ vip: k[0] === 'v', name: k.slice(2), n: w.n, td: w.d === dk ? w.td : 0, l: w.l || 0 })).sort((a, b) => b.n - a.n).slice(0, 40);
      return { ...f, n: featName(f.id), n0: f.n, lim: cfg.fl[f.id] != null ? cfg.fl[f.id] : null, off: cfg.off.includes(f.id), total: e.t || 0, today: (s.d && s.d[dk] && s.d[dk][f.id]) || 0, uc: all.length, users };
    });
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const k = new Date(now + 7 * 3600e3 - i * 86400e3).toISOString().slice(0, 10), o = (s.d && s.d[k]) || {};
      days.push({ d: k, n: Object.values(o).reduce((a, b) => a + b, 0) });
    }
    const top = Object.values(agg).sort((a, b) => b.n - a.n).slice(0, 10);
    const acts0 = await kvGet('acts', []);
    res.json({ ok: true, cfg, cats: CATN, feats, vis: visSummary(await kvGet('vis', null), now, s), recent: mergeActs(acts0, s).slice(0, 6), statErr: STAT_ERR, days, top, vu, since: s.since || null,
      vipActive: vusers.filter(u => u.expiresAt && u.expiresAt > now).length, vipTotal: vusers.length, pending: orders.filter(o => o.status === 'pending').length, pendingTr: ((await kvGet('trials', [])) || []).filter(t => t.status === 'pending').length });
  } catch (e) { fail(res, e); }
});
// --- Panduan bukti transfer (foto + teks dari admin) dan riwayat aktivitas ---
app.get('/admin/api/guide', guard, async (req, res) => { try { res.json({ ok: true, guide: cleanGuide(await kvGet('guide', null)), def: GUIDE_DEF }); } catch (e) { fail(res, e); } });
app.put('/admin/api/guide', guard, jsonBody, async (req, res) => {
  try {
    const old = cleanGuide(await kvGet('guide', null)), next = cleanGuide(req.body && req.body.guide);
    await kvSet('guide', next);
    const keep = new Set(next.imgs.map(x => x.id));
    await imgDel(old.imgs.map(x => x.id).filter(x => !keep.has(x))).catch(() => {});
    res.json({ ok: true, guide: next });
  } catch (e) { fail(res, e); }
});
app.get('/admin/api/acts', guard, async (req, res) => {
  try { const a = await kvGet('acts', []); res.json({ ok: true, acts: mergeActs(a, await kvGet('stats', null)) }); } catch (e) { fail(res, e); }
});
app.post('/admin/api/acts/clear', guard, jsonBody, async (req, res) => { try { await kvSet('acts', []); res.json({ ok: true, acts: [] }); } catch (e) { fail(res, e); } });
app.put('/admin/api/cfg', guard, jsonBody, async (req, res) => {
  try {
    const cur = await getCfg(true), b = req.body || {};
    const next = cleanCfg({ lim: cur.lim, fl: b.fl !== undefined ? b.fl : cur.fl, nm: b.nm !== undefined ? b.nm : cur.nm, off: b.off !== undefined ? b.off : cur.off, wa: b.wa !== undefined ? b.wa : cur.wa, ch: b.ch !== undefined ? b.ch : cur.ch, tr: b.tr !== undefined ? b.tr : cur.tr });
    if (b.ch !== undefined && String(b.ch).trim() && !next.ch) return res.status(400).json({ ok: false, error: 'Link saluran tidak valid. Contoh: https://whatsapp.com/channel/xxxx' });
    await kvSet('cfg', next); CFG_C = { t: Date.now(), v: next };
    const back = cleanCfg(await kvGet('cfg', null));
    if (back.ch !== next.ch || back.tr !== next.tr || back.wa !== next.wa) return res.status(500).json({ ok: false, error: 'Gagal tersimpan di database. Cek koneksi Supabase.' });
    res.json({ ok: true, cfg: back, persisted: hasDb() });
  } catch (e) { fail(res, e); }
});
app.post('/admin/api/stats/reset', guard, jsonBody, async (req, res) => {
  try { await kvSet('stats', { f: {}, d: {}, since: Date.now() }); res.json({ ok: true }); } catch (e) { fail(res, e); }
});

// ===== Free Trial 7 hari: syarat follow saluran + simpan kontak admin, bukti 2 foto, admin menyetujui =====
const TRIAL_DAYS = 7, TRIAL_RATE = new Map();
const trialImg = s => {
  const m = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(String(s || ''));
  if (!m) return null;
  const buf = Buffer.from(m[2], 'base64');
  return buf.length <= 1800 * 1024 && sniff(buf) === m[1] ? { mime: m[1], data: m[2] } : null;
};
app.post('/vip/trial', express.json({ limit: '4.5mb' }), async (req, res) => {
  try {
    const cfg = await getCfg();
    if (cfg.tr === false) return res.status(403).json({ ok: false, error: 'Free trial sedang ditutup.' });
    if (await vipOf(req)) return res.status(400).json({ ok: false, error: 'Akun VIP kamu masih aktif.' });
    const ip = ipOf(req), r = TRIAL_RATE.get(ip) || { n: 0, t: Date.now() };
    if (Date.now() - r.t > 3600e3) { r.n = 0; r.t = Date.now(); }
    if (++r.n > 6) return res.status(429).json({ ok: false, error: 'Terlalu banyak percobaan. Coba lagi nanti.' });
    TRIAL_RATE.set(ip, r);
    const did = didOf(req, res), list = await kvGet('trials', []);
    const dup = list.find(t => t.did === did && t.status !== 'rejected');
    if (dup) return res.status(400).json({ ok: false, id: dup.id, error: dup.status === 'pending' ? 'Pengajuan trial kamu masih menunggu admin.' : 'Free trial hanya bisa diambil satu kali per perangkat.' });
    const b = req.body || {}, a1 = trialImg(b.p1), a2 = trialImg(b.p2);
    if (Object.keys(b).some(k => /^p\d+$/.test(k) && k !== 'p1' && k !== 'p2')) return res.status(400).json({ ok: false, error: 'Maksimal 2 foto bukti.' });
    if (!a1 || !a2) return res.status(400).json({ ok: false, error: 'Unggah 2 foto bukti (format gambar).' });
    const p1 = rid(), p2 = rid();
    await imgPut(p1, a1.mime, a1.data); await imgPut(p2, a2.mime, a2.data);
    const t = { id: rid(), did, contact: txt(b.contact, 40), p1, p2, status: 'pending', createdAt: Date.now() };
    list.unshift(t); await kvSet('trials', list.slice(0, 300));
    res.json({ ok: true, id: t.id });
  } catch (e) { fail(res, e); }
});
app.get('/vip/trial/:id', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const id = String(req.params.id || ''); if (!isId(id)) return res.status(404).json({ ok: false, gone: true });
    const t = (await kvGet('trials', [])).find(x => x.id === id);
    if (!t) return res.status(404).json({ ok: false, gone: true });
    const out = { ok: true, status: t.status };
    if (t.status === 'approved') { out.username = t.username; out.password = decPw(t.pw); }
    res.json(out);
  } catch (e) { res.status(500).json({ ok: false }); }
});
const trialList = async () => ({ trials: (await kvGet('trials', [])).map(({ pw, did, ...t }) => t) });
app.get('/admin/api/trials', guard, async (req, res) => { try { res.json({ ok: true, ...(await trialList()) }); } catch (e) { fail(res, e); } });
app.post('/admin/api/trials/:id/:act', guard, jsonBody, async (req, res) => {
  try {
    const id = String(req.params.id), act = req.params.act, list = await kvGet('trials', []), t = list.find(x => x.id === id);
    if (!t) return res.status(404).json({ ok: false, error: 'Pengajuan tidak ditemukan.' });
    if (act === 'approve' || act === 'reject') {
      if (t.status !== 'pending') return res.status(400).json({ ok: false, error: 'Pengajuan ini sudah diproses.' });
      if (act === 'approve') {
        const users = await kvGet('vipusers', []);
        let un; do { un = 'trial' + randStr(4, 'abcdefghjkmnpqrstuvwxyz23456789'); } while (users.some(u => u.user === un));
        const pw = randStr(9, 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789');
        const u = { id: rid(), user: un, pw: encPw(pw), planName: 'Free Trial ' + TRIAL_DAYS + ' Hari', days: TRIAL_DAYS, createdAt: Date.now(), activatedAt: null, expiresAt: null, trial: true };
        users.unshift(u); await kvSet('vipusers', users);
        Object.assign(t, { status: 'approved', username: un, pw: encPw(pw), userId: u.id, doneAt: Date.now() });
      } else Object.assign(t, { status: 'rejected', doneAt: Date.now() });
      await kvSet('trials', list);
    } else if (act === 'delete') {
      await kvSet('trials', list.filter(x => x.id !== id));
      await imgDel([t.p1, t.p2]).catch(() => {});
    } else return res.status(400).json({ ok: false, error: 'Aksi tidak dikenal.' });
    res.json({ ok: true, ...(await trialList()) });
  } catch (e) { fail(res, e); }
});

// HTML beranda lengkap dengan logo dan musik (dipakai oleh / dan /admin/studio)
async function homeHtml() {
  let h = await withLogo(HTML);
  try {
    const items = await musicItems();
    if (items.length) { const js = '<script>window.__MUSIC=' + JSON.stringify(items).replace(/</g, '\\u003c') + '</script>', au = '<audio id="mpa" preload="auto" playsinline src="' + hesc(items[0].url) + '">'; h = h.replace('<!--MUSIC-->', () => js).replace('<audio id="mpa" preload="auto" playsinline>', () => au); }
  } catch (e) {}
  return h;
}
app.get('/', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const [h] = await Promise.all([homeHtml(), trackVisit(req, res)]);
  res.type('html').send(h);
});
app.use((req, res) => res.redirect('/'));
module.exports = app;
