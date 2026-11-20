// ALZTOOLS - SATU FILE (index.js) UNTUK VERCEL. Tampilan dan backend ada di sini.
const express = require("express");
const HTML = "<!DOCTYPE html>\n<html lang=\"id\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover\">\n<title>AlzTools</title>\n<style>\n:root{color-scheme:dark;--bg:#060d1f;--bg2:#0a1630;--card:#0e1d3d;--card2:#12254b;--line:#1c3263;--tx:#e8eefc;--mut:#8b9cc4;--ac:#3b82f6;--ac2:#60a5fa;--glow:rgba(59,130,246,.18);\nbox-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}\nhtml{scroll-padding-top:env(safe-area-inset-top,0px);height:100%}\n*,*::before,*::after{box-sizing:border-box;margin:0}\nbody{background:var(--bg);color:var(--tx);font:15px/1.55 -apple-system,\"Segoe UI\",Inter,Roboto,Helvetica,Arial,sans-serif;min-height:100%;overflow-x:hidden}\nbody::before{content:\"\";position:fixed;inset:0;background:radial-gradient(600px 360px at 85% -5%,rgba(59,130,246,.16),transparent 70%),radial-gradient(500px 300px at 0% 30%,rgba(30,64,140,.18),transparent 70%);pointer-events:none;z-index:0}\na{color:inherit;text-decoration:none}\nbutton,input,select,textarea{font:inherit;color:inherit}\n.wrap{position:relative;z-index:1;max-width:1080px;margin:0 auto;padding:0 20px}\nheader{position:sticky;top:env(safe-area-inset-top,0px);z-index:20;background:#060d1f;border-bottom:1px solid var(--line)}\n.bar{display:flex;align-items:center;justify-content:space-between;height:68px}\n.logo{display:flex;align-items:center;gap:11px;font-weight:800;font-size:21px;letter-spacing:.1px;cursor:pointer}\n.mark{width:42px;height:42px;border-radius:12px;background:linear-gradient(135deg,#2563eb,#1e40af);display:grid;place-items:center;box-shadow:0 0 0 1px rgba(96,165,250,.35),0 6px 18px rgba(37,99,235,.35)}\n.mark svg{width:28px;height:28px}\n.logo span b{color:var(--ac2);font-weight:700}\nnav{display:flex;gap:6px}\nnav a{padding:7px 13px;border-radius:8px;color:var(--mut);font-size:14px;transition:color .2s,background .2s}\nnav a:hover{color:var(--tx);background:var(--card)}nav a.on{color:var(--tx)}nav a svg{display:none}\n.hero{padding:56px 0 34px;max-width:640px}\n.pill{display:inline-flex;align-items:center;gap:8px;font-size:12.5px;color:var(--ac2);background:var(--glow);border:1px solid rgba(59,130,246,.3);padding:5px 12px;border-radius:99px}\n.dot{width:6px;height:6px;border-radius:50%;background:var(--ac2);animation:pulse 2s ease-in-out infinite}\n@keyframes pulse{50%{opacity:.35;transform:scale(.8)}}\nh1{font-size:clamp(30px,6vw,46px);line-height:1.12;margin:18px 0 14px;letter-spacing:-.8px}\nh1 em{font-style:normal;background:linear-gradient(90deg,#60a5fa,#3b82f6);-webkit-background-clip:text;background-clip:text;color:transparent}\n.sub{color:var(--mut);font-size:16px}\n.search{margin-top:24px;display:flex;align-items:center;gap:10px;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:0 14px;height:48px;transition:border-color .2s,box-shadow .2s}\n.search:focus-within{border-color:var(--ac);box-shadow:0 0 0 4px var(--glow)}\n.search input{flex:1;background:none;border:0;outline:0;height:100%}\n.search input::placeholder{color:#5b6c93}\n.ic{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;flex:none}\n.sec{display:flex;justify-content:space-between;align-items:end;margin:20px 0 14px}\n.sec h2{font-size:18px;letter-spacing:-.2px}\n.sec small{color:var(--mut)}\n.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:14px;padding-bottom:40px}\n.card{position:relative;display:block;background:linear-gradient(180deg,var(--card),#0b1731);border:1px solid var(--line);border-radius:14px;padding:18px;cursor:pointer;transition:transform .25s cubic-bezier(.2,.7,.2,1),border-color .25s,box-shadow .25s;opacity:0;transform:translateY(12px)}\n.card.show{opacity:1;transform:none;transition:opacity .5s ease,transform .5s cubic-bezier(.2,.7,.2,1),border-color .25s,box-shadow .25s}\n.card:hover{transform:translateY(-3px);border-color:#2d5bb8;box-shadow:0 10px 28px rgba(8,20,50,.6),0 0 0 1px rgba(59,130,246,.15)}\n.cic{width:42px;height:42px;border-radius:11px;display:grid;place-items:center;background:var(--glow);border:1px solid rgba(59,130,246,.3);color:var(--ac2);margin-bottom:14px}\n.card h3{font-size:15.5px;margin-bottom:4px}\n.card p{color:var(--mut);font-size:13.5px}\n.tag{position:absolute;top:16px;right:16px;font-size:11px;color:var(--mut);border:1px solid var(--line);padding:2px 8px;border-radius:99px}\n.arr{position:absolute;right:16px;bottom:16px;color:var(--ac2);opacity:0;transform:translateX(-6px);transition:.25s}\n.card:hover .arr{opacity:1;transform:none}\n.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:8px 0 28px}\n.st{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px 16px}\n.st b{display:block;font-size:20px}\n.st span{color:var(--mut);font-size:12.5px}\nfooter{border-top:1px solid var(--line);padding:22px 0 30px;color:var(--mut);font-size:13px;text-align:center}\n.dz{cursor:pointer;transition:border-color .2s,background-color .2s}.dz:hover{border-color:var(--ac);background-color:rgba(59,130,246,.06)}.dz img{max-width:100%;max-height:220px;border-radius:10px}\ninput[type=range]{width:100%;accent-color:var(--ac);height:28px;cursor:pointer}\n.faq details{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px 16px;margin-bottom:10px}.faq summary{cursor:pointer;font-weight:600}.faq p{color:var(--mut);margin-top:8px}\n.btn[disabled]{opacity:.7;cursor:wait}\n/* tool view */\n.view{display:none;padding:28px 0 50px;animation:rise .4s cubic-bezier(.2,.7,.2,1)}\n.view.on{display:block}\n@keyframes rise{from{opacity:0;transform:translateY(10px)}}\n.back{display:inline-flex;align-items:center;gap:6px;color:var(--mut);background:none;border:0;cursor:pointer;margin-bottom:18px;padding:4px 0;transition:color .2s}\n.back:hover{color:var(--tx)}\n.thead{display:flex;gap:14px;align-items:center;margin-bottom:22px}\n.thead h2{font-size:24px;letter-spacing:-.4px}\n.thead p{color:var(--mut)}\n.panel{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:20px}\n.cols{display:grid;grid-template-columns:1fr;gap:16px}\n@media(min-width:820px){.cols.two{grid-template-columns:1.1fr .9fr}}\nlabel{display:block;font-size:12.5px;color:var(--mut);margin:0 0 6px;font-weight:600;letter-spacing:.3px}\n.f{margin-bottom:14px}\n.in,.sel{width:100%;background:#091428;border:1px solid var(--line);border-radius:10px;height:44px;padding:0 13px;outline:0;transition:border-color .2s,box-shadow .2s}\n.in:focus,.sel:focus{border-color:var(--ac);box-shadow:0 0 0 4px var(--glow)}\n.row{display:flex;gap:10px}.row>*{flex:1}\n.seg{display:flex;background:#091428;border:1px solid var(--line);border-radius:10px;padding:3px;gap:3px}\n.seg button{flex:1;height:36px;border:0;border-radius:8px;background:none;color:var(--mut);cursor:pointer;transition:background .2s,color .2s}\n.seg button.on{background:var(--ac);color:#fff}\n.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;width:100%;height:46px;border:0;border-radius:10px;background:linear-gradient(180deg,#3b82f6,#2563eb);color:#fff;font-weight:600;cursor:pointer;box-shadow:0 6px 18px rgba(37,99,235,.35);transition:transform .15s,filter .2s}\n.btn:hover{filter:brightness(1.08)}.btn:active{transform:scale(.98)}\n.btn.ghost{background:var(--card2);box-shadow:none;border:1px solid var(--line)}\n.prev{min-height:220px;display:grid;place-items:center;text-align:center;color:var(--mut);border:1px dashed #27427f;border-radius:12px;background:repeating-linear-gradient(45deg,transparent 0 10px,rgba(59,130,246,.035) 10px 20px);padding:20px}\n.prev .ic{width:30px;height:30px;margin-bottom:8px;color:var(--ac2)}\n.range{position:relative;height:6px;border-radius:9px;background:#091428;margin:18px 4px 8px;border:1px solid var(--line)}\n.range i{position:absolute;left:20%;right:30%;top:-1px;bottom:-1px;background:var(--ac);border-radius:9px}\n.range s{position:absolute;top:-6px;width:16px;height:16px;border-radius:50%;background:#fff;border:3px solid var(--ac)}\n.profile{display:flex;gap:14px;align-items:center}\n.av{width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#1e3a8a,#2563eb);flex:none}\n.sk{height:11px;border-radius:6px;background:linear-gradient(90deg,#10234a 25%,#1a3366 50%,#10234a 75%);background-size:200% 100%;animation:sh 1.6s linear infinite;margin:8px 0}\n@keyframes sh{to{background-position:-200% 0}}\n.mini{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px}\n.mini div{background:#091428;border:1px solid var(--line);border-radius:10px;padding:10px;text-align:center}\n.tpls{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px}\n.tpls div{aspect-ratio:1;border-radius:9px;background:#091428;border:1px solid var(--line);cursor:pointer;transition:border-color .2s}\n.tpls div.on,.tpls div:hover{border-color:var(--ac)}\n.meme{position:relative;aspect-ratio:1;border-radius:12px;background:linear-gradient(135deg,#102552,#0a1630);border:1px solid var(--line);overflow:hidden;display:grid}\n.meme span{position:absolute;left:0;right:0;text-align:center;font:800 22px/1.1 Impact,\"Arial Black\",sans-serif;text-transform:uppercase;text-shadow:2px 2px 0 #000;padding:0 12px;color:#fff}\n.note{display:flex;gap:10px;margin-top:14px;font-size:13px;color:var(--mut);background:#0a1630;border:1px solid var(--line);border-radius:10px;padding:11px 13px}\n.note .ic{width:17px;height:17px;color:var(--ac2);margin-top:2px}\n.admin{margin-top:16px;border:1px solid var(--line);border-radius:12px;padding:14px;background:#0a1630}\n.admin h4{font-size:13px;color:var(--ac2);margin-bottom:10px;letter-spacing:.4px}\n.toast{position:fixed;left:50%;bottom:calc(24px + env(safe-area-inset-bottom,0px));transform:translate(-50%,20px);background:var(--card2);border:1px solid var(--line);padding:11px 18px;border-radius:10px;opacity:0;pointer-events:none;transition:.3s;z-index:50;font-size:14px}\n.toast.on{opacity:1;transform:translate(-50%,0)}\n@media(max-width:560px){body{padding-bottom:76px}.wrap{padding:0 16px}.bar{height:60px}.logo{font-size:21px}.mark{width:38px;height:38px}nav{position:fixed;left:0;right:0;bottom:0;z-index:30;background:#081228;border-top:1px solid var(--line);padding:6px 6px calc(6px + env(safe-area-inset-bottom,0px));justify-content:space-around;gap:0}nav a{display:flex;flex-direction:column;align-items:center;gap:3px;font-size:11.5px;padding:6px 8px;flex:1;border-radius:10px}nav a svg{display:block;width:22px;height:22px}nav a.on{color:var(--ac2)}.toast{bottom:calc(84px + env(safe-area-inset-bottom,0px))}.grid{grid-template-columns:repeat(3,1fr);gap:10px;padding-bottom:24px}.card{padding:16px 6px 14px;text-align:center}.card .cic{margin:0 auto 10px;width:48px;height:48px}.card h3{font-size:12.5px;line-height:1.3;margin:0}.card p,.card .tag,.card .arr{display:none}.st b{font-size:17px}.st{padding:12px 10px}.stats{grid-template-columns:1fr 1fr 1fr}.hero{padding-top:36px}}\n@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}.card{opacity:1;transform:none}}\n</style>\n</head>\n<body>\n<header><div class=\"wrap bar\">\n<div class=\"logo\" onclick=\"location.hash=''\"><div class=\"mark\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4.5 20 12 4l7.5 16M8.3 14.5h7.4\"/></svg></div><span>Alz<b>Tools</b></span></div>\n<nav><a href=\"#\"><svg class=\"ic\" viewBox=\"0 0 24 24\"><path d=\"M3 11 12 4l9 7v9H3zM9 20v-6h6v6\"/></svg><span>Beranda</span></a><a href=\"#tiktok\"><svg class=\"ic\" viewBox=\"0 0 24 24\"><path d=\"M12 4v12m0 0-4-4m4 4 4-4M5 20h14\"/></svg><span>Download</span></a><a href=\"#meme\"><svg class=\"ic\" viewBox=\"0 0 24 24\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"3\"/><circle cx=\"9\" cy=\"10\" r=\"2\"/><path d=\"m21 16-5-5-8 8\"/></svg><span>Kreator</span></a><a href=\"#bantuan\"><svg class=\"ic\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01\"/></svg><span>Bantuan</span></a></nav>\n</div></header>\n\n<main class=\"wrap\">\n<section id=\"home\" class=\"view on\">\n<div class=\"hero\">\n<span class=\"pill\"><i class=\"dot\"></i>Semua layanan aktif</span>\n<h1>Satu tempat untuk semua <em>alat digital</em> Anda</h1>\n<p class=\"sub\">Unduh, kreasikan, dan kelola konten dengan cepat. Tanpa ribet, tanpa instalasi.</p>\n<div class=\"search\"><svg class=\"ic\" viewBox=\"0 0 24 24\"><circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"m20 20-3.5-3.5\"/></svg><input id=\"q\" placeholder=\"Cari fitur, misalnya TikTok atau stiker\" autocomplete=\"off\"></div>\n</div>\n<div class=\"stats\"><div class=\"st\"><b>9</b><span>Fitur tersedia</span></div><div class=\"st\"><b>Cepat</b><span>Proses ringan</span></div><div class=\"st\"><b>Gratis</b><span>Tanpa daftar</span></div></div>\n<div class=\"sec\"><h2>Semua fitur</h2><small id=\"cnt\"></small></div>\n<div class=\"grid\" id=\"grid\"></div>\n</section>\n<section id=\"tool\" class=\"view\"></section>\n</main>\n<footer><div class=\"wrap\">AlzTools &copy; 2026. Gunakan dengan bijak dan hormati hak cipta.</div></footer>\n<div class=\"toast\" id=\"toast\"></div>\n\n<script>\nconst P={\ndl:'<path d=\"M12 4v12m0 0-4-4m4 4 4-4M5 20h14\"/>',\nyt:'<rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"3\"/><path d=\"m10 9.5 5 2.5-5 2.5z\"/>',\nus:'<circle cx=\"12\" cy=\"8\" r=\"4\"/><path d=\"M4 20c1-4 4-6 8-6s7 2 8 6\"/>',\nimg:'<rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"3\"/><circle cx=\"9\" cy=\"10\" r=\"2\"/><path d=\"m21 16-5-5-8 8\"/>',\nst:'<path d=\"M12 3a9 9 0 1 0 9 9c-5 0-9-4-9-9z\"/><circle cx=\"9\" cy=\"13\" r=\"1\"/><circle cx=\"14\" cy=\"14\" r=\"1\"/>',\neye:'<path d=\"M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/>',\nlk:'<path d=\"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1\"/>',\narr:'<path d=\"M5 12h14m-5-5 5 5-5 5\"/>'};\nconst ic=k=>`<svg class=\"ic\" viewBox=\"0 0 24 24\">${P[k]}</svg>`;\nconst T=[\n{id:'tiktok',n:'Download TikTok',d:'Simpan video tanpa watermark atau ambil audionya.',i:'dl',t:'MP4 / MP3',k:'dl',ph:'Tempel tautan TikTok'},\n{id:'instagram',n:'Download Instagram',d:'Unduh Reels, post, dan story dalam MP4 atau MP3.',i:'dl',t:'MP4 / MP3',k:'dl',ph:'Tempel tautan Instagram'},\n{id:'youtube',n:'YouTube Clip',d:'Potong bagian video dengan durasi yang bisa diatur.',i:'yt',t:'Atur durasi',k:'yt'},\n{id:'ttstalk',n:'TikTok Stalker',d:'Lihat profil publik, pengikut, dan statistik akun.',i:'us',t:'Profil',k:'st',ph:'Username TikTok'},\n{id:'igstalk',n:'Instagram Stalker',d:'Lihat profil publik, pengikut, dan statistik akun.',i:'us',t:'Profil',k:'st',ph:'Username Instagram'},\n{id:'meme',n:'Meme Foto',d:'Template dan pengaturan teks dikelola dari panel admin.',i:'img',t:'Admin DB',k:'mm'},\n{id:'stiker',n:'Stiker WhatsApp',d:'Ubah gambar menjadi stiker siap pakai.',i:'st',t:'WebP',k:'sk'},\n{id:'sekali',n:'Lihat Foto 1x Lihat',d:'Buka foto sekali lihat dengan tampilan aman.',i:'eye',t:'Viewer',k:'vo'},\n{id:'mediafire',n:'Lewati Link sfl.gl',d:'Lewati sfl.gl dan dapatkan tautan MediaFire langsung.',i:'lk',t:'MediaFire',k:'mf',ph:'Tempel tautan sfl.gl'}];\nconst $=s=>document.querySelector(s),grid=$('#grid');\nfunction toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.x);toast.x=setTimeout(()=>t.classList.remove('on'),2200)}\nconst io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target)}}),{rootMargin:'0px 0px -5% 0px'});\nfunction render(list){grid.innerHTML=list.map((x,i)=>`<a class=\"card\" href=\"#${x.id}\" style=\"transition-delay:${Math.min(i,8)*40}ms\"><div class=\"cic\">${ic(x.i)}</div><span class=\"tag\">${x.t}</span><h3>${x.n}</h3><p>${x.d}</p><span class=\"arr\">${ic('arr')}</span></a>`).join('');\ngrid.querySelectorAll('.card').forEach(c=>io.observe(c));$('#cnt').textContent=list.length+' fitur'}\n$('#q').addEventListener('input',e=>{const v=e.target.value.toLowerCase();render(T.filter(x=>(x.n+x.d).toLowerCase().includes(v)))});\nconst go=`<button class=\"btn\" onclick=\"run(this)\">`;const G=['linear-gradient(135deg,#102552,#0a1630)','linear-gradient(135deg,#1e3a8a,#0e1d3d)','linear-gradient(135deg,#0f3b5c,#0a1630)','linear-gradient(135deg,#2a2f6b,#0a1630)'];\nconst seg=a=>`<div class=\"seg\">${a.map((x,i)=>`<button class=\"${i?'':'on'}\" onclick=\"this.parentNode.querySelectorAll('button').forEach(b=>b.classList.remove('on'));this.classList.add('on')\">${x}</button>`).join('')}</div>`;\nconst empty=(k,t)=>`<div class=\"prev\"><div>${ic(k)}<div>${t}</div></div></div>`;\nconst V={\ndl:x=>`<div class=\"cols two\"><div class=\"panel\"><div class=\"f\"><label>TAUTAN</label><input class=\"in\" placeholder=\"${x.ph}\"></div><div class=\"f\"><label>FORMAT</label>${seg(['MP4 Video','MP3 Audio'])}</div>${go}Proses</button></div><div class=\"panel\">${empty('dl','Hasil unduhan akan tampil di sini')}</div></div>`,\nyt:()=>`<div class=\"cols two\"><div class=\"panel\"><div class=\"f\"><label>TAUTAN YOUTUBE</label><input class=\"in\" placeholder=\"Tempel tautan video\"></div><div class=\"row f\"><div><label>MULAI</label><input class=\"in\" id=\"ys\" value=\"00:30\" readonly></div><div><label>SELESAI</label><input class=\"in\" id=\"ye\" value=\"01:15\" readonly></div></div><div class=\"f\"><label>GESER WAKTU MULAI</label><input type=\"range\" id=\"rs\" min=\"0\" max=\"600\" value=\"30\" oninput=\"yu()\"></div><div class=\"f\"><label>GESER WAKTU SELESAI</label><input type=\"range\" id=\"re\" min=\"0\" max=\"600\" value=\"75\" oninput=\"yu()\"></div><p id=\"yd\" style=\"color:var(--ac2);font-size:13.5px;margin-bottom:16px\">Durasi klip: 45 detik</p><div class=\"f\"><label>KUALITAS</label>${seg(['360p','720p','1080p'])}</div>${go}Buat klip</button></div><div class=\"panel\">${empty('yt','Pratinjau klip')}</div></div>`,\nst:x=>`<div class=\"cols two\"><div class=\"panel\"><div class=\"f\"><label>USERNAME</label><input class=\"in\" placeholder=\"${x.ph}\"></div>${go}Cari akun</button><div class=\"note\">${ic('eye')}<span>Hanya menampilkan data akun yang bersifat publik.</span></div></div><div class=\"panel\"><div class=\"profile\"><div class=\"av\"></div><div style=\"flex:1\"><div class=\"sk\" style=\"width:55%\"></div><div class=\"sk\" style=\"width:35%\"></div></div></div><div class=\"sk\" style=\"width:90%;margin-top:18px\"></div><div class=\"sk\" style=\"width:70%\"></div><div class=\"mini\"><div><b>-</b><br><small style=\"color:var(--mut)\">Pengikut</small></div><div><b>-</b><br><small style=\"color:var(--mut)\">Mengikuti</small></div><div><b>-</b><br><small style=\"color:var(--mut)\">Postingan</small></div></div></div></div>`,\nmm:()=>`<div class=\"cols two\"><div class=\"panel\"><label>PILIH TEMPLATE</label><div class=\"tpls\">${[0,1,2,3].map(i=>'<div class=\"'+(i?'':'on')+'\" style=\"background:'+G[i]+'\" onclick=\"tp(this,'+i+')\"></div>').join('')}</div><div class=\"f\"><label>TEKS ATAS</label><input class=\"in\" id=\"mt\" value=\"Kode jalan\" oninput=\"mu()\"></div><div class=\"f\"><label>TEKS BAWAH</label><input class=\"in\" id=\"mb\" value=\"Tidak ada error\" oninput=\"mu()\"></div>${go}Buat meme</button></div><div class=\"panel\"><div class=\"meme\"><span id=\"pt\" style=\"top:14px\"></span><span id=\"pb\" style=\"bottom:14px\"></span></div><div class=\"admin\"><h4>PENGATURAN ADMIN</h4><div class=\"row\"><div><label>FONT</label><select class=\"sel\" id=\"fn\" onchange=\"mu()\"><option>Impact</option><option>Arial Black</option><option>Georgia</option></select></div><div><label>UKURAN</label><input class=\"in\" id=\"fz\" type=\"number\" value=\"22\" min=\"12\" max=\"48\" oninput=\"mu()\"></div></div><div class=\"row\" style=\"margin-top:10px\"><div><label>POSISI X</label><input class=\"in\" value=\"50%\"></div><div><label>POSISI Y</label><input class=\"in\" value=\"12%\"></div></div></div></div></div>`,\nsk:()=>`<div class=\"cols two\"><div class=\"panel\"><div class=\"prev dz\" style=\"min-height:180px\" onclick=\"pick(this)\">${'<div>'+ic('img')+'<div>Seret gambar ke sini atau ketuk untuk memilih</div></div>'}</div><div class=\"f\" style=\"margin-top:16px\"><label>NAMA PAKET</label><input class=\"in\" placeholder=\"Nama stiker\"></div>${go}Buat stiker</button></div><div class=\"panel\">${empty('st','Pratinjau stiker 512 x 512')}</div></div>`,\nvo:()=>`<div class=\"cols two\"><div class=\"panel\"><div class=\"f\"><label>MEDIA</label><div class=\"prev dz\" style=\"min-height:140px\" onclick=\"pick(this)\"><div>${ic('eye')}<div>Pilih atau tempel media sekali lihat</div></div></div></div>${go}Buka media</button><div class=\"note\">${ic('eye')}<span>Media dibuka di dalam penampil dan tidak disimpan di server.</span></div></div><div class=\"panel\">${empty('img','Media akan tampil di sini')}</div></div>`,\nmf:x=>`<div class=\"cols two\"><div class=\"panel\"><div class=\"f\"><label>TAUTAN SFL.GL</label><input class=\"in\" placeholder=\"${x.ph}\"></div>${go}Lewati link</button><div class=\"note\">${ic('lk')}<span>Tempel tautan sfl.gl, lalu hasilnya berupa tautan MediaFire langsung.</span></div></div><div class=\"panel\">${empty('lk','Tautan MediaFire akan tampil di sini')}</div></div>`};\nfunction mu(){const a=$('#mt'),b=$('#mb');if(!a)return;for(const [id,t] of [['#pt',a.value],['#pb',b.value]]){const e=$(id);e.textContent=t;e.style.fontFamily=$('#fn').value+',sans-serif';e.style.fontSize=$('#fz').value+'px'}}\nfunction tp(el,i){el.parentNode.querySelectorAll('div').forEach(d=>d.classList.remove('on'));el.classList.add('on');$('.meme').style.background=G[i]}\nconst fm=s=>String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');\nfunction yu(){let s=+$('#rs').value,e=+$('#re').value;if(e<=s){e=s+5;$('#re').value=e}$('#ys').value=fm(s);$('#ye').value=fm(e);$('#yd').textContent='Durasi klip: '+(e-s)+' detik'}\nfunction pick(el){const i=document.createElement('input');i.type='file';i.accept='image/*,video/*';i.onchange=()=>{const f=i.files[0];if(!f)return;el.innerHTML=f.type.startsWith('image')?'<img>':'<div>'+ic('img')+'<div>'+f.name+'</div></div>';if(f.type.startsWith('image'))el.firstChild.src=URL.createObjectURL(f);toast('Berkas dipilih')};i.click()}\nconst esc=s=>String(s==null?'':s).replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',\"'\":'&#39;'}[c]));\nasync function dl(b,pf){const p=b.closest('.cols'),u=p.querySelector('input.in').value.trim(),out=p.lastElementChild.querySelector('.prev');if(!u){toast('Tempel tautan dulu');return}const old=b.textContent;b.disabled=true;b.textContent='Memproses...';try{const r=await fetch('/api?action='+pf+'&url='+encodeURIComponent(u));const d=await r.json();if(!d.ok)throw new Error(d.error||'Gagal memproses');const mp3=p.querySelector('.seg button.on').textContent.includes('MP3'),a=mp3?d.audio:d.video;if(!a)throw new Error(mp3?'Audio tidak tersedia':'Video tidak tersedia');out.classList.remove('dz');out.innerHTML=(d.cover?'<img src=\"'+esc(d.cover)+'\" style=\"max-width:100%;max-height:200px;border-radius:10px;margin-bottom:12px\">':'')+'<div style=\"width:100%\"><div style=\"color:var(--tx);font-weight:600;margin-bottom:12px\">'+esc(d.title||'Hasil siap')+'</div><a class=\"btn\" href=\"'+esc(a)+'\" target=\"_blank\" rel=\"noopener\" download>Unduh '+(mp3?'MP3':'MP4')+'</a></div>'}catch(e){toast(e.message.startsWith('Unexpected')||e.message.startsWith('Failed')?'Backend belum terhubung':e.message)}b.disabled=false;b.textContent=old}\nfunction avErr(i){if(!i.dataset.t&&i.dataset.d){i.dataset.t=1;i.src=i.dataset.d;return}const d=document.createElement('div');d.className='av';d.style.cssText='width:88px;height:88px;display:grid;place-items:center;font-size:34px;font-weight:700;color:#fff';d.textContent=i.dataset.n;i.replaceWith(d)}\nasync function sp(b,pf){const p=b.closest('.cols'),u=p.querySelector('input.in').value.trim().replace(/^@/,''),out=p.lastElementChild;if(!u){toast('Isi username dulu');return}const old=b.textContent;b.disabled=true;b.textContent='Mencari...';try{const r=await fetch('/api?action='+pf+'&username='+encodeURIComponent(u));const d=await r.json();if(!d.ok)throw new Error(d.error||'Gagal memproses');const x=d.profile,n=v=>v==null?'-':(isNaN(v)?esc(v):Number(v).toLocaleString('id-ID')),m='<br><small style=\"color:var(--mut)\">';out.innerHTML='<div class=\"profile\">'+(x.avatar||x.avatar_src?'<img class=\"av\" alt=\"\" referrerpolicy=\"no-referrer\" data-d=\"'+esc(x.avatar||'')+'\" data-n=\"'+esc((x.name||x.username||u).trim().charAt(0).toUpperCase())+'\" style=\"width:88px;height:88px;object-fit:cover;box-shadow:0 0 0 3px var(--ac)\" src=\"'+esc(x.avatar_src||'/img?u='+encodeURIComponent(x.avatar))+'\" onerror=\"avErr(this)\">':'<div class=\"av\" style=\"width:88px;height:88px;display:grid;place-items:center;font-size:34px;font-weight:700;color:#fff\">'+esc((x.name||x.username||u).trim().charAt(0).toUpperCase())+'</div>')+'<div style=\"min-width:0\"><b style=\"font-size:17px\">'+esc(x.name||x.username||u)+'</b><div style=\"color:var(--mut)\">@'+esc(x.username||u)+'</div></div></div>'+(x.bio?'<p style=\"margin-top:14px;color:var(--mut);white-space:pre-line\">'+esc(x.bio)+'</p>':'')+'<div class=\"mini\"><div><b>'+n(x.followers)+'</b>'+m+'Pengikut</small></div><div><b>'+n(x.following)+'</b>'+m+'Mengikuti</small></div><div><b>'+n(x.posts)+'</b>'+m+'Postingan</small></div></div>'}catch(e){toast(e.message.startsWith('Unexpected')||e.message.startsWith('Failed')?'Backend belum terhubung':e.message)}b.disabled=false;b.textContent=old}\nfunction run(b){const h=location.hash.slice(1);if(h==='tiktok'||h==='instagram')return dl(b,h);if(h==='ttstalk'||h==='igstalk')return sp(b,h);const old=b.textContent;b.disabled=true;b.textContent='Memproses...';const p=b.closest('.cols').lastElementChild;setTimeout(()=>{b.disabled=false;b.textContent=old;const pv=p.querySelector('.prev');if(p.querySelector('.mini')){p.innerHTML='<div class=\"profile\"><div class=\"av\"></div><div><b style=\"font-size:17px\">@username</b><div style=\"color:var(--mut)\">Akun contoh</div></div></div><div class=\"mini\"><div><b>12,4 rb</b><br><small style=\"color:var(--mut)\">Pengikut</small></div><div><b>310</b><br><small style=\"color:var(--mut)\">Mengikuti</small></div><div><b>86</b><br><small style=\"color:var(--mut)\">Postingan</small></div></div>'}else if(pv){pv.classList.remove('dz');pv.innerHTML='<div>'+ic('dl')+'<div style=\"color:var(--tx);font-weight:600;margin:6px 0 12px\">Hasil siap</div><button class=\"btn ghost\" style=\"width:auto;padding:0 24px\" onclick=\"toast(\\'Contoh tampilan unduhan\\')\">Unduh file</button></div>'}else toast('Selesai');},1100)}\nfunction route(){const h=location.hash.slice(1),x=T.find(t=>t.id===h),tv=$('#tool'),hm=$('#home');document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+h));\nif(h==='bantuan'){tv.innerHTML=`<button class=\"back\" onclick=\"location.hash=''\">${ic('arr').replace('<svg','<svg style=\"transform:scaleX(-1)\"')}Kembali</button><div class=\"thead\"><div><h2>Bantuan</h2><p>Pertanyaan yang sering diajukan</p></div></div><div class=\"faq\"><details open><summary>Apakah AlzTools gratis?</summary><p>Ya, semua fitur dapat dipakai tanpa daftar.</p></details><details><summary>Format apa saja yang didukung?</summary><p>Video MP4 dan audio MP3 untuk fitur unduhan.</p></details><details><summary>Siapa yang mengatur template meme?</summary><p>Admin mengelola template, font, ukuran, dan posisi teks.</p></details><details><summary>Apakah media saya disimpan?</summary><p>Tidak, berkas diproses sementara lalu dihapus.</p></details></div>`;hm.classList.remove('on');tv.classList.remove('on');void tv.offsetWidth;tv.classList.add('on');scrollTo(0,0);return}\nif(!x){tv.classList.remove('on');hm.classList.add('on');return}\ntv.innerHTML=`<button class=\"back\" onclick=\"location.hash=''\">${ic('arr').replace('<svg','<svg style=\"transform:scaleX(-1)\"')}Kembali</button><div class=\"thead\"><div class=\"cic\" style=\"margin:0\">${ic(x.i)}</div><div><h2>${x.n}</h2><p>${x.d}</p></div></div>${V[x.k](x)}`;\nhm.classList.remove('on');tv.classList.remove('on');void tv.offsetWidth;tv.classList.add('on');scrollTo(0,0);mu()}\naddEventListener('hashchange',route);render(T);route();\n</script>\n</body>\n</html>\n";

