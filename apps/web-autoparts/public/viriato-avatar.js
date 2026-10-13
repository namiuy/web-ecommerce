/*!
 * Viriato — avatar de bienvenida y asistente de Nami (nami.com.uy)
 *
 * Uso (cualquier página):
 *   <script src="/viriato-avatar.js" defer></script>
 *   <viriato-avatar
 *     img-src="/viriato.png"
 *     ws-url="wss://ia.nami.com.uy"
 *     api-url="https://ia.nami.com.uy"
 *     products-api="https://api-autoparts-v2.nami.com.uy"
 *     product-base="/productos/"
 *     whatsapp="59891033282"></viriato-avatar>
 *
 * Atributos opcionales:
 *   welcome="off"   → no abre la bienvenida en la primera visita
 *   music-src="/algo.mp3" → música en las páginas de music-pages (music-bpm, music-volume)
 *   voice="off"     → arranca sin voz
 *   ?viriato=1 en la URL fuerza la bienvenida (útil para probar)
 *
 * Habla con el backend nami-ia por WebSocket (mismo protocolo que el chat actual) con mode="avatar".
 * Si el backend devuelve `products` los muestra como tarjetas; si no, busca los códigos
 * que nombró la IA (o su búsqueda) directamente en la API de autopartes.
 * La voz sale de POST {api-url}/api/tts (es-UY-MateoNeural); si no está, usa la del navegador.
 *
 * Basado en carpincho-avatar.js (Robotec).
 */
