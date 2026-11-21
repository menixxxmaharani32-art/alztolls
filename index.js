// ALZTOOLS - SATU FILE (index.js) UNTUK VERCEL. Tampilan dan backend ada di sini.
const express = require("express");
const HTML = "<!DOCTYPE html>\n<html lang=\"id\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover\">\n<meta name=\"theme-color\" content=\"#eef0f2\" media=\"(prefers-color-scheme: light)\"><meta name=\"theme-color\" content=\"#121417\" media=\"(prefers-color-scheme: dark)\">\n<title>AlzTools</title>\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\"><link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n<link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&display=swap\">\n<style>\n:root{color-scheme:light dark;--bg:#eef0f2;--sf:#fff;--sf2:#f6f7f8;--line:#d5dade;--tx:#16181b;--mut:#596069;--ac:#ffc800;--onac:#16181b;--ac2:#7a5c00;--ft:\"Archivo\",system-ui,-apple-system,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif;\nbox-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}\n@media(prefers-color-scheme:dark){:root{--bg:#121417;--sf:#1b1e22;--sf2:#22262b;--line:#2f353c;--tx:#eef0f2;--mut:#9aa3ac;--ac2:#ffc800}}\nhtml{scroll-padding-top:env(safe-area-inset-top,0px);height:100%}\n*,*::before,*::after{box-sizing:border-box;margin:0}\nbody{background:var(--bg);color:var(--tx);font:15px/1.55 var(--ft);min-height:100%;overflow-x:hidden}\na{color:inherit;text-decoration:none}\nbutton,input,select,textarea{font:inherit;color:inherit}\n:focus-visible{outline:2px solid var(--tx);outline-offset:2px}\n.wrap{max-width:980px;margin:0 auto;padding:0 20px}\n.mut{color:var(--mut)}\nheader{position:sticky;top:env(safe-area-inset-top,0px);z-index:20;background:var(--bg);border-bottom:1px solid var(--line)}\n.bar{display:flex;align-items:center;justify-content:space-between;height:58px}\n.logo{display:flex;align-items:center;gap:10px}\n.mark{width:32px;height:32px;border-radius:9px;background:var(--ac);display:grid;place-items:center;flex:none}\n.mark svg{width:21px;height:21px}\n.wm{font-weight:800;font-stretch:118%;font-size:21px;letter-spacing:-.01em}\nnav{display:flex;gap:22px}\nnav a{position:relative;display:flex;align-items:center;gap:6px;padding:19px 0;color:var(--mut);font-weight:600;font-size:14.5px}\nnav a:hover{color:var(--tx)}\nnav a.on{color:var(--tx)}\nnav a.on::after{content:\"\";position:absolute;left:0;right:0;bottom:-1px;height:3px;background:var(--ac)}\nnav a svg{display:none}\n.ic{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex:none}\n.hero{padding:34px 0 22px;max-width:640px}\nh1{font-size:clamp(32px,8.6vw,54px);font-weight:800;font-stretch:116%;line-height:1.02;letter-spacing:-.025em}\n.sub{margin-top:14px;color:var(--mut);font-size:16.5px;max-width:46ch}\n.search{margin-top:22px;font-size:15px;font-weight:400;display:flex;align-items:center;gap:10px;background:var(--sf);border:1px solid var(--line);border-radius:10px;padding:0 14px;height:50px;color:var(--mut)}\n.search:focus-within{border-color:var(--tx);box-shadow:0 0 0 1px var(--tx)}\n.search input{flex:1;min-width:0;background:none;border:0;outline:0;height:100%;color:var(--tx)}\n.search input::placeholder{color:var(--mut)}\n.tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:6px 0 30px}\n.big{display:flex;flex-direction:column;justify-content:space-between;gap:26px;min-height:132px;padding:14px;border-radius:18px;border:1px solid var(--line)}\n.big .ic{width:28px;height:28px;stroke-width:1.9}\n.big b{display:block;font-size:15px;font-weight:700;line-height:1.2}\n.big small{display:none;margin-top:6px;font-size:13.5px;line-height:1.4;opacity:.8}\n.big.b0{background:var(--ac);color:var(--onac);border-color:var(--ac)}\n.big.b1{background:var(--tx);color:var(--bg);border-color:var(--tx)}\n.big.b2{background:var(--sf);color:var(--tx)}\n.big:active{transform:translateY(1px)}\n.sec{font-size:15px;font-weight:700;margin:0 0 4px;color:var(--mut)}\n.list{border-top:1px solid var(--line);margin-bottom:40px}\n.lr{display:grid;grid-template-columns:26px 1fr auto 18px;gap:14px;align-items:center;padding:15px 2px;border-bottom:1px solid var(--line)}\n.lr:hover{background:var(--sf2)}\n.lr b{display:block;font-size:16px;font-weight:650;line-height:1.25}\n.lr small{display:block;color:var(--mut);font-size:13.5px;line-height:1.35;margin-top:2px}\n.lr em{display:none;font-style:normal;color:var(--mut);font-size:13px}\n.lr>.ic:last-child{width:18px;height:18px;color:var(--mut)}\nfooter{border-top:1px solid var(--line);padding:20px 0 30px;color:var(--mut);font-size:13px}\n.view{display:none;padding:22px 0 50px}\n.view.on{display:block;animation:fade .18s ease-out}\n@keyframes fade{from{opacity:0}}\n.back{display:inline-flex;align-items:center;gap:6px;color:var(--mut);background:none;border:0;cursor:pointer;margin-bottom:16px;padding:6px 0;font-weight:600}\n.back:hover{color:var(--tx)}\n.back .ic{width:18px;height:18px}\n.thead{display:flex;gap:14px;align-items:center;margin-bottom:20px}\n.cic{width:46px;height:46px;border-radius:12px;display:grid;place-items:center;background:var(--ac);color:var(--onac);flex:none}\n.thead h2{font-size:26px;font-weight:800;font-stretch:112%;letter-spacing:-.015em;line-height:1.1}\n.thead p{color:var(--mut);margin-top:2px}\n.panel{background:var(--sf);border:1px solid var(--line);border-radius:14px;padding:18px}\n.cols{display:grid;grid-template-columns:1fr;gap:14px}\n@media(min-width:820px){.cols.two{grid-template-columns:1.1fr .9fr}}\nlabel{display:block;font-size:13px;color:var(--tx);margin:0 0 6px;font-weight:600}\n.f{margin-bottom:14px}\n.in,.sel{width:100%;background:var(--bg);border:1px solid var(--line);border-radius:10px;height:46px;padding:0 13px;outline:0}\n.in:focus,.sel:focus{border-color:var(--tx);box-shadow:0 0 0 1px var(--tx)}\n.in::placeholder{color:var(--mut)}\n.row{display:flex;gap:10px}.row>*{flex:1}\n.seg{display:flex;background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:3px;gap:3px}\n.seg button{flex:1;height:38px;border:0;border-radius:7px;background:none;color:var(--mut);cursor:pointer;font-weight:600}\n.seg button.on{background:var(--tx);color:var(--bg)}\n.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;width:100%;height:48px;border:0;border-radius:10px;background:var(--ac);color:var(--onac);font-weight:700;cursor:pointer}\n.btn:hover{filter:brightness(.96)}.btn:active{transform:translateY(1px)}\n.btn.ghost{background:transparent;border:1px solid var(--line);color:var(--tx)}\n.btn[disabled]{opacity:.65;cursor:wait}\n.prev{min-height:220px;display:grid;place-items:center;text-align:center;color:var(--mut);border:1px dashed var(--line);border-radius:12px;padding:20px}\n.prev .ic{width:30px;height:30px;margin-bottom:8px}\n.dz{cursor:pointer}.dz:hover{border-color:var(--tx)}.dz img{max-width:100%;max-height:220px;border-radius:10px}\ninput[type=range]{width:100%;accent-color:var(--tx);height:28px;cursor:pointer}\n.profile{display:flex;gap:14px;align-items:center}\n.av{width:64px;height:64px;border-radius:50%;background:var(--line);flex:none}\n.sk{height:11px;border-radius:6px;background:var(--line);margin:8px 0}\n.mini{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px}\n.mini div{background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:10px;text-align:center}\n.tpls{display:grid;grid-template-columns:repeat(auto-fill,minmax(78px,1fr));gap:8px}\n.tp{aspect-ratio:1;padding:0;border:2px solid var(--line);border-radius:10px;overflow:hidden;background:var(--bg);cursor:pointer}\n.tp img{width:100%;height:100%;object-fit:cover;display:block}\n.tp.on{border-color:var(--tx);outline:2px solid var(--ac);outline-offset:1px}\n#mcv{max-width:100%;max-height:70vh;border-radius:8px;display:none}\n.note{display:flex;gap:10px;margin-top:14px;font-size:13.5px;color:var(--mut);background:var(--sf2);border-left:3px solid var(--ac);border-radius:8px;padding:10px 12px}\n.note .ic{width:17px;height:17px;margin-top:2px}\n.faq details{border-bottom:1px solid var(--line);padding:14px 2px}.faq summary{cursor:pointer;font-weight:650}.faq p{color:var(--mut);margin-top:8px}\n.toast{position:fixed;left:50%;bottom:calc(24px + env(safe-area-inset-bottom,0px));transform:translate(-50%,16px);background:var(--tx);color:var(--bg);padding:11px 18px;border-radius:10px;opacity:0;pointer-events:none;transition:.2s;z-index:50;font-size:14px;max-width:90vw}\n.toast.on{opacity:1;transform:translate(-50%,0)}\n@media(min-width:700px){.tiles{gap:14px}.big{min-height:176px;padding:18px}.big b{font-size:17px}.big small{display:block}.lr em{display:block}}\n@media(max-width:560px){body{padding-bottom:70px}.wrap{padding:0 16px}.bar{height:54px}\nnav{position:fixed;left:0;right:0;bottom:0;z-index:30;background:var(--sf);border-top:1px solid var(--line);padding:0 4px calc(4px + env(safe-area-inset-bottom,0px));justify-content:space-around;gap:0}\nnav a{flex-direction:column;gap:2px;font-size:11.5px;padding:9px 8px 6px;flex:1;justify-content:center}\nnav a svg{display:block;width:22px;height:22px}\nnav a.on::after{top:-1px;bottom:auto;left:28%;right:28%}\n.toast{bottom:calc(80px + env(safe-area-inset-bottom,0px))}.hero{padding-top:24px}.big small{display:none}}\n@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}\n</style>\n</head>\n<body>\n<header><div class=\"wrap bar\">\n<a class=\"logo\" href=\"#\" aria-label=\"AlzTools, ke beranda\"><span class=\"mark\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#16181b\" stroke-width=\"3.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4.5 20 12 4l7.5 16M8.3 14.5h7.4\"/></svg></span><span class=\"wm\">AlzTools</span></a>\n<nav><a href=\"#\"><svg class=\"ic\" viewBox=\"0 0 24 24\"><path d=\"M3 11 12 4l9 7v9H3zM9 20v-6h6v6\"/></svg><span>Beranda</span></a><a href=\"#tiktok\"><svg class=\"ic\" viewBox=\"0 0 24 24\"><path d=\"M12 4v12m0 0-4-4m4 4 4-4M5 20h14\"/></svg><span>Download</span></a><a href=\"#meme\"><svg class=\"ic\" viewBox=\"0 0 24 24\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"3\"/><circle cx=\"9\" cy=\"10\" r=\"2\"/><path d=\"m21 16-5-5-8 8\"/></svg><span>Kreator</span></a><a href=\"#bantuan\"><svg class=\"ic\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01\"/></svg><span>Bantuan</span></a></nav>\n</div></header>\n\n<main class=\"wrap\">\n<section id=\"home\" class=\"view on\">\n<div class=\"hero\">\n<h1>Pilih alat, tempel tautan, selesai.</h1>\n<p class=\"sub\">Unduh video TikTok dan Instagram, potong klip YouTube, atau buat meme dan stiker langsung dari HP.</p>\n<label class=\"search\" for=\"q\"><svg class=\"ic\" viewBox=\"0 0 24 24\"><circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"m20 20-3.5-3.5\"/></svg><input id=\"q\" placeholder=\"Cari alat, misalnya stiker\" autocomplete=\"off\"></label>\n</div>\n<div id=\"grid\"></div>\n</section>\n<section id=\"tool\" class=\"view\"></section>\n</main>\n<footer><div class=\"wrap\">AlzTools versi 3.0, diperbarui 21 Nov 2026. Gunakan dengan bijak dan hormati hak cipta.</div></footer>\n<div class=\"toast\" id=\"toast\"></div>\n\n<script>\n\nconst P={\ndl:'<path d=\"M12 4v12m0 0-4-4m4 4 4-4M5 20h14\"/>',\nyt:'<rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"3\"/><path d=\"m10 9.5 5 2.5-5 2.5z\"/>',\nus:'<circle cx=\"12\" cy=\"8\" r=\"4\"/><path d=\"M4 20c1-4 4-6 8-6s7 2 8 6\"/>',\nimg:'<rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"3\"/><circle cx=\"9\" cy=\"10\" r=\"2\"/><path d=\"m21 16-5-5-8 8\"/>',\nst:'<path d=\"M12 3a9 9 0 1 0 9 9c-5 0-9-4-9-9z\"/><circle cx=\"9\" cy=\"13\" r=\"1\"/><circle cx=\"14\" cy=\"14\" r=\"1\"/>',\neye:'<path d=\"M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/>',\nlk:'<path d=\"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1\"/>',\narr:'<path d=\"M5 12h14m-5-5 5 5-5 5\"/>'};\nconst ic=k=>`<svg class=\"ic\" viewBox=\"0 0 24 24\">${P[k]}</svg>`;\nconst T=[\n{id:'tiktok',n:'Download TikTok',d:'Simpan video tanpa watermark atau ambil audionya.',i:'dl',t:'MP4 / MP3',k:'dl',ph:'Tempel tautan TikTok'},\n{id:'instagram',n:'Download Instagram',d:'Unduh Reels, post, dan story dalam MP4 atau MP3.',i:'dl',t:'MP4 / MP3',k:'dl',ph:'Tempel tautan Instagram'},\n{id:'youtube',n:'YouTube Clip',d:'Potong bagian video dengan durasi yang bisa diatur.',i:'yt',t:'Atur durasi',k:'yt'},\n{id:'ttstalk',n:'TikTok Stalker',d:'Lihat profil publik, pengikut, dan statistik akun.',i:'us',t:'Profil',k:'st',ph:'Username TikTok'},\n{id:'igstalk',n:'Instagram Stalker',d:'Lihat profil publik, pengikut, dan statistik akun.',i:'us',t:'Profil',k:'st',ph:'Username Instagram'},\n{id:'meme',n:'Meme Foto',d:'Pilih template, tulis teks, lalu unduh.',i:'img',t:'PNG',k:'mm'},\n{id:'stiker',n:'Stiker WhatsApp',d:'Ubah gambar menjadi stiker siap pakai.',i:'st',t:'WebP',k:'sk'},\n{id:'sekali',n:'Lihat Foto 1x Lihat',d:'Buka foto sekali lihat dengan tampilan aman.',i:'eye',t:'Viewer',k:'vo'},\n{id:'mediafire',n:'Lewati Link sfl.gl',d:'Lewati sfl.gl dan dapatkan tautan MediaFire langsung.',i:'lk',t:'MediaFire',k:'mf',ph:'Tempel tautan sfl.gl'}];\nconst $=s=>document.querySelector(s),grid=$('#grid');\nfunction toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.x);toast.x=setTimeout(()=>t.classList.remove('on'),2200)}\nfunction render(list,q){const big=q?[]:list.slice(0,3),rest=q?list:list.slice(3);let h='';\nif(big.length)h+='<div class=\"tiles\">'+big.map((x,i)=>`<a class=\"big b${i}\" href=\"#${x.id}\">${ic(x.i)}<span><b>${x.n}</b><small>${x.d}</small></span></a>`).join('')+'</div>';\nif(rest.length)h+=(q?'':'<h2 class=\"sec\">Alat lainnya</h2>')+'<div class=\"list\">'+rest.map(x=>`<a class=\"lr\" href=\"#${x.id}\">${ic(x.i)}<span><b>${x.n}</b><small>${x.d}</small></span><em>${x.t}</em>${ic('arr')}</a>`).join('')+'</div>';\nif(!list.length)h='<p class=\"mut\" style=\"padding:24px 0\">Tidak ada alat yang cocok. Coba kata lain.</p>';\ngrid.innerHTML=h}\n$('#q').addEventListener('input',e=>{const v=e.target.value.trim().toLowerCase();render(T.filter(x=>(x.n+' '+x.d).toLowerCase().includes(v)),v)});\nconst go=`<button class=\"btn\" onclick=\"run(this)\">`;\nconst seg=a=>`<div class=\"seg\">${a.map((x,i)=>`<button class=\"${i?'':'on'}\" onclick=\"this.parentNode.querySelectorAll('button').forEach(b=>b.classList.remove('on'));this.classList.add('on')\">${x}</button>`).join('')}</div>`;\nconst empty=(k,t)=>`<div class=\"prev\"><div>${ic(k)}<div>${t}</div></div></div>`;\nconst V={\ndl:x=>`<div class=\"cols two\"><div class=\"panel\"><div class=\"f\"><label>Tautan</label><input class=\"in\" placeholder=\"${x.ph}\"></div><div class=\"f\"><label>Format</label>${seg(['MP4 Video','MP3 Audio'])}</div>${go}Proses</button></div><div class=\"panel\">${empty('dl','Hasil unduhan akan tampil di sini')}</div></div>`,\nyt:()=>`<div class=\"cols two\"><div class=\"panel\"><div class=\"f\"><label>Tautan YouTube</label><input class=\"in\" placeholder=\"Tempel tautan video\"></div><div class=\"row f\"><div><label>Mulai</label><input class=\"in\" id=\"ys\" value=\"00:30\" readonly></div><div><label>Selesai</label><input class=\"in\" id=\"ye\" value=\"01:15\" readonly></div></div><div class=\"f\"><label>Geser waktu mulai</label><input type=\"range\" id=\"rs\" min=\"0\" max=\"600\" value=\"30\" oninput=\"yu()\"></div><div class=\"f\"><label>Geser waktu selesai</label><input type=\"range\" id=\"re\" min=\"0\" max=\"600\" value=\"75\" oninput=\"yu()\"></div><p id=\"yd\" style=\"color:var(--ac2);font-size:13.5px;margin-bottom:16px\">Durasi klip: 45 detik</p><div class=\"f\"><label>Kualitas</label>${seg(['360p','720p','1080p'])}</div>${go}Buat klip</button></div><div class=\"panel\">${empty('yt','Pratinjau klip')}</div></div>`,\nst:x=>`<div class=\"cols two\"><div class=\"panel\"><div class=\"f\"><label>Nama pengguna</label><input class=\"in\" placeholder=\"${x.ph}\"></div>${go}Cari akun</button><div class=\"note\">${ic('eye')}<span>Hanya menampilkan data akun yang bersifat publik.</span></div></div><div class=\"panel\"><div class=\"profile\"><div class=\"av\"></div><div style=\"flex:1\"><div class=\"sk\" style=\"width:55%\"></div><div class=\"sk\" style=\"width:35%\"></div></div></div><div class=\"sk\" style=\"width:90%;margin-top:18px\"></div><div class=\"sk\" style=\"width:70%\"></div><div class=\"mini\"><div><b>-</b><br><small style=\"color:var(--mut)\">Pengikut</small></div><div><b>-</b><br><small style=\"color:var(--mut)\">Mengikuti</small></div><div><b>-</b><br><small style=\"color:var(--mut)\">Postingan</small></div></div></div></div>`,\nmm:()=>`<div class=\"cols two\"><div class=\"panel\"><div class=\"f\"><label>Template</label><div class=\"tpls\" id=\"tpls\"><p class=\"mut\">Memuat template...</p></div></div><div class=\"f\"><label for=\"mt\">Teks atas</label><input class=\"in\" id=\"mt\" maxlength=\"120\" placeholder=\"Tulis teks atas\" oninput=\"mu()\"></div><div class=\"f\"><label for=\"mb\">Teks bawah</label><input class=\"in\" id=\"mb\" maxlength=\"120\" placeholder=\"Tulis teks bawah\" oninput=\"mu()\"></div><button class=\"btn\" onclick=\"mdl()\">Unduh meme</button></div><div class=\"panel\"><div class=\"prev\" id=\"mprev\"><canvas id=\"mcv\"></canvas><div id=\"mempty\">${ic('img')}<div>Pilih template untuk melihat pratinjau</div></div></div></div></div>`,\nsk:()=>`<div class=\"cols two\"><div class=\"panel\"><div class=\"prev dz\" style=\"min-height:180px\" onclick=\"pick(this)\">${'<div>'+ic('img')+'<div>Seret gambar ke sini atau ketuk untuk memilih</div></div>'}</div><div class=\"f\" style=\"margin-top:16px\"><label>Nama paket</label><input class=\"in\" placeholder=\"Nama stiker\"></div>${go}Buat stiker</button></div><div class=\"panel\">${empty('st','Pratinjau stiker 512 x 512')}</div></div>`,\nvo:()=>`<div class=\"cols two\"><div class=\"panel\"><div class=\"f\"><label>Media</label><div class=\"prev dz\" style=\"min-height:140px\" onclick=\"pick(this)\"><div>${ic('eye')}<div>Pilih atau tempel media sekali lihat</div></div></div></div>${go}Buka media</button><div class=\"note\">${ic('eye')}<span>Media dibuka di dalam penampil dan tidak disimpan di server.</span></div></div><div class=\"panel\">${empty('img','Media akan tampil di sini')}</div></div>`,\nmf:x=>`<div class=\"cols two\"><div class=\"panel\"><div class=\"f\"><label>Tautan sfl.gl</label><input class=\"in\" placeholder=\"${x.ph}\"></div>${go}Lewati link</button><div class=\"note\">${ic('lk')}<span>Tempel tautan sfl.gl, lalu hasilnya berupa tautan MediaFire langsung.</span></div></div><div class=\"panel\">${empty('lk','Tautan MediaFire akan tampil di sini')}</div></div>`};\nlet MF=null;\nfunction memeFonts(){if(MF)return MF;MF=new Promise(r=>{const l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Anton&family=Archivo+Black&family=Oswald:wght@400;700&family=Comic+Neue:wght@700&display=swap';l.onload=l.onerror=()=>r();document.head.appendChild(l);setTimeout(r,4000)});return MF}\nconst mfW=f=>(f==='Oswald'||f==='Comic Neue')?'700 ':'';\nasync function memeFont(s){await memeFonts();try{await document.fonts.load(mfW(s.font)+'40px \"'+s.font+'\"')}catch(e){}}\nfunction memeWrap(c,t,maxW){const ws=t.split(/\\s+/),out=[];let cur='';for(const w of ws){const x=cur?cur+' '+w:w;if(!cur||c.measureText(x).width<=maxW)cur=x;else{out.push(cur);cur=w}}if(cur)out.push(cur);return out}\nfunction drawMeme(cv,img,s,top,bot){\nconst iw=img.naturalWidth||img.width,ih=img.naturalHeight||img.height,W=Math.min(iw,1080),H=Math.round(ih*W/iw);\ncv.width=W;cv.height=H;const c=cv.getContext('2d');c.drawImage(img,0,0,W,H);\nconst pad=W*.04,maxW=W-2*pad,fam='\"'+s.font+'\",Impact,\"Arial Black\",sans-serif';\nc.textAlign='center';c.lineJoin='round';c.miterLimit=2;c.fillStyle=s.color;c.strokeStyle=s.stroke;\nconst put=(raw,where)=>{let t=String(raw||'').trim();if(!t)return;if(s.upper)t=t.toUpperCase();\nlet size=Math.max(10,Math.round(W*s.size/100)),lines;\nfor(;;){c.font=mfW(s.font)+size+'px '+fam;lines=memeWrap(c,t,maxW);if(Math.max(...lines.map(l=>c.measureText(l).width))<=maxW||size<=12)break;size-=2}\nconst lh=size*1.08;c.lineWidth=size*s.sw/100;\nif(where==='top'){c.textBaseline='top';const y0=H*s.topY/100;lines.forEach((l,i)=>{const y=y0+i*lh;if(s.sw>0)c.strokeText(l,W/2,y);c.fillText(l,W/2,y)})}\nelse{c.textBaseline='bottom';const yb=H-H*s.botY/100;lines.forEach((l,i)=>{const y=yb-(lines.length-1-i)*lh;if(s.sw>0)c.strokeText(l,W/2,y);c.fillText(l,W/2,y)})}};\nput(top,'top');put(bot,'bot')}\n\nlet MM={items:null,cur:null,img:null};\nasync function mmLoad(){const box=$('#tpls');if(!box)return;memeFonts();\ntry{if(!MM.items){const r=await fetch('/memes.json'),d=await r.json();MM.items=d.items||[]}}catch(e){MM.items=[]}\nconst b2=$('#tpls');if(!b2)return;\nif(!MM.items.length){b2.innerHTML='<p class=\"mut\">Belum ada template. Template ditambahkan lewat dasbor admin.</p>';return}\nb2.innerHTML=MM.items.map((m,i)=>`<button type=\"button\" class=\"tp\" data-i=\"${i}\" title=\"${esc(m.name)}\"><img src=\"/mi/${m.id}\" alt=\"${esc(m.name)}\" loading=\"lazy\"></button>`).join('');\nb2.onclick=e=>{const t=e.target.closest('.tp');if(t)mmPick(+t.dataset.i)};mmPick(MM.cur?Math.max(0,MM.items.findIndex(x=>x.id===MM.cur.id)):0)}\nasync function mmPick(i){const m=MM.items&&MM.items[i];if(!m)return;MM.cur=m;document.querySelectorAll('#tpls .tp').forEach((b,k)=>b.classList.toggle('on',k===i));\nawait new Promise(ok=>{const im=new Image();im.onload=()=>{MM.img=im;ok()};im.onerror=()=>{MM.img=null;ok()};im.src='/mi/'+m.id});mu()}\nasync function mu(){const a=$('#mt');if(!a)return;const cv=$('#mcv'),em=$('#mempty');if(!MM.cur||!MM.img){cv.style.display='none';em.style.display='';return}\nawait memeFont(MM.cur);if(!$('#mcv'))return;drawMeme(cv,MM.img,MM.cur,a.value,$('#mb').value);cv.style.display='block';em.style.display='none'}\nfunction mdl(){const cv=$('#mcv');if(!cv||cv.style.display==='none'){toast('Pilih template dulu');return}cv.toBlob(b=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='meme-'+Date.now()+'.png';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);toast('Meme diunduh')},'image/png')}\nconst fm=s=>{s=Math.max(0,Math.floor(s));const h=Math.floor(s/3600),m=Math.floor(s%3600/60),c=s%60,p=v=>String(v).padStart(2,'0');return (h?h+':':'')+p(m)+':'+p(c)};\nfunction yu(){const R=$('#rs'),E=$('#re'),mx=+E.max;let s=+R.value,e=+E.value;if(e<=s){e=Math.min(s+5,mx);if(e<=s)s=Math.max(0,e-1);R.value=s;E.value=e}$('#ys').value=fm(s);$('#ye').value=fm(e);$('#yd').textContent='Durasi klip: '+(e-s)+' detik ('+fm(e-s)+')'}\nfunction pick(el){const i=document.createElement('input');i.type='file';i.accept='image/*,video/*';i.onchange=()=>{const f=i.files[0];if(!f)return;el.innerHTML=f.type.startsWith('image')?'<img>':'<div>'+ic('img')+'<div>'+f.name+'</div></div>';if(f.type.startsWith('image'))el.firstChild.src=URL.createObjectURL(f);toast('Berkas dipilih')};i.click()}\nconst esc=s=>String(s==null?'':s).replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',\"'\":'&#39;'}[c]));\nasync function dl(b,pf){const p=b.closest('.cols'),u=p.querySelector('input.in').value.trim(),out=p.lastElementChild.querySelector('.prev');if(!u){toast('Tempel tautan dulu');return}const old=b.textContent;b.disabled=true;b.textContent='Memproses...';try{const r=await fetch('/api?action='+pf+'&url='+encodeURIComponent(u));const d=await r.json();if(!d.ok)throw new Error(d.error||'Gagal memproses');const mp3=p.querySelector('.seg button.on').textContent.includes('MP3'),a=mp3?d.audio:d.video;if(!a)throw new Error(mp3?'Audio tidak tersedia':'Video tidak tersedia');out.classList.remove('dz');out.innerHTML=(d.cover?'<img src=\"'+esc(d.cover)+'\" style=\"max-width:100%;max-height:200px;border-radius:10px;margin-bottom:12px\">':'')+'<div style=\"width:100%\"><div style=\"color:var(--tx);font-weight:600;margin-bottom:12px\">'+esc(d.title||'Hasil siap')+'</div><a class=\"btn\" href=\"'+esc(a)+'\" target=\"_blank\" rel=\"noopener\" download>Unduh '+(mp3?'MP3':'MP4')+'</a></div>'}catch(e){toast(e.message.startsWith('Unexpected')||e.message.startsWith('Failed')?'Backend belum terhubung':e.message)}b.disabled=false;b.textContent=old}\nfunction avErr(i){if(!i.dataset.t&&i.dataset.d){i.dataset.t=1;i.src=i.dataset.d;return}const d=document.createElement('div');d.className='av';d.style.cssText='width:88px;height:88px;display:grid;place-items:center;font-size:34px;font-weight:700;color:#fff';d.textContent=i.dataset.n;i.replaceWith(d)}\nasync function sp(b,pf){const p=b.closest('.cols'),u=p.querySelector('input.in').value.trim().replace(/^@/,''),out=p.lastElementChild;if(!u){toast('Isi username dulu');return}const old=b.textContent;b.disabled=true;b.textContent='Mencari...';try{const r=await fetch('/api?action='+pf+'&username='+encodeURIComponent(u));const d=await r.json();if(!d.ok)throw new Error(d.error||'Gagal memproses');const x=d.profile,n=v=>v==null?'-':(isNaN(v)?esc(v):Number(v).toLocaleString('id-ID')),m='<br><small style=\"color:var(--mut)\">';out.innerHTML='<div class=\"profile\">'+(x.avatar||x.avatar_src?'<img class=\"av\" alt=\"\" referrerpolicy=\"no-referrer\" data-d=\"'+esc(x.avatar||'')+'\" data-n=\"'+esc((x.name||x.username||u).trim().charAt(0).toUpperCase())+'\" style=\"width:88px;height:88px;object-fit:cover;box-shadow:0 0 0 3px var(--ac)\" src=\"'+esc(x.avatar_src||'/img?u='+encodeURIComponent(x.avatar))+'\" onerror=\"avErr(this)\">':'<div class=\"av\" style=\"width:88px;height:88px;display:grid;place-items:center;font-size:34px;font-weight:700;color:#fff\">'+esc((x.name||x.username||u).trim().charAt(0).toUpperCase())+'</div>')+'<div style=\"min-width:0\"><b style=\"font-size:17px\">'+esc(x.name||x.username||u)+'</b><div style=\"color:var(--mut)\">@'+esc(x.username||u)+'</div></div></div>'+(x.bio?'<p style=\"margin-top:14px;color:var(--mut);white-space:pre-line\">'+esc(x.bio)+'</p>':'')+'<div class=\"mini\"><div><b>'+n(x.followers)+'</b>'+m+'Pengikut</small></div><div><b>'+n(x.following)+'</b>'+m+'Mengikuti</small></div><div><b>'+n(x.posts)+'</b>'+m+'Postingan</small></div></div>'}catch(e){toast(e.message.startsWith('Unexpected')||e.message.startsWith('Failed')?'Backend belum terhubung':e.message)}b.disabled=false;b.textContent=old}\nfunction cp(b){navigator.clipboard.writeText(b.dataset.u).then(()=>toast('Tautan disalin'),()=>toast('Gagal menyalin'))}\nasync function bp(b){const p=b.closest('.cols'),u=p.querySelector('input.in').value.trim(),out=p.lastElementChild.querySelector('.prev');if(!u.toLowerCase().includes('sfl.gl')){toast('Tempel tautan sfl.gl dulu');return}const old=b.textContent;b.disabled=true;b.textContent='Memproses, bisa sampai 30 detik...';try{const r=await fetch('/api?action=mediafire&url='+encodeURIComponent(u));const d=await r.json();if(!d.ok)throw new Error(d.error||'Gagal memproses');out.classList.remove('dz');out.innerHTML='<div style=\"width:100%\"><div style=\"color:var(--tx);font-weight:600;margin-bottom:6px\">Tautan siap ('+esc(d.host||'')+')</div><div style=\"color:var(--mut);font-size:13px;word-break:break-all;margin-bottom:12px\">'+esc(d.url)+'</div><a class=\"btn\" href=\"'+esc(d.url)+'\" target=\"_blank\" rel=\"noopener\">Buka tautan</a><button class=\"btn ghost\" style=\"margin-top:8px\" data-u=\"'+esc(d.url)+'\" onclick=\"cp(this)\">Salin tautan</button></div>'}catch(e){toast(e.message.startsWith('Unexpected')||e.message.startsWith('Failed')?'Backend belum terhubung':e.message)}b.disabled=false;b.textContent=old}\nconst YT_C={};let yiT=0,ytAPI=null;\nfunction yid(u){try{const x=new URL(u),h=x.hostname.toLowerCase();const id=/(^|\\.)youtu\\.be$/.test(h)?x.pathname.slice(1).split('/')[0]:(x.searchParams.get('v')||((x.pathname.match(/^\\/(?:shorts|embed|live|v)\\/([^/?#]+)/)||[])[1]));return /^[A-Za-z0-9_-]{11}$/.test(id||'')?id:null}catch(e){return null}}\nasync function yf(u,q,info){const k=u+'|'+q+(info?'|i':'');if(YT_C[k])return YT_C[k];const r=await fetch('/api?action=youtube&q='+q+(info?'&info=1':'')+'&url='+encodeURIComponent(u));const d=await r.json();if(!d.ok)throw new Error(d.error||'Gagal memproses');YT_C[k]=d;return d}\nfunction ya(d){const n=Math.floor(+d.duration||0),rs=$('#rs'),re=$('#re');if(!rs||n<2)return false;rs.max=re.max=n;rs.value=0;re.value=n;yu();return true}\nfunction yn(){const rs=$('#rs'),re=$('#re');if(rs&&re){rs.max=re.max=3600;yu()}}\nfunction yApi(){if(ytAPI)return ytAPI;ytAPI=new Promise((ok,no)=>{if(window.YT&&YT.Player)return ok();const s=document.createElement('script');s.src='https://www.youtube.com/iframe_api';s.onerror=()=>{ytAPI=null;no(new Error('iframe api gagal dimuat'))};const prev=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=()=>{if(prev)prev();ok()};document.head.appendChild(s);setTimeout(()=>{ytAPI=null;no(new Error('timeout'))},8000)});return ytAPI}\nfunction yDur(id){return new Promise(async(res,rej)=>{try{await yApi()}catch(e){return rej(e)}\nlet host=document.getElementById('ytprobe');if(!host){host=document.createElement('div');host.id='ytprobe';host.style.cssText='position:fixed;left:0;bottom:0;width:200px;height:120px;opacity:.01;pointer-events:none;z-index:-1;overflow:hidden';document.body.appendChild(host)}\nhost.innerHTML='<div id=\"ytpp\"></div>';let done=false,iv,tm,pl;const fin=(f,v)=>{if(done)return;done=true;clearInterval(iv);clearTimeout(tm);try{pl.destroy()}catch(e){}f(v)};\ntry{pl=new YT.Player('ytpp',{width:200,height:120,videoId:id,playerVars:{playsinline:1,controls:0,rel:0},events:{onReady:()=>{iv=setInterval(()=>{let d=0,t='';try{d=pl.getDuration();t=(pl.getVideoData()||{}).title||''}catch(e){}if(d>0)fin(res,{duration:d,title:t})},150)},onError:e=>fin(rej,new Error('embed '+(e&&e.data)))}})}catch(e){return rej(e)}\ntm=setTimeout(()=>fin(rej,new Error('timeout')),9000)})}\nasync function yInfo(u,q,id){const sp=yf(u,q,1).catch(()=>null);const tasks=[yDur(id).then(r=>({...r,src:'peramban'})),sp.then(r=>{if(!r||!(+r.duration>0))throw new Error('tanpa durasi');return {...r,src:'server'}})];let hit=null;try{hit=await Promise.any(tasks)}catch(e){}\nconst s=await Promise.race([sp,new Promise(r=>setTimeout(()=>r(null),hit?2500:100))]);\nreturn {duration:hit?+hit.duration:0,src:hit?hit.src:'',title:(hit&&hit.title)||(s&&s.title)||''}}\nfunction yi(t){clearTimeout(yiT);const u=t.value.trim();if(u.length<15||!/youtu/i.test(u))return;yiT=setTimeout(async()=>{const p=t.closest('.cols'),out=p.lastElementChild.querySelector('.prev'),q=p.querySelector('.seg button.on').textContent.replace('p',''),id=yid(u);if(!id){out.innerHTML=`<div>${ic('yt')}<div>Tautan YouTube tidak valid.</div></div>`;return}\nout.innerHTML=`<div>${ic('yt')}<div>Membaca durasi video...</div></div>`;const r=await yInfo(u,q,id);if(t.value.trim()!==u)return;const ok=r.duration>=2;if(ok)ya(r);else yn();\nout.innerHTML=`<div style='width:100%'><img src='https://i.ytimg.com/vi/${id}/hqdefault.jpg' referrerpolicy='no-referrer' style='max-width:100%;max-height:180px;border-radius:10px;margin-bottom:12px'><div style='color:var(--tx);font-weight:600;margin-bottom:6px'>${esc(r.title||'Video ditemukan')}</div><div style='color:${ok?'var(--ac2)':'var(--mut)'};font-size:13px'>${ok?'Durasi video '+fm(r.duration)+' ('+r.src+'). Slider sudah disesuaikan.':'Durasi tidak terbaca, atur manual dengan slider.'}</div></div>`;yf(u,q).catch(()=>{})},250)}\nif(location.hash==='#youtube')yApi().catch(()=>{});addEventListener('hashchange',()=>{if(location.hash==='#youtube')yApi().catch(()=>{})});\ndocument.addEventListener('input',e=>{const t=e.target;if(location.hash==='#youtube'&&t.classList&&t.classList.contains('in')&&!t.id&&t.closest('.cols'))yi(t)});\nasync function yc(b){const p=b.closest('.cols'),u=p.querySelector('input.in').value.trim(),out=p.lastElementChild.querySelector('.prev'),id=yid(u);if(!id){toast('Tempel tautan YouTube dulu');return}const qn=p.querySelector('.seg button.on').textContent.replace('p',''),s=+$('#rs').value,e=+$('#re').value,old=b.textContent;b.disabled=true;b.textContent='Memproses...';out.classList.remove('dz');\nout.innerHTML=`<div style='width:100%'><div style='position:relative;padding-top:56.25%;border-radius:10px;overflow:hidden;background:#000'><iframe src='https://www.youtube.com/embed/${id}?start=${s}&end=${e}&rel=0&playsinline=1&modestbranding=1' style='position:absolute;inset:0;width:100%;height:100%;border:0' allow='autoplay; encrypted-media; picture-in-picture; fullscreen' allowfullscreen></iframe></div><div style='color:var(--tx);font-weight:600;margin:12px 0 4px'>Klip ${fm(s)} - ${fm(e)} (${e-s} detik)</div><div id='ynote' style='color:var(--mut);font-size:13px;margin-bottom:12px'>Pratinjau klip siap. Mengambil tautan unduhan...</div><div id='ydl'></div></div>`;\ntry{const d=await yf(u,qn);if(!d.video&&!d.audio)throw new Error('Video tidak tersedia');$('#ynote').textContent='File unduhan berisi video penuh, bukan hanya bagian klip.';$('#ydl').innerHTML=(d.video?`<a class='btn' href='${esc(d.video)}' target='_blank' rel='noopener' download>Unduh video</a>`:'')+(d.audio?`<a class='btn ghost' style='margin-top:8px' href='${esc(d.audio)}' target='_blank' rel='noopener' download>Unduh audio (M4A)</a>`:'')}catch(x){const n=$('#ynote');if(n)n.textContent='Pratinjau klip jalan, tetapi tautan unduhan belum tersedia: '+x.message}\nb.disabled=false;b.textContent=old}\nfunction run(b){const h=location.hash.slice(1);if(h==='mediafire')return bp(b);if(h==='youtube')return yc(b);if(h==='tiktok'||h==='instagram')return dl(b,h);if(h==='ttstalk'||h==='igstalk')return sp(b,h);const old=b.textContent;b.disabled=true;b.textContent='Memproses...';const p=b.closest('.cols').lastElementChild;setTimeout(()=>{b.disabled=false;b.textContent=old;const pv=p.querySelector('.prev');if(p.querySelector('.mini')){p.innerHTML='<div class=\"profile\"><div class=\"av\"></div><div><b style=\"font-size:17px\">@username</b><div style=\"color:var(--mut)\">Akun contoh</div></div></div><div class=\"mini\"><div><b>12,4 rb</b><br><small style=\"color:var(--mut)\">Pengikut</small></div><div><b>310</b><br><small style=\"color:var(--mut)\">Mengikuti</small></div><div><b>86</b><br><small style=\"color:var(--mut)\">Postingan</small></div></div>'}else if(pv){pv.classList.remove('dz');pv.innerHTML='<div>'+ic('dl')+'<div style=\"color:var(--tx);font-weight:600;margin:6px 0 12px\">Hasil siap</div><button class=\"btn ghost\" style=\"width:auto;padding:0 24px\" onclick=\"toast(\\'Contoh tampilan unduhan\\')\">Unduh file</button></div>'}else toast('Selesai');},1100)}\nfunction route(){const h=location.hash.slice(1),x=T.find(t=>t.id===h),tv=$('#tool'),hm=$('#home');document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+h));\nif(h==='bantuan'){tv.innerHTML=`<button class=\"back\" onclick=\"location.hash=''\">${ic('arr').replace('<svg','<svg style=\"transform:scaleX(-1)\"')}Kembali</button><div class=\"thead\"><div><h2>Bantuan</h2><p>Pertanyaan yang sering diajukan</p></div></div><div class=\"faq\"><details open><summary>Apakah AlzTools gratis?</summary><p>Ya, semua fitur dapat dipakai tanpa daftar.</p></details><details><summary>Format apa saja yang didukung?</summary><p>Video MP4 dan audio MP3 untuk fitur unduhan.</p></details><details><summary>Siapa yang mengatur template meme?</summary><p>Admin mengelola template, font, ukuran, dan posisi teks.</p></details><details><summary>Apakah media saya disimpan?</summary><p>Tidak, berkas diproses sementara lalu dihapus.</p></details></div>`;hm.classList.remove('on');tv.classList.remove('on');void tv.offsetWidth;tv.classList.add('on');scrollTo(0,0);return}\nif(!x){tv.classList.remove('on');hm.classList.add('on');return}\ntv.innerHTML=`<button class=\"back\" onclick=\"location.hash=''\">${ic('arr').replace('<svg','<svg style=\"transform:scaleX(-1)\"')}Kembali</button><div class=\"thead\"><div class=\"cic\" style=\"margin:0\">${ic(x.i)}</div><div><h2>${x.n}</h2><p>${x.d}</p></div></div>${V[x.k](x)}`;\nhm.classList.remove('on');tv.classList.remove('on');void tv.offsetWidth;tv.classList.add('on');scrollTo(0,0);if(x.k==='mm')mmLoad()}\naddEventListener('hashchange',route);render(T,'');route();\n\n</script>\n</body>\n</html>\n";

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
// Bawaan: instance publik Xenox (tanpa key). Tambah cadangan lewat env SFL_API1_URL ... SFL_API6_URL (lihat README di bawah).
//   SFL_APIn_URL     alamat API. Pakai {u} untuk link ter-encode. GET: kalau tidak ada {u}, ?url=... ditambahkan otomatis.
//   SFL_APIn_METHOD  GET (default) atau POST
//   SFL_APIn_HEADERS JSON header, contoh {"Authorization":"Bearer KEY"}
//   SFL_APIn_BODY    body POST, default {"url":"{raw}"}   ({raw} = link asli, {u} = ter-encode)
//   SFL_BUILTIN=0    matikan API bawaan.   SFL_TIMEOUT_MS  batas total (default 55000)
const SFL_HOST = /(^|\.)(sfl\.gl|safelinku\.com|idsly\.com|idsly\.bid)$/i;
const SFL_BUILTIN = [
  { name: 'xenox', url: 'https://bypass-url-omega.vercel.app/api/mgvt?url={u}', method: 'GET', headers: {} },
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
async function sflRun(e, raw, signal) {
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
  if (!engs.length) return send(500, { ok: false, error: 'Belum ada API bypass. Isi SFL_API1_URL di Vercel.' });
  const ac = new AbortController(), timer = setTimeout(() => ac.abort(), +env.SFL_TIMEOUT_MS || 55000), errs = [];
  try {
    const hit = await Promise.any(engs.map(async e => {
      try { return { via: e.name, url: await sflRun(e, raw, ac.signal) }; }
      catch (er) { errs.push(e.name + ': ' + ((er && er.message) || er)); throw er; }
    }));
    ac.abort();
    return send(200, { ok: true, url: hit.url, host: new URL(hit.url).hostname, ...(env.DEBUG === '1' ? { via: hit.via, tried: errs } : {}) });
  } catch (e) {
    return send(502, { ok: false, error: 'Semua API bypass gagal atau sedang down. Coba lagi sebentar lagi.', ...(env.DEBUG === '1' ? { tried: errs } : {}) });
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
  const send = (code, obj) => { res.status(code).setHeader('Cache-Control', 'no-store').json(obj); };
  const env = process.env;
  const q = req.query || {};
  const sv = SV[q.action];
  if (!sv) return send(400, { ok: false, error: 'Aksi tidak dikenal.' });
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
const ADMIN_HTML = "<!DOCTYPE html>\n<html lang=\"id\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover\">\n<meta name=\"robots\" content=\"noindex,nofollow\">\n<title>Admin - AlzTools</title>\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\"><link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n<link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&display=swap\">\n<style>\n:root{color-scheme:light dark;--bg:#eef0f2;--sf:#fff;--sf2:#f6f7f8;--line:#d5dade;--tx:#16181b;--mut:#596069;--ac:#ffc800;--onac:#16181b;--ac2:#7a5c00;--err:#b3261e;--ok:#17703a;box-sizing:border-box;padding-top:env(safe-area-inset-top,0);padding-bottom:env(safe-area-inset-bottom,0)}\n@media(prefers-color-scheme:dark){:root{--bg:#121417;--sf:#1b1e22;--sf2:#22262b;--line:#2f353c;--tx:#eef0f2;--mut:#9aa3ac;--ac2:#ffc800;--err:#ff8a80;--ok:#6fd49a}}\n*,*::before,*::after{box-sizing:border-box;margin:0}\nbody{background:var(--bg);color:var(--tx);font:15px/1.5 \"Archivo\",system-ui,-apple-system,\"Segoe UI\",Roboto,sans-serif;min-height:100%;overflow-x:hidden}\nbutton,input,select,textarea{font:inherit;color:inherit}\n:focus-visible{outline:2px solid var(--tx);outline-offset:2px}\n.wrap{max-width:860px;margin:0 auto;padding:0 16px}\nheader{border-bottom:1px solid var(--line);background:var(--bg);position:sticky;top:env(safe-area-inset-top,0);z-index:20}\n.top{display:flex;align-items:center;justify-content:space-between;height:56px}\n.brand{display:flex;align-items:center;gap:10px}\n.mark{width:30px;height:30px;border-radius:8px;background:var(--ac);display:grid;place-items:center}\n.mark svg{width:20px;height:20px}\n.wm{font-weight:800;font-stretch:118%;font-size:19px;letter-spacing:-.01em}\n.wm small{font-weight:500;font-stretch:100%;font-size:13px;color:var(--mut);margin-left:6px;letter-spacing:0}\n.lnk{background:none;border:0;color:var(--mut);cursor:pointer;padding:8px 2px;font-size:14px}\n.lnk:hover{color:var(--tx)}\n.tabs{display:flex;gap:4px;margin-top:-1px}\n.tabs button{flex:1;background:none;border:0;border-bottom:3px solid transparent;color:var(--mut);height:44px;cursor:pointer;font-weight:600}\n.tabs button.on{color:var(--tx);border-bottom-color:var(--ac)}\nmain{padding:22px 0 90px}\nh2{font-size:24px;font-weight:800;font-stretch:112%;letter-spacing:-.01em;line-height:1.15}\nh3{font-size:17px;font-weight:700}\n.mut{color:var(--mut)}\n.bar2{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;margin:0 0 16px;flex-wrap:wrap}\n.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:44px;padding:0 18px;border:0;border-radius:10px;background:var(--ac);color:var(--onac);font-weight:700;cursor:pointer;text-decoration:none}\n.btn:active{transform:translateY(1px)}\n.btn[disabled]{opacity:.6;cursor:wait}\n.btn.ghost{background:transparent;border:1px solid var(--line);color:var(--tx)}\n.btn.warn{background:transparent;border:1px solid var(--line);color:var(--err)}\n.btn.sm{height:36px;padding:0 14px;font-size:14px}\n.panel{background:var(--sf);border:1px solid var(--line);border-radius:14px;padding:16px;margin-bottom:12px}\n.note{border-left:3px solid var(--ac);background:var(--sf2);border-radius:8px;padding:10px 12px;font-size:14px;margin:12px 0 18px}\n.note.bad{border-left-color:var(--err)}\n.empty{border:1px dashed var(--line);border-radius:12px;padding:26px 16px;text-align:center;color:var(--mut)}\n.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:16px 0}\n.stats div{background:var(--sf);border:1px solid var(--line);border-radius:12px;padding:12px}\n.stats b{display:block;font-size:22px;font-weight:800;font-stretch:112%}\n.stats span{font-size:13px;color:var(--mut)}\nol{padding-left:20px;margin:8px 0}\nli{margin:4px 0}\ncode{background:var(--sf2);border:1px solid var(--line);border-radius:5px;padding:1px 5px;font-size:13px;word-break:break-all}\nlabel{display:block;font-size:13px;font-weight:600;margin:0 0 5px}\n.in,select.in{width:100%;height:44px;background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:0 12px}\n.in:focus{outline:0;border-color:var(--tx);box-shadow:0 0 0 1px var(--tx)}\ninput[type=color].in{padding:3px;height:44px;cursor:pointer}\ninput[type=range]{width:100%;accent-color:var(--tx);height:28px}\n.f{margin-bottom:12px}\n.g2{display:grid;grid-template-columns:1fr 1fr;gap:10px}\n.chk{display:flex;align-items:center;gap:10px;font-weight:600;font-size:14px;margin:4px 0 12px;cursor:pointer}\n.chk input{width:20px;height:20px;accent-color:var(--tx)}\n.hint{font-size:13px;color:var(--mut);margin-top:4px}\n.mrow{display:flex;align-items:center;gap:12px;background:var(--sf);border:1px solid var(--line);border-radius:12px;padding:10px;margin-bottom:8px}\n.mrow img{width:60px;height:60px;object-fit:cover;border-radius:8px;background:var(--sf2);flex:none}\n.mrow .mt{flex:1;min-width:0}\n.mrow .mt b{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n.chip{font-size:12.5px;color:var(--mut)}.chip.on{color:var(--ok)}\n.acts{display:flex;gap:6px;align-items:center}\n.acts .ic{width:36px;height:36px;border:1px solid var(--line);background:none;border-radius:9px;cursor:pointer;font-size:16px}\n.acts .ic[disabled]{opacity:.35}\n.sheet{position:fixed;inset:0;z-index:40;background:var(--bg);overflow:auto;padding-bottom:30px}\n.sheet .stop{position:sticky;top:0;z-index:2;background:var(--bg);border-bottom:1px solid var(--line);padding:calc(8px + env(safe-area-inset-top,0)) 16px 8px;display:flex;justify-content:space-between;align-items:center;gap:8px}\n.prevbox{background:repeating-conic-gradient(var(--line) 0 25%,transparent 0 50%) 0 0/16px 16px;border:1px solid var(--line);border-radius:12px;padding:8px;margin-bottom:14px;display:grid;place-items:center}\n.prevbox canvas{max-width:100%;max-height:52vh;border-radius:6px}\n.row2{display:flex;justify-content:space-between;align-items:baseline;gap:8px}\n.row2 output{font-size:13px;color:var(--mut)}\n.pc{background:var(--sf);border:1px solid var(--line);border-radius:14px;padding:14px;margin-bottom:10px}\n.pc .hd{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:10px}\n.qr{display:flex;gap:12px;align-items:center;margin-bottom:12px}\n.qr img{width:84px;height:84px;object-fit:contain;background:#fff;border:1px solid var(--line);border-radius:8px}\n.savebar{position:fixed;left:0;right:0;bottom:0;z-index:15;background:var(--bg);border-top:1px solid var(--line);padding:10px 16px calc(10px + env(safe-area-inset-bottom,0))}\n.savebar .btn{width:100%;max-width:828px;display:flex;margin:0 auto}\n.toast{position:fixed;left:50%;bottom:calc(78px + env(safe-area-inset-bottom,0));transform:translate(-50%,10px);background:var(--tx);color:var(--bg);padding:10px 16px;border-radius:10px;opacity:0;pointer-events:none;transition:.2s;z-index:60;font-size:14px;max-width:90vw}\n.toast.on{opacity:1;transform:translate(-50%,0)}\n@media(prefers-reduced-motion:reduce){*{transition:none!important}}\n@media(max-width:420px){.g2{grid-template-columns:1fr}}\n</style>\n</head>\n<body>\n<header><div class=\"wrap\">\n<div class=\"top\"><div class=\"brand\"><span class=\"mark\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#16181b\" stroke-width=\"3.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4.5 20 12 4l7.5 16M8.3 14.5h7.4\"/></svg></span><span class=\"wm\">AlzTools<small>Admin</small></span></div><button class=\"lnk\" id=\"out\">Keluar</button></div>\n<div class=\"tabs\" id=\"tabs\"><button data-t=\"home\" class=\"on\">Ringkasan</button><button data-t=\"meme\">Meme</button><button data-t=\"vip\">VIP</button></div>\n</div></header>\n<main class=\"wrap\" id=\"app\"><p class=\"mut\">Memuat...</p></main>\n<div class=\"toast\" id=\"toast\"></div>\n<script>\nlet MF=null;\nfunction memeFonts(){if(MF)return MF;MF=new Promise(r=>{const l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Anton&family=Archivo+Black&family=Oswald:wght@400;700&family=Comic+Neue:wght@700&display=swap';l.onload=l.onerror=()=>r();document.head.appendChild(l);setTimeout(r,4000)});return MF}\nconst mfW=f=>(f==='Oswald'||f==='Comic Neue')?'700 ':'';\nasync function memeFont(s){await memeFonts();try{await document.fonts.load(mfW(s.font)+'40px \"'+s.font+'\"')}catch(e){}}\nfunction memeWrap(c,t,maxW){const ws=t.split(/\\s+/),out=[];let cur='';for(const w of ws){const x=cur?cur+' '+w:w;if(!cur||c.measureText(x).width<=maxW)cur=x;else{out.push(cur);cur=w}}if(cur)out.push(cur);return out}\nfunction drawMeme(cv,img,s,top,bot){\nconst iw=img.naturalWidth||img.width,ih=img.naturalHeight||img.height,W=Math.min(iw,1080),H=Math.round(ih*W/iw);\ncv.width=W;cv.height=H;const c=cv.getContext('2d');c.drawImage(img,0,0,W,H);\nconst pad=W*.04,maxW=W-2*pad,fam='\"'+s.font+'\",Impact,\"Arial Black\",sans-serif';\nc.textAlign='center';c.lineJoin='round';c.miterLimit=2;c.fillStyle=s.color;c.strokeStyle=s.stroke;\nconst put=(raw,where)=>{let t=String(raw||'').trim();if(!t)return;if(s.upper)t=t.toUpperCase();\nlet size=Math.max(10,Math.round(W*s.size/100)),lines;\nfor(;;){c.font=mfW(s.font)+size+'px '+fam;lines=memeWrap(c,t,maxW);if(Math.max(...lines.map(l=>c.measureText(l).width))<=maxW||size<=12)break;size-=2}\nconst lh=size*1.08;c.lineWidth=size*s.sw/100;\nif(where==='top'){c.textBaseline='top';const y0=H*s.topY/100;lines.forEach((l,i)=>{const y=y0+i*lh;if(s.sw>0)c.strokeText(l,W/2,y);c.fillText(l,W/2,y)})}\nelse{c.textBaseline='bottom';const yb=H-H*s.botY/100;lines.forEach((l,i)=>{const y=yb-(lines.length-1-i)*lh;if(s.sw>0)c.strokeText(l,W/2,y);c.fillText(l,W/2,y)})}};\nput(top,'top');put(bot,'bot')}\n\nconst $=s=>document.querySelector(s);\nconst esc=s=>String(s==null?'':s).replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',\"'\":'&#39;'}[c]));\nconst rp=n=>'Rp '+Number(n||0).toLocaleString('id-ID');\nconst S={db:'',fonts:[],memes:[],vip:{plans:[],methods:[]},tab:'home',ed:null};\nfunction toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.x);toast.x=setTimeout(()=>t.classList.remove('on'),2600)}\nasync function api(m,p,b){const r=await fetch(p,{method:m,headers:{'Content-Type':'application/json','X-Alz':'1'},body:b?JSON.stringify(b):undefined});let d=null;try{d=await r.json()}catch(e){}\nif(r.status===401){location.href='/loginadmn';throw new Error('Sesi habis')}\nif(!d||!d.ok)throw new Error((d&&d.error)||'Gagal ('+r.status+')');return d}\nfunction loadImg(file){return new Promise((ok,no)=>{const u=URL.createObjectURL(file),i=new Image();i.onload=()=>{URL.revokeObjectURL(u);ok(i)};i.onerror=()=>{URL.revokeObjectURL(u);no(new Error('Gambar tidak bisa dibaca'))};i.src=u})}\nasync function shrink(file,max,q){const i=await loadImg(file),k=Math.min(1,max/Math.max(i.naturalWidth,i.naturalHeight)),w=Math.round(i.naturalWidth*k),h=Math.round(i.naturalHeight*k),c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,w,h);x.drawImage(i,0,0,w,h);return c.toDataURL('image/jpeg',q)}\nasync function upFile(file,max){let q=.86,d=await shrink(file,max,q);while(d.length>1.7e6&&q>.5){q-=.1;d=await shrink(file,max,q)}return (await api('POST','/admin/api/upload',{data:d})).id}\nfunction pickFile(cb){const i=document.createElement('input');i.type='file';i.accept='image/*';i.onchange=()=>{if(i.files[0])cb(i.files[0])};i.click()}\n\n/* ---------- Ringkasan ---------- */\nfunction vHome(){const m=S.memes,v=S.vip,on=a=>a.filter(x=>x.active!==false).length;\nreturn `<h2>Ringkasan</h2><p class=\"mut\" style=\"margin-top:4px\">Atur isi situs dari sini.</p>\n${S.db==='supabase'?'<div class=\"note\">Penyimpanan permanen aktif (Supabase).</div>':`<div class=\"note bad\"><b>Data belum disimpan permanen.</b> Perubahan hanya ada di memori server dan hilang saat server restart. Supaya permanen:<ol><li>Buat proyek di Supabase, buka SQL Editor, jalankan isi berkas <code>supabase.sql</code>.</li><li>Di Vercel isi <code>SUPABASE_URL</code> dan <code>SUPABASE_SERVICE_KEY</code> (kunci service_role).</li><li>Redeploy.</li></ol></div>`}\n<div class=\"stats\"><div><b>${on(m)}/${m.length}</b><span>Template meme tampil</span></div><div><b>${on(v.plans)}/${v.plans.length}</b><span>Paket VIP aktif</span></div><div><b>${on(v.methods)}/${v.methods.length}</b><span>Metode bayar aktif</span></div></div>\n<a class=\"btn ghost\" href=\"/\" target=\"_blank\" rel=\"noopener\">Buka situs</a>`}\n\n/* ---------- Meme ---------- */\nfunction vMeme(){return `<div class=\"bar2\"><div><h2>Template meme</h2><p class=\"mut\" style=\"margin-top:4px\">Gambar dan gaya teks untuk fitur Meme Foto.</p></div><button class=\"btn\" id=\"addm\">Tambah gambar</button></div>\n${S.memes.length?S.memes.map((m,i)=>`<div class=\"mrow\"><img src=\"/mi/${m.id}\" alt=\"\" loading=\"lazy\"><div class=\"mt\"><b>${esc(m.name)}</b><span class=\"chip ${m.active?'on':''}\">${m.active?'Tampil di situs':'Disembunyikan'}</span></div><div class=\"acts\"><button class=\"ic\" data-up=\"${i}\" aria-label=\"Naikkan\" ${i?'':'disabled'}>&uarr;</button><button class=\"ic\" data-dn=\"${i}\" aria-label=\"Turunkan\" ${i<S.memes.length-1?'':'disabled'}>&darr;</button><button class=\"btn sm\" data-ed=\"${i}\">Atur</button></div></div>`).join(''):'<div class=\"empty\">Belum ada template. Ketuk Tambah gambar untuk memulai.</div>'}`}\nasync function saveMemes(){const r=await api('PUT','/admin/api/memes',{memes:S.memes});S.memes=r.memes}\nasync function addMeme(file){const b=$('#addm');b.disabled=true;b.textContent='Mengunggah...';try{const id=await upFile(file,1200);S.memes.push({id,name:file.name.replace(/\\.[^.]+$/,'').slice(0,60)||'Template',active:true,font:'Anton',size:9,color:'#ffffff',stroke:'#000000',sw:12,upper:true,topY:3,botY:3});await saveMemes();render();openEd(S.memes.length-1)}catch(e){toast(e.message);render()}}\nlet D=null,EIMG=null,ET={t:'TEKS ATAS',b:'TEKS BAWAH'};\nasync function openEd(i){S.ed=i;D={...S.memes[i]};ET={t:'Teks atas contoh',b:'Teks bawah contoh'};await loadEdImg('/mi/'+D.id);edDraw();sheet()}\nfunction loadEdImg(src){return new Promise(ok=>{const im=new Image();im.onload=()=>{EIMG=im;ok()};im.onerror=()=>{EIMG=null;ok()};im.src=src})}\nasync function edDraw(){const cv=$('#edcv');if(!cv||!EIMG)return;await memeFont(D);drawMeme(cv,EIMG,D,ET.t,ET.b)}\nfunction rng(k,l,a,b,st){return `<div class=\"f\"><div class=\"row2\"><label for=\"e_${k}\">${l}</label><output id=\"o_${k}\">${D[k]}</output></div><input id=\"e_${k}\" data-k=\"${k}\" type=\"range\" min=\"${a}\" max=\"${b}\" step=\"${st}\" value=\"${D[k]}\"></div>`}\nfunction sheet(){let el=$('#sheet');if(!el){el=document.createElement('div');el.id='sheet';el.className='sheet';document.body.appendChild(el);document.body.style.overflow='hidden'}\nel.innerHTML=`<div class=\"stop\"><button class=\"lnk\" id=\"edx\">Tutup</button><b>Atur template</b><button class=\"btn sm\" id=\"eds\">Simpan</button></div>\n<div class=\"wrap\" style=\"padding-top:16px\"><div class=\"prevbox\"><canvas id=\"edcv\"></canvas></div>\n<div class=\"g2\"><div class=\"f\"><label for=\"et\">Contoh teks atas</label><input class=\"in\" id=\"et\" value=\"${esc(ET.t)}\" maxlength=\"80\"></div><div class=\"f\"><label for=\"eb\">Contoh teks bawah</label><input class=\"in\" id=\"eb\" value=\"${esc(ET.b)}\" maxlength=\"80\"></div></div>\n<div class=\"f\"><label for=\"e_name\">Nama template</label><input class=\"in\" id=\"e_name\" data-k=\"name\" value=\"${esc(D.name)}\" maxlength=\"60\"></div>\n<label class=\"chk\"><input type=\"checkbox\" id=\"e_active\" data-k=\"active\" ${D.active?'checked':''}>Tampilkan di situs</label>\n<div class=\"f\"><label for=\"e_font\">Font</label><select class=\"in\" id=\"e_font\" data-k=\"font\">${S.fonts.map(f=>`<option ${f===D.font?'selected':''}>${esc(f)}</option>`).join('')}</select><p class=\"hint\">Impact dan Arial Black hanya ada di sebagian perangkat. Anton mirip Impact dan selalu tampil.</p></div>\n${rng('size','Ukuran teks (% lebar gambar)',3,20,0.5)}\n<div class=\"g2\"><div class=\"f\"><label for=\"e_color\">Warna teks</label><input class=\"in\" type=\"color\" id=\"e_color\" data-k=\"color\" value=\"${D.color}\"></div><div class=\"f\"><label for=\"e_stroke\">Warna garis tepi</label><input class=\"in\" type=\"color\" id=\"e_stroke\" data-k=\"stroke\" value=\"${D.stroke}\"></div></div>\n${rng('sw','Tebal garis tepi',0,25,1)}\n<label class=\"chk\"><input type=\"checkbox\" id=\"e_upper\" data-k=\"upper\" ${D.upper?'checked':''}>Huruf kapital semua</label>\n${rng('topY','Jarak teks atas dari tepi atas (%)',0,60,1)}\n${rng('botY','Jarak teks bawah dari tepi bawah (%)',0,60,1)}\n<div style=\"display:flex;gap:10px;flex-wrap:wrap;margin-top:6px\"><button class=\"btn ghost\" id=\"edimg\">Ganti gambar</button><button class=\"btn warn\" id=\"edel\">Hapus template</button></div></div>`;\nedDraw()}\nfunction closeEd(){const el=$('#sheet');if(el)el.remove();document.body.style.overflow='';S.ed=null;D=null}\nasync function saveEd(){const b=$('#eds');b.disabled=true;b.textContent='Menyimpan...';try{S.memes[S.ed]=D;await saveMemes();closeEd();render();toast('Template disimpan')}catch(e){toast(e.message);b.disabled=false;b.textContent='Simpan'}}\nasync function delEd(){if(!confirm('Hapus template ini? Tindakan ini tidak bisa dibatalkan.'))return;try{S.memes.splice(S.ed,1);await saveMemes();closeEd();render();toast('Template dihapus')}catch(e){toast(e.message)}}\n\n/* ---------- VIP ---------- */\nconst KIND={bank:'Transfer bank',ewallet:'E-wallet',qris:'QRIS'};\nfunction planCard(p,i){return `<div class=\"pc\" data-pi=\"${i}\"><div class=\"hd\"><b>Paket ${i+1}</b><button class=\"btn warn sm\" data-delp=\"${i}\">Hapus</button></div>\n<div class=\"f\"><label>Nama paket</label><input class=\"in\" data-f=\"name\" value=\"${esc(p.name)}\" maxlength=\"40\" placeholder=\"Contoh: VIP Bulanan\"></div>\n<div class=\"g2\"><div class=\"f\"><label>Harga (Rp)</label><input class=\"in\" data-f=\"price\" type=\"number\" inputmode=\"numeric\" min=\"0\" step=\"500\" value=\"${p.price}\"><p class=\"hint\" data-pv>${rp(p.price)}</p></div><div class=\"f\"><label>Durasi (hari)</label><input class=\"in\" data-f=\"days\" type=\"number\" inputmode=\"numeric\" min=\"1\" value=\"${p.days}\"></div></div>\n<div class=\"f\"><label>Catatan</label><input class=\"in\" data-f=\"note\" value=\"${esc(p.note)}\" maxlength=\"120\" placeholder=\"Opsional\"></div>\n<label class=\"chk\" style=\"margin-bottom:0\"><input type=\"checkbox\" data-f=\"active\" ${p.active!==false?'checked':''}>Paket aktif</label></div>`}\nfunction methCard(m,i){return `<div class=\"pc\" data-mi=\"${i}\"><div class=\"hd\"><b>Metode ${i+1}</b><button class=\"btn warn sm\" data-delm=\"${i}\">Hapus</button></div>\n<div class=\"g2\"><div class=\"f\"><label>Jenis</label><select class=\"in\" data-f=\"kind\">${Object.keys(KIND).map(k=>`<option value=\"${k}\" ${k===m.kind?'selected':''}>${KIND[k]}</option>`).join('')}</select></div><div class=\"f\"><label>Nama</label><input class=\"in\" data-f=\"name\" value=\"${esc(m.name)}\" maxlength=\"40\" placeholder=\"Contoh: DANA atau BCA\"></div></div>\n${m.kind==='qris'?`<div class=\"qr\">${m.qris?`<img src=\"/mi/${m.qris}\" alt=\"QRIS\">`:'<div class=\"empty\" style=\"padding:18px 10px;flex:none;width:84px;height:84px;font-size:12px\">Belum ada</div>'}<div><button class=\"btn ghost sm\" data-qr=\"${i}\">${m.qris?'Ganti gambar QRIS':'Unggah gambar QRIS'}</button></div></div>`:''}\n<div class=\"g2\"><div class=\"f\"><label>${m.kind==='bank'?'Nomor rekening':m.kind==='ewallet'?'Nomor HP / akun':'Nomor (opsional)'}</label><input class=\"in\" data-f=\"account\" value=\"${esc(m.account)}\" maxlength=\"60\" inputmode=\"numeric\"></div><div class=\"f\"><label>Atas nama</label><input class=\"in\" data-f=\"holder\" value=\"${esc(m.holder)}\" maxlength=\"60\"></div></div>\n<div class=\"f\"><label>Catatan</label><input class=\"in\" data-f=\"note\" value=\"${esc(m.note)}\" maxlength=\"160\" placeholder=\"Opsional, misalnya konfirmasi lewat WhatsApp\"></div>\n<label class=\"chk\" style=\"margin-bottom:0\"><input type=\"checkbox\" data-f=\"active\" ${m.active!==false?'checked':''}>Metode aktif</label></div>`}\nfunction vVip(){const v=S.vip;return `<h2>VIP</h2><div class=\"note\">Halaman ini hanya menyimpan harga dan metode pembayaran. Cara kerja VIP untuk pengguna belum diaktifkan di situs.</div>\n<div class=\"bar2\"><h3>Paket dan harga</h3><button class=\"btn sm\" id=\"addp\">Tambah paket</button></div>${v.plans.length?v.plans.map(planCard).join(''):'<div class=\"empty\">Belum ada paket.</div>'}\n<div class=\"bar2\" style=\"margin-top:26px\"><h3>Metode pembayaran</h3><button class=\"btn sm\" id=\"addmt\">Tambah metode</button></div>${v.methods.length?v.methods.map(methCard).join(''):'<div class=\"empty\">Belum ada metode pembayaran.</div>'}\n<div class=\"savebar\"><button class=\"btn\" id=\"savevip\">Simpan perubahan VIP</button></div>`}\nasync function saveVip(){const b=$('#savevip');b.disabled=true;b.textContent='Menyimpan...';try{const r=await api('PUT','/admin/api/vip',{vip:S.vip});S.vip=r.vip;toast('Pengaturan VIP disimpan')}catch(e){toast(e.message)}b.disabled=false;b.textContent='Simpan perubahan VIP'}\n\n/* ---------- Render + peristiwa ---------- */\nfunction render(){const a=$('#app');a.innerHTML=S.tab==='home'?vHome():S.tab==='meme'?vMeme():vVip();document.querySelectorAll('#tabs button').forEach(b=>b.classList.toggle('on',b.dataset.t===S.tab))}\n$('#tabs').onclick=e=>{const b=e.target.closest('button');if(!b)return;S.tab=b.dataset.t;render();scrollTo(0,0)};\n$('#out').onclick=async()=>{try{await api('POST','/admin/logout')}catch(e){}location.href='/loginadmn'};\n$('#app').addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;\nif(t.id==='addm')return pickFile(addMeme);\nif(t.dataset.ed!=null)return openEd(+t.dataset.ed);\nconst mv=async(i,d)=>{const j=i+d;if(j<0||j>=S.memes.length)return;[S.memes[i],S.memes[j]]=[S.memes[j],S.memes[i]];render();try{await saveMemes()}catch(x){toast(x.message)}};\nif(t.dataset.up!=null)return mv(+t.dataset.up,-1);if(t.dataset.dn!=null)return mv(+t.dataset.dn,1);\nconst v=S.vip;\nif(t.id==='addp'){v.plans.push({id:'',name:'',price:0,days:30,note:'',active:true});render();return}\nif(t.id==='addmt'){v.methods.push({id:'',kind:'bank',name:'',account:'',holder:'',note:'',qris:null,active:true});render();return}\nif(t.dataset.delp!=null){if(confirm('Hapus paket ini?')){v.plans.splice(+t.dataset.delp,1);render()}return}\nif(t.dataset.delm!=null){if(confirm('Hapus metode ini?')){v.methods.splice(+t.dataset.delm,1);render()}return}\nif(t.dataset.qr!=null){const i=+t.dataset.qr;pickFile(async f=>{try{t.disabled=true;t.textContent='Mengunggah...';v.methods[i].qris=await upFile(f,900);render()}catch(x){toast(x.message);render()}});return}\nif(t.id==='savevip')return saveVip()});\n$('#app').addEventListener('input',e=>{const el=e.target,f=el.dataset.f;if(!f)return;const pc=el.closest('[data-pi],[data-mi]');if(!pc)return;\nconst o=pc.dataset.pi!=null?S.vip.plans[+pc.dataset.pi]:S.vip.methods[+pc.dataset.mi];if(!o)return;\no[f]=el.type==='checkbox'?el.checked:(el.type==='number'?(+el.value||0):el.value);\nif(f==='price'){const h=pc.querySelector('[data-pv]');if(h)h.textContent=rp(o.price)}});\n$('#app').addEventListener('change',e=>{if(e.target.dataset.f==='kind')render()});\ndocument.addEventListener('input',e=>{const el=e.target;if(!D)return;\nif(el.id==='et'){ET.t=el.value;edDraw();return}if(el.id==='eb'){ET.b=el.value;edDraw();return}\nconst k=el.dataset.k;if(!k||!el.closest('#sheet'))return;\nD[k]=el.type==='checkbox'?el.checked:(el.type==='range'?+el.value:el.value);\nconst o=$('#o_'+k);if(o)o.textContent=D[k];edDraw()});\ndocument.addEventListener('click',async e=>{const t=e.target.closest('button');if(!t||!D)return;\nif(t.id==='edx'){closeEd();return}if(t.id==='eds')return saveEd();if(t.id==='edel')return delEd();\nif(t.id==='edimg')return pickFile(async f=>{try{t.disabled=true;t.textContent='Mengunggah...';D.id=await upFile(f,1200);await loadEdImg('/mi/'+D.id);sheet();toast('Gambar diganti. Ketuk Simpan untuk menerapkan.')}catch(x){toast(x.message);t.disabled=false;t.textContent='Ganti gambar'}})});\n(async()=>{try{const d=await api('GET','/admin/api/state');S.db=d.db;S.fonts=d.fonts;S.memes=d.memes;S.vip=d.vip;render()}catch(e){$('#app').innerHTML='<div class=\"note bad\">'+esc(e.message)+'</div>'}})();\n</script>\n</body>\n</html>\n";
const LOGIN_HTML = "<!DOCTYPE html>\n<html lang=\"id\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover\">\n<meta name=\"robots\" content=\"noindex,nofollow\">\n<title>Masuk admin - AlzTools</title>\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\"><link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n<link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&display=swap\">\n<style>\n:root{color-scheme:light dark;--bg:#eef0f2;--sf:#fff;--line:#d5dade;--tx:#16181b;--mut:#596069;--ac:#ffc800;--onac:#16181b;--err:#b3261e;box-sizing:border-box;padding-top:env(safe-area-inset-top,0);padding-bottom:env(safe-area-inset-bottom,0)}\n@media(prefers-color-scheme:dark){:root{--bg:#121417;--sf:#1b1e22;--line:#2f353c;--tx:#eef0f2;--mut:#9aa3ac;--err:#ff8a80}}\n*,*::before,*::after{box-sizing:border-box;margin:0}\nhtml,body{height:100%}\nbody{background:var(--bg);color:var(--tx);font:16px/1.5 \"Archivo\",system-ui,-apple-system,\"Segoe UI\",Roboto,sans-serif;display:grid;place-items:center;padding:20px}\nmain{width:100%;max-width:380px}\n.brand{display:flex;align-items:center;gap:10px;margin-bottom:28px}\n.mark{width:34px;height:34px;border-radius:9px;background:var(--ac);display:grid;place-items:center}\n.mark svg{width:22px;height:22px}\n.wm{font-weight:800;font-stretch:118%;font-size:21px;letter-spacing:-.01em}\nh1{font-size:26px;font-weight:800;font-stretch:112%;line-height:1.1;margin-bottom:6px;letter-spacing:-.01em}\n.sub{color:var(--mut);margin-bottom:22px}\nform{background:var(--sf);border:1px solid var(--line);border-radius:14px;padding:20px}\nlabel{display:block;font-size:13px;font-weight:600;margin-bottom:6px}\ninput{width:100%;height:48px;border:1px solid var(--line);border-radius:10px;background:var(--bg);color:inherit;font:inherit;padding:0 13px;margin-bottom:14px}\ninput:focus{outline:0;border-color:var(--tx);box-shadow:0 0 0 1px var(--tx)}\nbutton{width:100%;height:48px;border:0;border-radius:10px;background:var(--ac);color:var(--onac);font:inherit;font-weight:700;cursor:pointer;margin-top:4px}\nbutton:active{transform:translateY(1px)}\n.err{color:var(--err);font-size:14px;margin-bottom:14px}\n.back{display:block;text-align:center;margin-top:18px;color:var(--mut);font-size:14px;text-decoration:none}\n</style>\n</head>\n<body>\n<main>\n<div class=\"brand\"><span class=\"mark\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#16181b\" stroke-width=\"3.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4.5 20 12 4l7.5 16M8.3 14.5h7.4\"/></svg></span><span class=\"wm\">AlzTools</span></div>\n<h1>Masuk admin</h1>\n<p class=\"sub\">Khusus pengelola situs.</p>\n<form method=\"post\" action=\"/loginadmn\" autocomplete=\"on\">\n<!--MSG-->\n<label for=\"u\">Nama pengguna</label>\n<input id=\"u\" name=\"u\" autocomplete=\"username\" autocapitalize=\"none\" autocorrect=\"off\" spellcheck=\"false\" required>\n<label for=\"p\">Kata sandi</label>\n<input id=\"p\" name=\"p\" type=\"password\" autocomplete=\"current-password\" required>\n<button type=\"submit\">Masuk</button>\n</form>\n<a class=\"back\" href=\"/\">Kembali ke situs</a>\n</main>\n</body>\n</html>\n";
const MEME_FONTS = ['Anton', 'Archivo Black', 'Oswald', 'Comic Neue', 'Impact', 'Arial Black'];
const hesc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// --- Penyimpanan ---
const SB_URL = () => String(process.env.SUPABASE_URL || '').trim().replace(/\/+$/, '');
const SB_KEY = () => String(process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY || '').trim();
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
const isHttps = req => req.secure || String(req.headers['x-forwarded-proto'] || '').split(',')[0] === 'https';
const ckSet = (req, v, age) => 'alz_adm=' + v + '; Path=/; HttpOnly; SameSite=Strict; Max-Age=' + age + (isHttps(req) ? '; Secure' : '');
const secHdr = res => { res.setHeader('Cache-Control', 'no-store'); res.setHeader('X-Robots-Tag', 'noindex, nofollow'); res.setHeader('X-Frame-Options', 'DENY'); res.setHeader('Referrer-Policy', 'no-referrer'); };
const loginPage = msg => LOGIN_HTML.replace('<!--MSG-->', msg ? '<p class="err" role="alert">' + hesc(msg) + '</p>' : '');
const LOGIN_TRY = new Map(); // percobaan gagal per IP (berlaku per instance server)
const ipOf = req => String(req.headers['x-forwarded-for'] || (req.socket && req.socket.remoteAddress) || '').split(',')[0].trim() || 'x';

app.get('/loginadmn', (req, res) => {
  secHdr(res);
  if (authed(req)) return res.redirect('/admin');
  res.type('html').send(loginPage(admOn() ? '' : 'Admin belum diatur. Isi ADMIN_USER dan ADMIN_PASS di Vercel lalu Redeploy.'));
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
app.get('/admin', (req, res) => {
  secHdr(res);
  if (!authed(req)) return res.redirect('/loginadmn');
  res.type('html').send(ADMIN_HTML);
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
    res.json({ ok: true, db: hasDb() ? 'supabase' : 'memory', fonts: MEME_FONTS, memes: cleanMemes(await kvGet('memes', [])), vip: cleanVip(await kvGet('vip', VIP_DEF)) });
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

app.get('/', (req, res) => { res.setHeader('Cache-Control', 'no-store'); res.type('html').send(HTML); });
app.use((req, res) => res.redirect('/'));
module.exports = app;