// AlzTools backend (Vercel Serverless). Semua host dan key diisi lewat Environment Variables di Vercel.
const SV = {
  tiktok:    { p: 'TT_DL',    allow: /(^|\.)tiktok\.com$/,    param: 'url',      kind: 'dl' },
  instagram: { p: 'IG_DL',    allow: /(^|\.)instagram\.com$/, param: 'url',      kind: 'dl' },
  ttstalk:   { p: 'TT_STALK', param: 'username', kind: 'st' },
  igstalk:   { p: 'IG_STALK', param: 'username', kind: 'st' },
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

// Coba satu API. pfx contoh: TT_DL, TT_DL2, TT_DL3, TT_DL4
async function attempt(pfx, sv, val, env) {
  const host = env[pfx + '_HOST'];
  const key = env[pfx + '_KEY'] || env.RAPIDAPI_KEY;
  if (!key) return { err: 'RAPIDAPI_KEY belum diisi di Vercel.', code: 500 };
  const path = env[pfx + '_PATH'] || '/';
  const param = env[pfx + '_PARAM'] || sv.param;
  const url = path.includes('{q}')
    ? 'https://' + host + path.replace('{q}', encodeURIComponent(val))
    : 'https://' + host + path + '?' + param + '=' + encodeURIComponent(val);
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

const handler = async (req, res) => {
  const send = (code, obj) => { res.status(code).setHeader('Cache-Control', 'no-store').json(obj); };
  const env = process.env;
  const q = req.query || {};
  const sv = SV[q.action];
  if (!sv) return send(400, { ok: false, error: 'Aksi tidak dikenal.' });

  let val = String((sv.kind === 'dl' ? q.url : q.username) || '').trim();
  if (sv.kind === 'dl') {
    let host = ''; try { host = new URL(val).hostname.toLowerCase(); } catch {}
    if (!sv.allow.test(host)) return send(400, { ok: false, error: 'Tautan tidak valid untuk fitur ini.' });
  } else {
    val = val.replace(/^@/, '');
    if (!/^[A-Za-z0-9._]{1,40}$/.test(val)) return send(400, { ok: false, error: 'Username tidak valid.' });
  }

  const engines = env.KEYLESS === '0' ? [] : (KEYLESS[q.action] || []);
  // RapidAPI: PREFIX, PREFIX2, PREFIX3, PREFIX4
  const list = [sv.p, sv.p + '2', sv.p + '3', sv.p + '4'].filter(x => env[x + '_HOST']);
  if (!engines.length && !list.length) return send(500, { ok: false, error: 'Variabel ' + sv.p + '_HOST belum diisi di Vercel.' });

  const dbg = env.DEBUG === '1';
  const dec = o => (sv.kind === 'st' && o.profile ? { ...o, profile: withAv(o.profile, val, q.action) } : o);
  const tried = [];
  for (const [name, fn] of engines) {
    try {
      const out = await fn(val);
      if (out) return send(200, { ok: true, ...dec(out), ...(dbg ? { via: name, tried } : {}) });
      tried.push({ api: name, error: 'Data tidak ditemukan.' });
    } catch (e) { tried.push({ api: name, error: String((e && e.message) || e) }); }
  }
  let full = null;
  for (const pfx of list) {
    let v = val;
    // Kalau PREFIX_FULL=1, API ini dikirimi link lengkap (link pendek diubah dulu). Default: link apa adanya.
    if (q.action === 'tiktok' && env[pfx + '_FULL'] === '1') { if (full === null) full = await expandTT(val); v = full; }
    const r = await attempt(pfx, sv, v, env);
    if (r.out) return send(200, { ok: true, ...dec(r.out), ...(dbg ? { via: pfx, tried } : {}) });
    tried.push({ api: pfx, error: r.err, code: r.code });
  }
  const rapid = tried.find(t => t.code);
  const msg = (rapid ? rapid.error : 'Semua sumber gagal. Coba lagi nanti.') + (tried.length > 1 ? ' Sumber cadangan juga gagal.' : '');
  return send(rapid && rapid.code === 404 ? 404 : 502, { ok: false, error: msg, ...(dbg ? { tried } : {}) });
};

const app = express();
app.get('/api', handler);
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
app.get('/', (req, res) => res.type('html').send(HTML));
app.use((req, res) => res.redirect('/'));
module.exports = app;