(() => {
  'use strict';
  if (window.customElements && customElements.get('viriato-avatar')) return;

  // ---------- almacenamiento tolerante a fallos ----------
  const safe = (fn, fallback = null) => { try { return fn(); } catch { return fallback; } };
  const ss = {
    get: (k) => safe(() => JSON.parse(window.sessionStorage.getItem(k))),
    set: (k, v) => safe(() => window.sessionStorage.setItem(k, JSON.stringify(v))),
    del: (k) => safe(() => window.sessionStorage.removeItem(k)),
  };
  const ls = {
    get: (k) => safe(() => window.localStorage.getItem(k)),
    set: (k, v) => safe(() => window.localStorage.setItem(k, v)),
  };

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ---------- Viriato (la imagen, partida en cuerpo y cabeza para animarla) ----------
  // Coordenadas sobre viriato.png (300 x 388). La cabeza gira sobre el cuello (190,134).
  const SKIN = '#f9ebe5';
  const VIRIATO_SVG = (id, img, viewBox = '0 -8 300 400') => `
<svg class="capy" viewBox="${viewBox}" aria-hidden="true" focusable="false">
  <defs>
    <clipPath id="${id}cb"><rect x="0" y="130" width="300" height="270"/></clipPath>
    <clipPath id="${id}ch"><rect x="0" y="-10" width="300" height="146"/></clipPath>
  </defs>
  <ellipse class="shadow" cx="160" cy="382" rx="128" ry="9" fill="#000" opacity=".26"/>
  <g class="bounce"><g class="sway">
    <g class="body"><image href="${img}" x="0" y="0" width="300" height="388" clip-path="url(#${id}cb)"/></g>
    <g class="head">
      <image href="${img}" x="0" y="0" width="300" height="388" clip-path="url(#${id}ch)"/>
      <g class="lids">
        <circle cx="171" cy="92" r="4.6" fill="${SKIN}"/><circle cx="195" cy="82" r="4.6" fill="${SKIN}"/>
        <path d="M166.5 92.5 q4.5 2 9 0 M190.5 82.5 q4.5 2 9 0" stroke="#1d1d1b" stroke-width="2" fill="none" stroke-linecap="round"/>
      </g>
      <g class="eyesHappy">
        <circle cx="171" cy="92" r="4.8" fill="${SKIN}"/><circle cx="195" cy="82" r="4.8" fill="${SKIN}"/>
        <path d="M166.5 94 q4.5 -6 9 0 M190.5 84 q4.5 -6 9 0" stroke="#1d1d1b" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      </g>
      <g class="mouthSmile"></g>
      <ellipse class="mouthPatch" cx="193" cy="108" rx="20" ry="12.5" fill="${SKIN}"/>
      <g class="mouthOpen" transform="rotate(-14 192 108)">
        <ellipse cx="192" cy="108" rx="11" ry="8" fill="#3a1a12" stroke="#1d1d1b" stroke-width="1.6"/>
        <ellipse cx="192" cy="113" rx="6.5" ry="3" fill="#e8707f"/>
        <rect x="185.5" y="100.5" width="13" height="4" rx="1.5" fill="#fffaf2"/>
      </g>
    </g>
  </g></g>
</svg>`;

  const ICONS = {
    part: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 4h16v3H4zm0 13h16v3H4zM5 8h2v8H5zm3 0h1.5v8H8zm2.5 0H12v8h-1.5zm2.5 0h1.5v8H13zm2.5 0H17v8h-1.5zM18 8h1v8h-1z"/></svg>',
    mic: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2Z"/></svg>',
    send: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3.4 20.4 21 12 3.4 3.6 3.4 10l12.6 2-12.6 2z"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.3 5.71 12 12.01l-6.3-6.3-1.41 1.41 6.3 6.3-6.3 6.3 1.41 1.41 6.3-6.3 6.3 6.3 1.41-1.41-6.3-6.3 6.3-6.3z"/></svg>',
    sound: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3a4.5 4.5 0 0 0-2.5-4.03v8.05A4.5 4.5 0 0 0 16.5 12ZM14 3.23v2.06a7 7 0 0 1 0 13.42v2.06a9 9 0 0 0 0-17.54Z"/></svg>',
    muted: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63ZM19 12c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.8 8.8 0 0 0 21 12a9 9 0 0 0-7-8.77v2.06A7 7 0 0 1 19 12ZM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a9 9 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3ZM12 4 9.91 6.09 12 8.18V4Z"/></svg>',
    wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35ZM12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.43 9.43 0 1 1 7.99 4.42Zm8.03-17.46A11.25 11.25 0 0 0 2.46 17.6L.86 23.4l5.94-1.56a11.24 11.24 0 0 0 5.24 1.33h.01A11.27 11.27 0 0 0 20.08 4.04Z"/></svg>',
  };

  const CHIPS = [
    { label: 'Radiador para mi auto', text: 'Necesito un radiador para mi auto' },
    { label: 'El aire no enfría', text: 'El aire acondicionado de mi auto no enfría, ¿qué puede ser?' },
    { label: 'Condensador de A/C', text: 'Busco un condensador de aire acondicionado' },
    { label: 'Electroventilador', text: 'Busco un electroventilador' },
    { label: 'Se me recalienta', text: 'Se me recalienta el motor, ¿qué reviso?' },
    { label: 'Sucursales y horarios', text: '¿Dónde están las sucursales y en qué horario atienden?' },
  ];

  const GREETING = '¡Hola! Soy Viriato, el mecánico de Nami. Decime qué repuesto buscás y para qué auto, y te lo encuentro.';
  const NAME = 'Viriato';
  const ROLE = 'El mecánico de Nami';

  const CSS = `
:host{all:initial;--rt-blue:#2b63a8;--rt-ink:#05003f;--orange:#e63a2e;--lagoon:#05003f;--lagoon2:#1d1a78;--paper:#ffffff;--soft:#f2f4f5;--text:#1b1d1f;--muted:#5f6b70;--line:#e3e7e9;
  font-family:Roboto,system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--text);font-size:15px;line-height:1.45}
*{box-sizing:border-box}
[hidden]{display:none!important}
button{font:inherit;cursor:pointer}
button:focus-visible,a:focus-visible,input:focus-visible{outline:3px solid var(--rt-blue);outline-offset:2px}

/* --- botón flotante --- */
.launcher{position:fixed;left:16px;bottom:16px;z-index:2147483000;display:flex;align-items:flex-end;gap:10px;background:none;border:0;padding:0}
.launcher .mini{border:0;width:72px;height:72px;border-radius:50%;background:radial-gradient(circle at 50% 35%,#ffffff,#dfe6f3);box-shadow:0 6px 20px rgba(0,0,0,.28),0 0 0 3px #fff;overflow:hidden;display:grid;place-items:center;transition:transform .2s}
.launcher:hover .mini{transform:translateY(-3px) rotate(-4deg)}
.launcher .mini svg{width:100%;height:100%;margin-top:8%}
.tip{background:#fff;color:var(--text);border-radius:14px 14px 14px 4px;padding:10px 14px;box-shadow:0 6px 20px rgba(0,0,0,.18);font-size:14px;max-width:230px;text-align:left;margin-bottom:64px;order:2;animation:pop .35s ease-out both}
@keyframes pop{from{opacity:0;transform:translateY(6px) scale(.96)}to{opacity:1;transform:none}}

/* --- botón de la canción --- */
.music{position:fixed;left:98px;bottom:30px;z-index:2147483003;display:flex;align-items:center;gap:8px;border:0;border-radius:999px;padding:9px 14px 9px 12px;background:#fff;color:var(--text);font-size:13px;font-weight:600;box-shadow:0 4px 16px rgba(0,0,0,.2);animation:pop .3s ease-out both}
.music:hover{background:#eef3fb}
.eq{display:flex;align-items:flex-end;gap:2px;width:16px;height:14px}
.eq i{flex:1;height:30%;background:var(--orange);border-radius:1px}
.music.on .eq i{animation:eq calc(var(--beat,.6s)) ease-in-out infinite alternate}
.music.on .eq i:nth-child(2){animation-delay:calc(var(--beat,.6s) * -.33)}
.music.on .eq i:nth-child(3){animation-delay:calc(var(--beat,.6s) * -.66)}
@keyframes eq{from{height:20%}to{height:100%}}
.panel:not([hidden]).dock ~ .music{display:none}
@media (max-width:560px){.panel:not([hidden]) ~ .music{display:none}}

/* --- panel --- */
.backdrop{position:fixed;inset:0;z-index:2147483001;background:rgba(5,0,40,.55);backdrop-filter:blur(3px);animation:fade .25s both}
@keyframes fade{from{opacity:0}}
.panel{position:fixed;z-index:2147483002;background:var(--paper);display:flex;flex-direction:column;overflow:hidden;box-shadow:0 18px 50px rgba(0,0,0,.35);animation:pop .3s ease-out both}
.panel.dock{left:16px;bottom:16px;width:min(400px,calc(100vw - 32px));height:min(640px,calc(100vh - 32px));border-radius:22px}
.panel.welcome{left:50%;top:50%;transform:translate(-50%,-50%);width:min(620px,calc(100vw - 32px));max-height:calc(100vh - 32px);border-radius:26px;animation:none}
@media (max-width:560px){
  .panel.dock,.panel.welcome{left:0;top:0;bottom:0;right:0;transform:none;width:100%;height:100%;max-height:none;border-radius:0}
}

header{position:relative;background:radial-gradient(120% 90% at 50% 0%,var(--lagoon2),var(--lagoon) 70%);color:#f2f3ff;display:flex;align-items:center;gap:12px;padding:12px 14px}
.welcome header{flex-direction:column;padding:14px 16px 10px}
.stage{position:relative;flex:none;width:90px;height:120px}
.welcome .stage{width:172px;height:230px}
.welcome.chatting .stage{width:108px;height:144px}
.stage .capy{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.ring{position:absolute;left:50%;bottom:4%;width:86%;height:26%;transform:translateX(-50%);border-radius:50%;background:radial-gradient(closest-side,rgba(120,160,255,.6),transparent);opacity:0;transition:opacity .3s}
.listening .ring{opacity:1;animation:pulse 1.1s ease-in-out infinite}
@keyframes pulse{50%{transform:translateX(-50%) scale(1.25);opacity:.5}}
.dots{position:absolute;right:-6px;top:6px;display:none;gap:4px;background:#fff;border-radius:12px;padding:6px 8px}
.thinking .dots{display:flex}
.dots i{width:6px;height:6px;border-radius:50%;background:var(--lagoon2);animation:dot 1s infinite}
.dots i:nth-child(2){animation-delay:.15s}.dots i:nth-child(3){animation-delay:.3s}
@keyframes dot{50%{transform:translateY(-4px);opacity:.5}}
.hgroup{flex:1;min-width:0}
.welcome .hgroup{text-align:center}
.hgroup strong{display:block;font-size:17px;letter-spacing:.01em}
.welcome .hgroup strong{font-size:21px}
.hgroup span{font-size:13px;color:#b9bde8}
.tools{display:flex;gap:4px;align-self:flex-start}
.welcome .tools{position:absolute;right:10px;top:10px}
.icon{width:38px;height:38px;border-radius:12px;border:0;background:rgba(255,255,255,.08);color:#f2f3ff;display:grid;place-items:center}
.icon:hover{background:rgba(255,255,255,.16)}
.icon svg{width:20px;height:20px}

/* animaciones de Viriato (coordenadas del viewBox) */
.capy *{transform-box:view-box}
.capy image{image-rendering:auto}
.stage::before{content:"";position:absolute;left:4%;right:4%;top:6%;bottom:4%;border-radius:50%;background:radial-gradient(closest-side,rgba(255,255,255,.2),rgba(255,255,255,.06) 70%,transparent)}
.stage .capy{filter:drop-shadow(0 0 1.2px rgba(255,255,255,.55))}
.bounce,.sway{transform-origin:160px 382px}
.head{transform-origin:190px 134px;transition:transform .35s}
.body{transform-origin:160px 382px}
.shadow{transform-origin:160px 382px}
.mouthOpen{opacity:0}
.mouthPatch{opacity:0}
.lids{opacity:0}
.eyesHappy{opacity:0}
.happy .eyesHappy{opacity:1}

.stage .body{animation:breathe 3.2s ease-in-out infinite}
.stage .lids{animation:blink 4.6s infinite}
.stage .head{animation:idleHead 6s ease-in-out infinite}
@keyframes breathe{50%{transform:scale(1.008,1.014)}}
@keyframes blink{0%,95%,100%{opacity:0}96.5%,98%{opacity:1}}
@keyframes idleHead{0%,100%{transform:rotate(0)}50%{transform:rotate(-1.6deg)}}

.listening .head{animation:none;transform:rotate(-6deg)}
.thinking .head{animation:think 1.8s ease-in-out infinite}
@keyframes think{0%,100%{transform:rotate(3deg)}50%{transform:rotate(6deg) translateY(-1px)}}
.talking .head{animation:nod .9s ease-in-out infinite}
@keyframes nod{50%{transform:rotate(-2.5deg) translateY(1.5px)}}
.waving .bounce{animation:hop .45s ease-out 2}
.waving .head{animation:hello .9s ease-in-out 1}
@keyframes hello{30%{transform:rotate(-7deg)}70%{transform:rotate(4deg)}}
.happy .bounce{animation:hop .5s ease-out 2}
@keyframes hop{50%{transform:translateY(-14px) scale(.985,1.02)}}

/* baile al ritmo de la música (--beat = 60 / bpm) */
.dance .capy .bounce{animation:dBounce var(--beat) ease-in-out infinite}
.dance .capy .sway{animation:dSway calc(var(--beat)*2) ease-in-out infinite}
.dance .capy .head{animation:dHead calc(var(--beat)*2) ease-in-out infinite}
.dance .capy .shadow{animation:dShadow var(--beat) ease-in-out infinite}
.dance .capy .eyesHappy{opacity:1}
@keyframes dBounce{0%,100%{transform:translateY(0) scale(1.03,.97)}50%{transform:translateY(-14px) scale(.98,1.02)}}
@keyframes dSway{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
@keyframes dHead{0%,100%{transform:rotate(7deg)}50%{transform:rotate(-7deg)}}
@keyframes dShadow{0%,100%{transform:scale(1)}50%{transform:scale(.82);opacity:.6}}

/* --- conversación --- */
.say{margin:0 14px;padding:12px 16px;background:var(--soft);border-radius:4px 16px 16px 16px;font-size:16px}
.welcome .say{margin:14px 22px 0;border-radius:16px;text-align:center;font-size:17px}
.log{flex:1;min-height:0;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;overscroll-behavior:contain}
.welcome .log{min-height:120px}
.log>*{flex-shrink:0}
.msg{max-width:88%;padding:10px 14px;border-radius:16px;word-wrap:break-word}
.msg p{margin:0 0 6px}.msg p:last-child{margin:0}
.msg ul{margin:4px 0;padding-left:18px}
.msg a{color:#2b63a8}
.tbl{overflow-x:auto;margin:6px 0}
.tbl table{border-collapse:collapse;font-size:13px;min-width:100%}
.tbl th,.tbl td{border-bottom:1px solid var(--line);padding:6px 8px;text-align:left;vertical-align:top}
.tbl th{font-weight:600;background:rgba(0,0,0,.03)}
.tbl td{min-width:70px;max-width:220px}
.msg.user{align-self:flex-end;background:var(--rt-blue);color:#fff;border-bottom-right-radius:4px}
.msg.user a{color:#fff}
.msg.bot{align-self:flex-start;background:var(--soft);border-bottom-left-radius:4px}
.msg.err{align-self:center;background:#fff3e0;color:#7a4100;font-size:14px}
.cards{display:flex;gap:10px;overflow-x:auto;padding:2px 2px 8px;scroll-snap-type:x mandatory;align-self:stretch}
.card{flex:none;width:150px;scroll-snap-align:start;border:1px solid var(--line);border-radius:14px;overflow:hidden;background:#fff;text-decoration:none;color:var(--text);display:flex;flex-direction:column}
.card:hover{border-color:var(--rt-blue);box-shadow:0 4px 14px rgba(43,99,168,.22)}
.card img{width:100%;aspect-ratio:1;object-fit:contain;background:#fff;padding:8px}
.card .noimg{width:100%;aspect-ratio:1;display:grid;place-items:center;background:#f4f6fa;color:#9aa6bd}
.card .noimg svg{width:46%;height:46%}
.card .cs{font-size:11px;font-weight:600;color:#1f7a3f}.card .cs.no{color:var(--muted);font-weight:500}
.card .ci{padding:8px 10px 10px;display:flex;flex-direction:column;gap:4px;border-top:1px solid var(--line);flex:1}
.card .cn{font-size:13px;line-height:1.3;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.card .cp{font-weight:700;font-size:15px;margin-top:auto}
.card .cc{font-size:11px;color:var(--muted)}

.chips{display:flex;flex-wrap:wrap;gap:8px;padding:12px 14px 4px}
.welcome .chips{justify-content:center;padding:14px 22px 4px}
.chip{border:1px solid var(--line);background:#fff;color:var(--text);border-radius:999px;padding:9px 14px;font-size:14px}
.chip:hover{border-color:var(--rt-blue);color:#2b63a8;background:#eef3fb}

.composer{display:flex;gap:8px;padding:10px 12px;border-top:1px solid var(--line);align-items:center}
.composer input{flex:1;min-width:0;border:1px solid var(--line);border-radius:999px;padding:12px 16px;font:inherit;font-size:16px;color:var(--text);background:#fff}
.round{width:46px;height:46px;flex:none;border-radius:50%;border:0;display:grid;place-items:center;background:var(--soft);color:var(--text)}
.round svg{width:22px;height:22px}
.round.send{background:var(--rt-blue);color:#fff}
.round.send:disabled{opacity:.45;cursor:default}
.round.mic.on{background:#e53935;color:#fff;animation:pulse2 1.2s infinite}
@keyframes pulse2{50%{box-shadow:0 0 0 8px rgba(229,57,53,.18)}}
.foot{display:flex;gap:8px;align-items:center;justify-content:space-between;padding:0 12px 12px;flex-wrap:wrap}
.wa{display:inline-flex;align-items:center;gap:6px;color:#128c4a;text-decoration:none;font-size:14px;padding:8px 4px}
.wa svg{width:18px;height:18px}
.enter{border:0;background:var(--rt-ink);color:#fff;border-radius:999px;padding:11px 18px;font-weight:600;font-size:14px}
.enter:hover{background:#000}
.dock .enter{display:none}

@media (prefers-reduced-motion:reduce){
  .stage *,.dance .capy *,.music .eq i{animation:none!important}
  .launcher .mini,.head{transition:none}
}`;

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

  class ViriatoAvatar extends HTMLElement {
    connectedCallback() {
      if (this._ready) return;
      this._ready = true;

      const a = (n, d) => (this.getAttribute(n) || d || '').trim();
      this.cfg = {
        ws: a('ws-url').replace(/\/+$/, ''),
        api: a('api-url').replace(/\/+$/, ''),
        productsApi: a('products-api', 'https://api-autoparts-v2.nami.com.uy').replace(/\/+$/, ''),
        img: a('img-src', '/viriato.png'),
        productBase: a('product-base', '/productos/'),
        whatsapp: a('whatsapp', '59891033282').replace(/\D/g, ''),
        welcome: a('welcome', 'on') !== 'off',
        musicSrc: a('music-src'),
        musicPages: a('music-pages', '/').split(',').map((x) => x.trim().replace(/\/+$/, '') || '/'),
        bpm: parseFloat(a('music-bpm', '97.5')) || 97.5,
        musicVolume: Math.min(1, Math.max(0, parseFloat(a('music-volume', '0.35')) || 0.35)),
      };
      this.sid = ss.get('viriato_sid') || `web_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      ss.set('viriato_sid', this.sid);
      this.msgs = ss.get('viriato_msgs') || [];
      this.muted = ls.get('viriato_muted') === '1' || a('voice') === 'off';
      this.ttsServer = this.cfg.api ? null : false; // null = no probado
      this.queue = [];
      this.retries = 0;
      this.used = !!ss.get('viriato_used') || this.msgs.some((m) => m.role === 'user');
      this.musicOff = ls.get('viriato_music_off') === '1';

      this.render();
      this.renderLog();

      const force = /[?&]viriato=1\b/.test(location.search);
      const seen = ls.get('viriato_welcome_seen') === '1';
      const wasOpen = ss.get('viriato_open');
      if (wasOpen) this.open(wasOpen === 'welcome' ? 'welcome' : 'dock', false);
      else if (this.cfg.welcome && (force || !seen)) setTimeout(() => this.open('welcome', false), 700);
      else this.tipTimer = setTimeout(() => this.showTip(), 4000);
      setTimeout(() => this.armMusic(), 600);
    }

    disconnectedCallback() {
      clearTimeout(this.tipTimer);
      clearInterval(this.pathTimer);
      this.stopSpeaking();
      this.stopMusic(true);
      if (this.ws) { this.ws.onclose = null; this.ws.close(); }
    }

    // ---------- UI ----------
    render() {
      const root = this.attachShadow({ mode: 'open' });
      const img = esc(this.cfg.img);
      root.innerHTML = `<style>${CSS}</style>
<button class="launcher" type="button" aria-label="Abrir a Viriato, el asistente de Nami">
  <span class="tip" hidden></span>
  <span class="mini">${VIRIATO_SVG('l', img, '78 -6 180 180')}</span>
</button>
<div class="backdrop" hidden></div>
<section class="panel dock" role="dialog" aria-modal="false" aria-label="Viriato, asistente de Nami" hidden>
  <header>
    <div class="stage">${VIRIATO_SVG('p', img)}<div class="ring"></div><div class="dots"><i></i><i></i><i></i></div></div>
    <div class="hgroup"><strong>${NAME}</strong><span class="status">${ROLE}</span></div>
    <div class="tools">
      <button class="icon mute" type="button"></button>
      <button class="icon close" type="button" aria-label="Cerrar">${ICONS.close}</button>
    </div>
  </header>
  <p class="say" aria-live="polite"></p>
  <div class="log" role="log" aria-live="polite"></div>
  <div class="chips"></div>
  <form class="composer">
    <button class="round mic" type="button" aria-label="Hablar">${ICONS.mic}</button>
    <input type="text" enterkeyhint="send" autocomplete="off" maxlength="500" placeholder="Escribí o tocá el micrófono…" aria-label="Tu consulta">
    <button class="round send" type="submit" aria-label="Enviar" disabled>${ICONS.send}</button>
  </form>
  <div class="foot">
    <a class="wa" target="_blank" rel="noopener">${ICONS.wa} Hablar con una persona</a>
    <button class="enter" type="button">Ir a la tienda →</button>
  </div>
</section>
<button class="music" type="button" hidden><span class="eq" aria-hidden="true"><i></i><i></i><i></i></span><span class="ml"></span></button>`;
      const $ = (s) => root.querySelector(s);
      this.el = {
        launcher: $('.launcher'), tip: $('.tip'), backdrop: $('.backdrop'), panel: $('.panel'),
        stage: $('.stage'), status: $('.status'), mute: $('.mute'), close: $('.close'), say: $('.say'),
        log: $('.log'), chips: $('.chips'), form: $('.composer'), input: $('.composer input'),
        mic: $('.mic'), send: $('.send'), wa: $('.wa'), enter: $('.enter'),
        mouth: $('.stage .mouthOpen'), smile: $('.stage .mouthPatch'),
        music: $('.music'), musicLabel: $('.music .ml'),
      };
      [this.el.launcher, this.el.panel, this.el.music].forEach((n) => n.style.setProperty('--beat', `${(60 / this.cfg.bpm).toFixed(3)}s`));
      this.el.chips.innerHTML = CHIPS.map((c, i) => `<button class="chip" type="button" data-i="${i}">${esc(c.label)}</button>`).join('');
      this.updateMute();
      this.updateWa();

      this.el.launcher.addEventListener('click', () => { this.markUsed(); this.unlockAudio(); this.open('dock', true); });
      this.el.music.addEventListener('click', () => this.toggleMusic());
      this.el.close.addEventListener('click', () => this.close());
      this.el.enter.addEventListener('click', () => this.close());
      this.el.backdrop.addEventListener('click', () => this.close());
      this.el.mute.addEventListener('click', () => {
        this.muted = !this.muted;
        ls.set('viriato_muted', this.muted ? '1' : '0');
        if (this.muted) { this.stopSpeaking(); this.stopMusic(); } else this.armMusic();
        this.updateMute();
      });
      this.el.chips.addEventListener('click', (e) => { const b = e.target.closest('.chip'); if (b) { this.unlockAudio(); this.send(CHIPS[+b.dataset.i].text); } });
      this.el.input.addEventListener('input', () => { this.el.send.disabled = !this.el.input.value.trim(); });
      this.el.form.addEventListener('submit', (e) => { e.preventDefault(); this.unlockAudio(); this.send(this.el.input.value); });
      this.el.mic.addEventListener('click', () => { this.unlockAudio(); this.toggleMic(); });
      // si una foto de producto no existe, mostramos un ícono en su lugar
      this.el.log.addEventListener('error', (e) => {
        const im = e.target;
        if (im && im.tagName === 'IMG' && im.parentNode) {
          const ph = document.createElement('span');
          ph.className = 'noimg';
          ph.innerHTML = ICONS.part;
          im.replaceWith(ph);
        }
      }, true);
      this.el.panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.close(); });
      // si la pestaña queda en segundo plano, Viriato deja de hablar
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.stopSpeaking();
          if (this.music && !this.music.paused) { this.music.pause(); this.pausedByHide = true; }
        } else if (this.pausedByHide) {
          this.pausedByHide = false;
          if (this.musicAllowed()) this.armMusic();
        }
      });
      // Next.js navega sin recargar: vigilamos la ruta para frenar la canción fuera de la principal
      this.lastPath = location.pathname;
      this.pathTimer = setInterval(() => {
        if (location.pathname === this.lastPath) return;
        this.lastPath = location.pathname;
        if (this.musicAllowed()) this.armMusic(); else this.stopMusic();
      }, 1000);
    }

    showTip() {
      if (!this.el.panel.hidden || ss.get('viriato_tip')) return;
      ss.set('viriato_tip', 1);
      this.el.tip.textContent = '¡Hola! Soy Viriato. ¿Qué repuesto buscás?';
      this.el.tip.hidden = false;
      setTimeout(() => { this.el.tip.hidden = true; }, 8000);
    }

    open(mode, withGesture) {
      clearTimeout(this.tipTimer);
      this.el.tip.hidden = true;
      this.mode = mode;
      ss.set('viriato_open', mode);
      const p = this.el.panel;
      p.classList.toggle('welcome', mode === 'welcome');
      p.classList.toggle('dock', mode !== 'welcome');
      p.setAttribute('aria-modal', mode === 'welcome' ? 'true' : 'false');
      this.el.backdrop.hidden = mode !== 'welcome';
      this.el.launcher.hidden = true;
      p.hidden = false;
      this.syncChatting();
      this.connect();
      if (!this.msgs.length) {
        this.el.say.textContent = GREETING;
        this.el.say.hidden = false;
        this.setState('waving');
        setTimeout(() => this.state === 'waving' && this.setState('idle'), 2000);
        if (withGesture) this.speak(GREETING);
      } else {
        this.el.say.hidden = true;
      }
      setTimeout(() => this.el.input.focus({ preventScroll: true }), 50);
    }

    close() {
      this.stopSpeaking();
      this.stopMic();
      ls.set('viriato_welcome_seen', '1');
      ss.del('viriato_open');
      this.el.panel.hidden = true;
      this.el.backdrop.hidden = true;
      this.el.launcher.hidden = false;
      // después de la bienvenida queda en modo "dock" para la próxima vez
      this.mode = 'dock';
    }

    syncChatting() {
      const chatting = this.msgs.length > 0;
      this.el.panel.classList.toggle('chatting', chatting);
      this.el.log.hidden = !chatting && this.mode === 'welcome';
      this.el.chips.hidden = this.msgs.some((m) => m.role === 'user');
      if (chatting) this.el.say.hidden = true;
    }

    updateMute() {
      this.el.mute.innerHTML = this.muted ? ICONS.muted : ICONS.sound;
      this.el.mute.setAttribute('aria-label', this.muted ? 'Activar la voz' : 'Silenciar la voz');
      this.el.mute.setAttribute('aria-pressed', String(this.muted));
    }

    updateWa() {
      const lastQ = [...this.msgs].reverse().find((m) => m.role === 'user');
      const text = `Hola Nami, vengo de Viriato en la web.${lastQ ? ` Mi consulta: ${lastQ.text}` : ''}`;
      this.el.wa.href = `https://wa.me/${this.cfg.whatsapp}?text=${encodeURIComponent(text)}`;
    }

    setState(s) {
      this.state = s;
      const st = this.el.stage;
      st.classList.remove('idle', 'listening', 'thinking', 'talking', 'happy', 'waving');
      st.classList.add(s);
      const labels = { listening: 'Te escucho…', thinking: 'Buscando…', talking: 'Hablando', idle: ROLE, happy: ROLE, waving: ROLE };
      this.el.status.textContent = this.offline ? 'Sin conexión, reintentando…' : (labels[s] || '');
    }

    // ---------- música (opcional) ----------
    onMusicPage() {
      const path = location.pathname.replace(/\/+$/, '') || '/';
      return this.cfg.musicPages.includes(path);
    }

    musicAllowed() {
      return !!this.cfg.musicSrc && !this.used && !this.musicOff && !this.muted && this.onMusicPage();
    }

    armMusic() {
      this.updateMusicBtn();
      if (!this.musicAllowed()) return;
      if (!this.music) {
        const m = new Audio(this.cfg.musicSrc);
        m.loop = true;
        m.preload = 'auto';
        m.volume = 0;
        m.addEventListener('playing', () => { this.setDancing(true); this.musicTip(); });
        m.addEventListener('pause', () => this.setDancing(false));
        this.music = m;
      }
      if (!this.music.paused) return;
      const p = safe(() => this.music.play());
      if (p && p.then) p.then(() => this.fadeMusic(this.cfg.musicVolume), () => this.waitGesture());
      else this.waitGesture();
    }

    // autoplay bloqueado: la canción arranca con el primer gesto en la página (no en Viriato)
    waitGesture() {
      if (this.offGesture) return;
      const evs = ['pointerdown', 'keydown', 'touchend'];
      const h = (e) => {
        // si toca el chat (atajos, campo de texto, botón de Viriato) está empezando a usarlo: no arrancamos
        const path = e.composedPath ? e.composedPath() : [];
        if (path.some((n) => n === this.el.form || n === this.el.chips || n === this.el.launcher || n === this.el.music)) return;
        off();
        if (this.musicAllowed()) this.armMusic();
      };
      const off = () => { evs.forEach((ev) => document.removeEventListener(ev, h, true)); this.offGesture = null; };
      evs.forEach((ev) => document.addEventListener(ev, h, true));
      this.offGesture = off;
    }

    fadeMusic(to, done) {
      clearInterval(this.fadeTimer);
      const m = this.music;
      if (!m) return done && done();
      const from = m.volume, steps = 24;
      let i = 0;
      this.fadeTimer = setInterval(() => {
        i++;
        safe(() => { m.volume = Math.max(0, Math.min(1, from + (to - from) * (i / steps))); });
        if (i >= steps) { clearInterval(this.fadeTimer); if (done) done(); }
      }, 50);
    }

    stopMusic(now = false) {
      if (this.offGesture) this.offGesture();
      const m = this.music;
      if (m && !m.paused) {
        if (now) { m.pause(); } else this.fadeMusic(0, () => m.pause());
      }
      this.setDancing(false);
      this.updateMusicBtn();
    }

    toggleMusic() {
      const playing = this.music && !this.music.paused;
      this.musicOff = playing;
      ls.set('viriato_music_off', playing ? '1' : '0');
      if (playing) this.stopMusic();
      else { if (this.muted) { this.muted = false; ls.set('viriato_muted', '0'); this.updateMute(); } this.armMusic(); }
    }

    markUsed() {
      if (!this.used) { this.used = true; ss.set('viriato_used', 1); }
      this.stopMusic();
    }

    setDancing(on) {
      this.el.launcher.classList.toggle('dance', on);
      this.el.panel.classList.toggle('dance', on && !['talking', 'listening', 'thinking'].includes(this.state));
      this.updateMusicBtn();
    }

    updateMusicBtn() {
      const b = this.el.music;
      const show = !!this.cfg.musicSrc && !this.used && this.onMusicPage();
      const playing = !!(this.music && !this.music.paused);
      b.hidden = !show;
      b.classList.toggle('on', playing);
      this.el.musicLabel.textContent = playing ? 'Pausar la música' : 'Escuchar la música';
      b.setAttribute('aria-label', playing ? 'Pausar la música' : 'Escuchar la música');
    }

    musicTip() {
      if (!this.el.panel.hidden || ss.get('viriato_music_tip')) return;
      ss.set('viriato_music_tip', 1);
      clearTimeout(this.tipTimer);
      this.el.tip.textContent = '¡Tocame y te ayudo a encontrar el repuesto que buscás!';
      this.el.tip.hidden = false;
      setTimeout(() => { this.el.tip.hidden = true; }, 9000);
    }

    // ---------- mensajes ----------
    save() {
      this.msgs = this.msgs.slice(-30);
      ss.set('viriato_msgs', this.msgs);
      this.updateWa();
    }

    add(m) {
      this.msgs.push(m);
      this.save();
      this.syncChatting();
      const node = this.msgNode(m);
      const first = node.firstElementChild;
      this.el.log.appendChild(node);
      // respuestas largas: mostrar desde el principio, no el final
      if (m.role === 'bot' && first) requestAnimationFrame(() => { this.el.log.scrollTop = first.offsetTop - 8; });
      else this.scroll();
    }

    renderLog() {
      this.el.log.innerHTML = '';
      this.msgs.forEach((m) => this.el.log.appendChild(this.msgNode(m)));
      this.syncChatting();
    }

    msgNode(m) {
      const frag = document.createDocumentFragment();
      const d = document.createElement('div');
      d.className = `msg ${m.role === 'user' ? 'user' : m.role === 'error' ? 'err' : 'bot'}`;
      // si hay tarjetas, las tablas de productos sobran (y en el celular no entran)
      d.innerHTML = m.role === 'user' || m.role === 'error' ? esc(m.text) : this.md(m.text, !!(m.products && m.products.length));
      frag.appendChild(d);
      if (m.products && m.products.length) {
        const c = document.createElement('div');
        c.className = 'cards';
        c.innerHTML = m.products.map((p) => this.cardHtml(p)).join('');
        frag.appendChild(c);
      }
      return frag;
    }

    cardHtml(p) {
      const id = String(p.id || p.code || '').trim();
      const name = String(p.name || '').trim();
      const price = Number(p.price);
      const img = p.image_url || (p.images && p.images[0]) || '';
      const href = p.url || (this.cfg.productBase + encodeURIComponent(id));
      const pesos = Number.isFinite(price) && price > 0 ? `$ ${Math.round(price).toLocaleString('es-UY')}` : '';
      const stock = p.in_stock === true ? '<span class="cs">Disponible</span>' : p.in_stock === false ? '<span class="cs no">Consultar stock</span>' : '';
      return `<a class="card" href="${esc(href)}" target="_top">
        ${img ? `<img src="${esc(img)}" alt="" loading="lazy">` : `<span class="noimg">${ICONS.part}</span>`}
        <span class="ci"><span class="cn">${esc(name)}${p.year ? ` (${esc(p.year)})` : ''}</span>
        ${stock}
        ${pesos ? `<span class="cp">${pesos}</span>` : ''}
        <span class="cc">Cód. ${esc(id.replace(/\s+/g, ' '))}</span></span></a>`;
    }

    // markdown mínimo y seguro (párrafos, listas, tablas, negrita, links)
    md(text, hideTables = false) {
      const src = String(text || '').replace(/<(https?:\/\/[^>\s]+)>/g, '$1');
      const lines = esc(src).split('\n');
      const inline = (s) => s
        .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_top">$1</a>')
        .replace(/(^|[\s(])(https?:\/\/[^\s<)]+?)([.,;:!?]*)(?=$|[\s<)])/g, (m, pre, url, tail) => `${pre}<a href="${url}" target="_top">${url.replace(/^https?:\/\/(www\.)?/, '')}</a>${tail}`)
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      let html = '', list = false, table = null;
      const flushTable = () => {
        if (!table) return;
        if (hideTables) { table = null; return; }
        const [head, ...rows] = table;
        html += '<div class="tbl"><table><thead><tr>' + head.map((c) => `<th>${inline(c)}</th>`).join('') + '</tr></thead><tbody>' +
          rows.map((r) => '<tr>' + r.map((c) => `<td>${inline(c)}</td>`).join('') + '</tr>').join('') + '</tbody></table></div>';
        table = null;
      };
      for (const raw of lines) {
        const l = raw.trim().replace(/^&gt;\s?/, '');
        if (/^\|.*\|$/.test(l)) {
          if (list) { html += '</ul>'; list = false; }
          const cells = l.slice(1, -1).split('|').map((c) => c.trim());
          if (cells.every((c) => /^:?-{2,}:?$/.test(c))) continue;
          (table = table || []).push(cells);
          continue;
        }
        flushTable();
        const li = l.match(/^(?:[-*•]|\d+[.)])\s+(.*)$/);
        if (li) { if (!list) { html += '<ul>'; list = true; } html += `<li>${inline(li[1])}</li>`; continue; }
        if (list) { html += '</ul>'; list = false; }
        if (l && !/^-{3,}$/.test(l)) html += `<p>${inline(l.replace(/^#+\s*/, ''))}</p>`;
      }
      flushTable();
      if (list) html += '</ul>';
      return html;
    }

    scroll() { requestAnimationFrame(() => { this.el.log.scrollTop = this.el.log.scrollHeight; }); }

    // ---------- conexión ----------
    connect() {
      if (!this.cfg.ws) { this.offline = true; this.setState('idle'); return; }
      if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) return;
      let ws;
      try { ws = new WebSocket(`${this.cfg.ws}/api/ws/chat/${encodeURIComponent(this.sid)}`); }
      catch { return this.reconnect(); }
      this.ws = ws;
      ws.onopen = () => {
        this.offline = false; this.retries = 0; this.setState(this.state || 'idle');
        while (this.queue.length) ws.send(JSON.stringify(this.queue.shift()));
      };
      ws.onmessage = (e) => { const d = safe(() => JSON.parse(e.data)); if (d) this.onServer(d); };
      ws.onclose = () => { if (this.ws === ws) this.reconnect(); };
      ws.onerror = () => {};
    }

    reconnect() {
      this.offline = true;
      if (this.state !== 'thinking') this.setState('idle');
      if (this.retries >= 6) return;
      const delay = Math.min(15000, 1500 * Math.pow(1.6, this.retries++));
      clearTimeout(this.rTimer);
      this.rTimer = setTimeout(() => this.connect(), delay);
    }

    send(text) {
      text = (text || '').trim();
      if (!text) return;
      this.markUsed();
      this.stopSpeaking();
      this.el.input.value = '';
      this.el.send.disabled = true;
      this.add({ role: 'user', text });
      this.setState('thinking');
      const payload = { type: 'message', content: text, mode: 'avatar' };
      if (this.ws && this.ws.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify(payload));
      else { this.queue.push(payload); this.retries = 0; this.connect(); }
      clearTimeout(this.waitTimer);
      this.waitTimer = setTimeout(() => {
        if (this.state === 'thinking') { this.setState('idle'); this.add({ role: 'error', text: 'Me quedé pensando de más. ¿Me lo repetís?' }); }
      }, 45000);
    }

    async onServer(d) {
      if (d.type === 'message') {
        clearTimeout(this.waitTimer);
        const text = String(d.content || '').trim();
        let products = Array.isArray(d.products) ? d.products : null;
        if (!products) {
          // primero, los productos que la IA nombró en su respuesta; si no nombró ninguno, la búsqueda que hizo
          const codes = this.codesIn(text);
          if (codes.length) products = await this.productsByCode(codes);
          if ((!products || !products.length) && d.search_query) products = await this.searchProducts(d.search_query);
        }
        this.add({ role: 'bot', text, products: products && products.length ? products.slice(0, 6) : undefined });
        if (products && products.length) { this.setState('happy'); setTimeout(() => this.speak(this.spoken(text, true)), 600); }
        else this.speak(this.spoken(text, false));
      } else if (d.type === 'error') {
        clearTimeout(this.waitTimer);
        this.setState('idle');
        this.add({ role: 'error', text: d.message || 'Algo salió mal. Probá de nuevo.' });
      } else if (d.type === 'session_timeout' || d.type === 'reset_complete') {
        // el backend reinicia su memoria; nosotros mantenemos el historial visible
      }
    }

    codesIn(text) {
      const found = [];
      const add = (c) => { c = decodeURIComponent(c).trim().split(/\s+/)[0].toUpperCase(); if (c && !found.includes(c)) found.push(c); };
      for (const m of String(text).matchAll(/productos\/([A-Za-z0-9%_-]{3,30})/g)) safe(() => add(m[1]));
      for (const m of String(text).matchAll(/\*\*([A-Z]{1,6}\d{1,}[A-Z0-9-]*)\*\*/g)) add(m[1]);
      for (const m of String(text).matchAll(/C[óo]digo(?: Nami)?:?\s*\**([A-Z]{1,6}\d{1,}[A-Z0-9-]*)/gi)) add(m[1]);
      return found.slice(0, 6);
    }

    async productsByCode(codes) {
      const res = await Promise.all(codes.map((c) => this.searchProducts(c, 4)));
      const out = [];
      res.forEach((list, i) => (list || []).filter((p) => p.family.toUpperCase() === codes[i]).forEach((p) => {
        if (!out.some((o) => o.id === p.id)) out.push(p);
      }));
      return out;
    }

    // misma búsqueda que la tienda (api-autoparts /search/smart) con el mismo formato de tarjeta que el backend
    async searchProducts(q, limit = 6) {
      try {
        const r = await fetch(`${this.cfg.productsApi}/search/smart?query=${encodeURIComponent(String(q).trim())}&limit=${limit}`);
        if (!r.ok) return null;
        const j = await r.json();
        const list = Array.isArray(j) ? j : (j.data || j.results || []);
        const seen = new Set();
        return list.map((p) => {
          const code = String(p.code || p.id || '').replace(/\s+$/, '');
          const family = String(p.family || p.group_code || code.split(' ')[0]).trim();
          return {
            id: code, family,
            name: [p.category, p.brand, p.model].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim().slice(0, 120) || p.description || code,
            year: p.ano || '',
            price: p.price,
            in_stock: typeof p.stock === 'number' ? p.stock > 0 : undefined,
            image_url: `https://nami-uy.s3.sa-east-1.amazonaws.com/products/${code.split(' ')[0]}.jpg`,
            url: this.cfg.productBase + encodeURIComponent(code),
          };
        }).filter((p) => p.id && !seen.has(p.id) && seen.add(p.id));
      } catch { return null; }
    }

    // texto apto para decir en voz alta
    spoken(text, hasCards) {
      let t = String(text || '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/https?:\/\/\S+/g, '')
        .replace(/(?:U\$S|USD|US\$)\s?(\d+)(?:[.,](\d{1,2}))?/gi, (m, n, c) => (c && +c ? `${n} con ${c} dólares` : `${n} dólares`))
        .replace(/(\d+)(?:[.,](\d{1,2}))?\s?(?:USD|U\$S|dólares)/gi, (m, n, c) => (c && +c ? `${n} con ${c} dólares` : `${n} dólares`))
        .replace(/\$\s?(\d{1,3}(?:\.\d{3})+|\d+)(?:,(\d{1,2}))?/g, (m, n) => `${n.replace(/\./g, '')} pesos`)
        .replace(/(\d)\.(\d{3})(?!\d)/g, '$1$2')
        .replace(/(\d)\.(\d)/g, '$1,$2')
        .replace(/^#{1,6}\s.*$/gm, '|')
        .replace(/[*_#`]/g, '');
      const lines = t.split('\n').map((l) => l.replace(/^>\s?/, '').replace(/\p{Extended_Pictographic}/gu, '').trim()).filter(Boolean);
      const isStruct = (l) => /^(?:[-•]|\d+[.)])\s+/.test(l) || l.startsWith('|') || /^-{3,}$/.test(l);
      // se dice el primer bloque de texto corrido; tablas, listas y lo que viene después queda en pantalla
      const prose = [];
      for (const l of lines) {
        if (isStruct(l)) { if (prose.length) break; continue; }
        prose.push(l);
      }
      const hadList = lines.some(isStruct);
      t = prose.join(' ').replace(/\s+/g, ' ').trim();
      const sentences = (t.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [t]).map((x) => x.trim());
      let out = '';
      for (const s of sentences) { if ((out + ' ' + s).length > 260) break; out = (out + ' ' + s).trim(); }
      out = (out || t.slice(0, 260)).trim();
      if (hasCards || hadList) out += ' Te dejo las opciones en pantalla.';
      return out.replace(/\s+/g, ' ').trim();
    }

    // ---------- voz: salida ----------
    unlockAudio() {
      if (!this.actx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) this.actx = safe(() => new AC());
      }
      if (this.actx && this.actx.state === 'suspended') this.actx.resume().catch(() => {});
      if (!this.unlocked && window.speechSynthesis) {
        this.unlocked = true;
        safe(() => { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); });
      }
    }

    async speak(text) {
      if (this.muted || !text) {
        if (this.state === 'happy') setTimeout(() => this.state === 'happy' && this.setState('idle'), 1100);
        else if (this.state !== 'listening') this.setState('idle');
        return;
      }
      this.stopSpeaking();
      const token = (this.speakToken = (this.speakToken || 0) + 1);
      if (this.ttsServer !== false && this.cfg.api) {
        try {
          const r = await fetch(`${this.cfg.api}/api/tts`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
          if (token !== this.speakToken) return;
          if (r.ok && (r.headers.get('content-type') || '').includes('audio')) {
            this.ttsServer = true;
            return this.playAudio(await r.blob(), token);
          }
          this.ttsServer = false;
        } catch { this.ttsServer = false; }
      }
      if (token === this.speakToken) this.speakBrowser(text);
    }

    playAudio(blob, token) {
      if (token !== this.speakToken) return;
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      this.audio = audio;
      if (this.actx) {
        safe(() => {
          const src = this.actx.createMediaElementSource(audio);
          const an = this.actx.createAnalyser();
          an.fftSize = 512;
          src.connect(an); an.connect(this.actx.destination);
          this.analyser = an;
        });
      }
      audio.onplay = () => { this.setState('talking'); this.lipLoop(); };
      audio.onended = audio.onerror = () => { URL.revokeObjectURL(url); if (this.audio === audio) this.doneTalking(); };
      audio.play().catch(() => this.doneTalking());
    }

    pickVoice() {
      if (this.voice !== undefined) return this.voice;
      const vs = safe(() => speechSynthesis.getVoices(), []).filter((v) => /^es/i.test(v.lang));
      if (!vs.length) return null;
      const pref = ['es-UY', 'es-AR', 'es-419', 'es-US', 'es-MX', 'es-CO', 'es-CL', 'es-ES'];
      const score = (v) => {
        const lang = v.lang.replace('_', '-');
        let s = pref.findIndex((p) => lang.startsWith(p)); if (s < 0) s = 20;
        if (/premium|enhanced|natural|neural|google/i.test(v.name)) s -= 8;
        if (/mateo|jorge|diego|pablo|juan|carlos|tom[aá]s|ra[uú]l|enrique|alvaro|álvaro|male|hombre/i.test(v.name)) s -= 4;
        return s;
      };
      this.voice = vs.sort((x, y) => score(x) - score(y))[0];
      return this.voice;
    }

    speakBrowser(text) {
      const synth = window.speechSynthesis;
      if (!synth) return this.doneTalking();
      const u = new SpeechSynthesisUtterance(text);
      const v = this.pickVoice();
      if (v) u.voice = v;
      u.lang = v ? v.lang : 'es-419';
      u.rate = 1.05; u.pitch = 1.0;
      this.utter = u;
      this.wordPulse = 0;
      u.onstart = () => { this.setState('talking'); this.lipLoop(); };
      u.onboundary = () => { this.wordPulse = performance.now(); };
      u.onend = u.onerror = () => { if (this.utter === u) this.doneTalking(); };
      synth.speak(u);
      // Safari a veces no dispara onstart
      setTimeout(() => { if (this.utter === u && synth.speaking && this.state !== 'talking') { this.setState('talking'); this.lipLoop(); } }, 400);
    }

    lipLoop() {
      cancelAnimationFrame(this.raf);
      const buf = this.analyser ? new Uint8Array(this.analyser.fftSize) : null;
      let level = 0;
      const tick = (t) => {
        if (this.state !== 'talking') return this.setMouth(0);
        let target;
        if (this.analyser && this.audio && !this.audio.paused) {
          this.analyser.getByteTimeDomainData(buf);
          let sum = 0; for (let i = 0; i < buf.length; i++) { const x = (buf[i] - 128) / 128; sum += x * x; }
          target = Math.min(1, Math.max(0, (Math.sqrt(sum / buf.length) - 0.015) * 7));
        } else {
          // sin acceso al audio del navegador: boca que "habla" con sílabas sintéticas
          const sinceWord = t - (this.wordPulse || 0);
          const syll = 0.5 + 0.5 * Math.sin(t / 55) * Math.sin(t / 23 + 1.3);
          target = 0.15 + 0.75 * syll * (sinceWord < 450 ? 1 : 0.7);
        }
        level += (target - level) * 0.45;
        this.setMouth(level);
        this.raf = requestAnimationFrame(tick);
      };
      this.raf = requestAnimationFrame(tick);
    }

    setMouth(m) {
      const open = m > 0.08;
      this.el.smile.style.opacity = open ? '1' : '0';
      this.el.mouth.style.opacity = open ? '1' : '0';
      this.el.mouth.setAttribute('transform', `rotate(-14 192 108) translate(192 104) scale(${open ? 0.75 + m * 0.3 : 1} ${open ? 0.3 + m * 0.85 : 0}) translate(-192 -104)`);
    }

    doneTalking() {
      cancelAnimationFrame(this.raf);
      this.setMouth(0);
      this.utter = null; this.audio = null; this.analyser = null;
      if (['talking', 'happy', 'thinking'].includes(this.state)) this.setState('idle');
    }

    stopSpeaking() {
      this.speakToken = (this.speakToken || 0) + 1;
      if (this.audio) { safe(() => this.audio.pause()); }
      if (window.speechSynthesis && (speechSynthesis.speaking || speechSynthesis.pending)) safe(() => speechSynthesis.cancel());
      this.doneTalking();
    }

    // ---------- voz: entrada ----------
    toggleMic() { if (this.listening) this.stopMic(true); else this.startMic(); }

    startMic() {
      this.markUsed();
      this.stopSpeaking();
      if (SR) return this.startSR();
      if (navigator.mediaDevices && window.MediaRecorder && this.cfg.api) return this.startRecorder();
      this.add({ role: 'error', text: 'Tu navegador no me deja escucharte. Escribime y te respondo.' });
    }

    startSR() {
      const rec = new SR();
      rec.lang = 'es-UY'; rec.interimResults = true; rec.continuous = false; rec.maxAlternatives = 1;
      this.rec = rec;
      let finalText = '';
      rec.onstart = () => { this.listening = true; this.el.mic.classList.add('on'); this.setState('listening'); };
      rec.onresult = (e) => {
        let interim = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) finalText += e.results[i][0].transcript; else interim += e.results[i][0].transcript;
        }
        this.el.input.value = (finalText + ' ' + interim).trim();
      };
      rec.onerror = (e) => {
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') this.add({ role: 'error', text: 'Necesito permiso para usar el micrófono. Igual podés escribirme.' });
      };
      rec.onend = () => {
        this.listening = false; this.el.mic.classList.remove('on');
        if (rec.cancelled) { if (this.state === 'listening') this.setState('idle'); return; }
        const t = (finalText || this.el.input.value).trim();
        if (t) this.send(t); else if (this.state === 'listening') this.setState('idle');
      };
      safe(() => rec.start());
    }

    async startRecorder() {
      let stream;
      try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
      catch { return this.add({ role: 'error', text: 'Necesito permiso para usar el micrófono. Igual podés escribirme.' }); }
      const chunks = [];
      const mr = new MediaRecorder(stream);
      this.mr = mr;
      mr.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        this.listening = false; this.el.mic.classList.remove('on');
        if (!this.sendRecording) return this.setState('idle');
        this.setState('thinking');
        try {
          const blob = new Blob(chunks, { type: mr.mimeType || 'audio/webm' });
          const ext = (mr.mimeType || '').includes('mp4') ? 'mp4' : 'webm';
          const fd = new FormData(); fd.append('file', blob, `voz.${ext}`);
          const r = await fetch(`${this.cfg.api}/api/transcribe`, { method: 'POST', body: fd });
          const j = await r.json();
          const text = Array.isArray(j) ? '' : (j.text || '');
          if (text) this.send(text); else { this.setState('idle'); this.add({ role: 'error', text: 'No te entendí bien. ¿Probás de nuevo?' }); }
        } catch { this.setState('idle'); this.add({ role: 'error', text: 'No pude procesar el audio. ¿Me lo escribís?' }); }
      };
      this.sendRecording = true;
      mr.start();
      this.listening = true; this.el.mic.classList.add('on'); this.setState('listening');
      this.recTimer = setTimeout(() => this.stopMic(true), 12000);
    }

    stopMic(sendIt = false) {
      clearTimeout(this.recTimer);
      if (this.rec) { const r = this.rec; r.cancelled = !sendIt; safe(() => (sendIt ? r.stop() : r.abort())); this.rec = null; }
      if (this.mr && this.mr.state !== 'inactive') { this.sendRecording = sendIt; safe(() => this.mr.stop()); }
      this.mr = null;
    }
  }

  customElements.define('viriato-avatar', ViriatoAvatar);
})();
