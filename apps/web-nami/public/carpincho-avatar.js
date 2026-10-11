/*!
 * Carpincho Viajero — avatar de bienvenida y asistente de Robotec
 *
 * Uso (cualquier página):
 *   <script src="/carpincho-avatar.js" defer></script>
 *   <carpincho-avatar
 *     ws-url="wss://ia.nami.com.uy/robotec"
 *     api-url="https://ia.nami.com.uy/robotec"
 *     products-api="https://api-ecommerce.robotec.com.uy"
 *     product-base="/productos/"
 *     whatsapp="59899263226"></carpincho-avatar>
 *
 * Atributos opcionales:
 *   welcome="off"   → no abre la bienvenida en la primera visita
 *   music-src="/carpincho-viajero.mp3" → la canción suena en las páginas de music-pages
 *   music-pages="/" (lista separada por comas), music-bpm="97.5", music-volume="0.35"
 *     La canción suena (y el carpincho baila) mientras la persona todavía no usó el asistente.
 *     Los navegadores no dejan reproducir audio sin un gesto: si el autoplay está bloqueado,
 *     arranca con el primer toque/clic/tecla en la página.
 *   voice="off"     → arranca sin voz
 *   ?carpincho=1 en la URL fuerza la bienvenida (útil para probar)
 *
 * Habla con el backend robotec-ia por WebSocket (mismo protocolo que el chat actual).
 * Si el backend devuelve `products` los muestra; si sólo devuelve `search_query`,
 * busca las tarjetas directamente en la API del e-commerce.
 */
(() => {
  'use strict';
  if (window.customElements && customElements.get('carpincho-avatar')) return;

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

  // ---------- el carpincho (SVG) ----------
  const CAPY_SVG = (id) => `
<svg class="capy" viewBox="70 34 260 440" aria-hidden="true" focusable="false">
  <defs>
    <radialGradient id="${id}fur" cx="45%" cy="35%" r="70%"><stop offset="0" stop-color="#b8845a"/><stop offset="1" stop-color="#8e5f3b"/></radialGradient>
    <radialGradient id="${id}head" cx="45%" cy="30%" r="75%"><stop offset="0" stop-color="#bd8a5f"/><stop offset="1" stop-color="#93623d"/></radialGradient>
    <radialGradient id="${id}orange" cx="35%" cy="30%" r="70%"><stop offset="0" stop-color="#ffb35c"/><stop offset="1" stop-color="#e8741a"/></radialGradient>
  </defs>
  <ellipse class="shadow" cx="200" cy="462" rx="90" ry="11" fill="#000" opacity=".28"/>
  <g class="bounce"><g class="sway">
    <g class="legL"><rect x="140" y="368" width="44" height="84" rx="20" fill="#7d5132"/><ellipse cx="158" cy="452" rx="30" ry="12" fill="#5e3b22"/></g>
    <g class="legR"><rect x="216" y="368" width="44" height="84" rx="20" fill="#7d5132"/><ellipse cx="242" cy="452" rx="30" ry="12" fill="#5e3b22"/></g>
    <g class="armL"><rect x="98" y="284" width="36" height="84" rx="18" fill="#865838"/><ellipse cx="116" cy="366" rx="20" ry="15" fill="#6a4429"/></g>
    <g class="body">
      <path d="M200 238 C 272 238 304 290 304 346 C 304 404 262 432 200 432 C 138 432 96 404 96 346 C 96 290 128 238 200 238 Z" fill="url(#${id}fur)"/>
      <ellipse cx="200" cy="360" rx="62" ry="62" fill="#c79a6f" opacity=".75"/>
      <!-- tiradores de la mochila de viajero -->
      <path d="M132 276 C 150 320 150 380 146 418 M268 276 C 250 320 250 380 254 418" stroke="#2a6f8f" stroke-width="10" fill="none" stroke-linecap="round" opacity=".9"/>
      <circle cx="148" cy="330" r="6" fill="#ffd34d"/><circle cx="252" cy="330" r="6" fill="#ffd34d"/>
      <!-- chapita de Robotec -->
      <g transform="translate(200 352)"><circle r="17" fill="#141414"/><circle r="17" fill="none" stroke="#29a9e1" stroke-width="3"/><path d="M-7 -6 h14 v12 h-14 z M-3 -10 v4 M3 -10 v4 M-4 -1 h2 M2 -1 h2" stroke="#29a9e1" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>
    </g>
    <g class="armR"><rect x="266" y="284" width="36" height="84" rx="18" fill="#865838"/><ellipse cx="284" cy="366" rx="20" ry="15" fill="#6a4429"/></g>
    <g class="head">
      <g class="earL"><ellipse cx="142" cy="122" rx="13" ry="11" fill="#7d5132"/><ellipse cx="143" cy="124" rx="7" ry="5" fill="#4f311c"/></g>
      <g class="earR"><ellipse cx="258" cy="122" rx="13" ry="11" fill="#7d5132"/><ellipse cx="257" cy="124" rx="7" ry="5" fill="#4f311c"/></g>
      <path d="M200 106 C 250 106 278 122 282 160 C 286 196 286 232 262 254 C 244 270 222 272 200 272 C 178 272 156 270 138 254 C 114 232 114 196 118 160 C 122 122 150 106 200 106 Z" fill="url(#${id}head)"/>
      <path d="M200 186 C 244 186 262 204 262 230 C 262 256 236 268 200 268 C 164 268 138 256 138 230 C 138 204 156 186 200 186 Z" fill="#8a5a37"/>
      <ellipse cx="146" cy="206" rx="16" ry="10" fill="#ff8fa3" opacity=".35"/>
      <ellipse cx="254" cy="206" rx="16" ry="10" fill="#ff8fa3" opacity=".35"/>
      <g class="eyesOpen"><g class="eyes">
        <g class="eye"><ellipse cx="160" cy="160" rx="8" ry="10" fill="#2a1a0e"/><circle cx="163" cy="156" r="3" fill="#fff"/></g>
        <g class="eye"><ellipse cx="240" cy="160" rx="8" ry="10" fill="#2a1a0e"/><circle cx="243" cy="156" r="3" fill="#fff"/></g>
      </g>
        <path d="M148 146 q12 -6 24 0 M228 146 q12 -6 24 0" stroke="#6b4428" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6"/>
      </g>
      <g class="eyesHappy" stroke="#2a1a0e" stroke-width="5" stroke-linecap="round" fill="none"><path d="M150 164 q10 -14 20 0"/><path d="M230 164 q10 -14 20 0"/></g>
      <ellipse cx="184" cy="212" rx="6" ry="4.5" fill="#2a1a0e"/><ellipse cx="216" cy="212" rx="6" ry="4.5" fill="#2a1a0e"/>
      <path d="M200 222 v12" stroke="#3a2416" stroke-width="3" stroke-linecap="round"/>
      <path class="mouthSmile" d="M184 238 q8 9 16 0 q8 9 16 0" stroke="#3a2416" stroke-width="3" fill="none" stroke-linecap="round"/>
      <g class="mouthOpen"><ellipse cx="200" cy="246" rx="15" ry="12" fill="#3a1a12"/><ellipse cx="200" cy="253" rx="9" ry="4.5" fill="#ff7a8c"/><rect x="194" y="234" width="12" height="7" rx="2" fill="#fff6e6"/></g>
      <g class="mandarina">
        <circle cx="200" cy="92" r="24" fill="url(#${id}orange)"/>
        <ellipse cx="190" cy="82" rx="6" ry="4" fill="#fff" opacity=".35" transform="rotate(-30 190 82)"/>
        <path d="M200 69 v-6" stroke="#5b3a1c" stroke-width="3" stroke-linecap="round"/>
        <path d="M201 66 C 210 54 226 56 230 62 C 222 70 210 70 201 66 Z" fill="#4caf50"/>
      </g>
    </g>
  </g></g>
</svg>`;

  const ICONS = {
    mic: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2Z"/></svg>',
    send: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3.4 20.4 21 12 3.4 3.6 3.4 10l12.6 2-12.6 2z"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.3 5.71 12 12.01l-6.3-6.3-1.41 1.41 6.3 6.3-6.3 6.3 1.41 1.41 6.3-6.3 6.3 6.3 1.41-1.41-6.3-6.3 6.3-6.3z"/></svg>',
    sound: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3a4.5 4.5 0 0 0-2.5-4.03v8.05A4.5 4.5 0 0 0 16.5 12ZM14 3.23v2.06a7 7 0 0 1 0 13.42v2.06a9 9 0 0 0 0-17.54Z"/></svg>',
    muted: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63ZM19 12c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.8 8.8 0 0 0 21 12a9 9 0 0 0-7-8.77v2.06A7 7 0 0 1 19 12ZM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a9 9 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3ZM12 4 9.91 6.09 12 8.18V4Z"/></svg>',
    wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35ZM12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.43 9.43 0 1 1 7.99 4.42Zm8.03-17.46A11.25 11.25 0 0 0 2.46 17.6L.86 23.4l5.94-1.56a11.24 11.24 0 0 0 5.24 1.33h.01A11.27 11.27 0 0 0 20.08 4.04Z"/></svg>',
  };

  const CHIPS = [
    { label: 'Robótica para el aula', text: 'Busco kits de robótica educativa para usar en clase' },
    { label: 'Arduino y placas', text: '¿Qué placa me recomendás para empezar con Arduino?' },
    { label: 'Impresión 3D', text: 'Quiero ver impresoras 3D y filamentos' },
    { label: 'Regalo para chicos', text: 'Busco un regalo de robótica para un niño de 8 años' },
    { label: 'Ofertas', text: '¿Qué ofertas tienen ahora?' },
    { label: 'Cursos', text: '¿Qué cursos tienen?' },
  ];

  const GREETING = '¡Hola! Soy el Carpincho Viajero de Robotec. Recorro escuelas y talleres armando robots. ¿Qué querés construir hoy?';

  const CSS = `
:host{all:initial;--rt-blue:#29a9e1;--rt-ink:#161616;--orange:#f28c28;--lagoon:#0e2f33;--lagoon2:#174a50;--paper:#ffffff;--soft:#f2f4f5;--text:#1b1d1f;--muted:#5f6b70;--line:#e3e7e9;
  font-family:Roboto,system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--text);font-size:15px;line-height:1.45}
*{box-sizing:border-box}
[hidden]{display:none!important}
button{font:inherit;cursor:pointer}
button:focus-visible,a:focus-visible,input:focus-visible{outline:3px solid var(--rt-blue);outline-offset:2px}

/* --- botón flotante --- */
.launcher{position:fixed;left:16px;bottom:16px;z-index:2147483000;display:flex;align-items:flex-end;gap:10px;background:none;border:0;padding:0}
.launcher .mini{width:72px;height:72px;border-radius:50%;background:radial-gradient(circle at 50% 30%,var(--lagoon2),var(--lagoon));box-shadow:0 6px 20px rgba(0,0,0,.28),0 0 0 3px #fff;overflow:hidden;display:grid;place-items:center;transition:transform .2s}
.launcher:hover .mini{transform:translateY(-3px) rotate(-4deg)}
.launcher .mini svg{width:118%;height:118%;margin-top:30%}
.tip{background:#fff;color:var(--text);border-radius:14px 14px 14px 4px;padding:10px 14px;box-shadow:0 6px 20px rgba(0,0,0,.18);font-size:14px;max-width:230px;text-align:left;margin-bottom:64px;order:2;animation:pop .35s ease-out both}
@keyframes pop{from{opacity:0;transform:translateY(6px) scale(.96)}to{opacity:1;transform:none}}

/* --- botón de la canción --- */
.music{position:fixed;left:98px;bottom:30px;z-index:2147483003;display:flex;align-items:center;gap:8px;border:0;border-radius:999px;padding:9px 14px 9px 12px;background:#fff;color:var(--text);font-size:13px;font-weight:600;box-shadow:0 4px 16px rgba(0,0,0,.2);animation:pop .3s ease-out both}
.music:hover{background:#f0f9fe}
.eq{display:flex;align-items:flex-end;gap:2px;width:16px;height:14px}
.eq i{flex:1;height:30%;background:var(--orange);border-radius:1px}
.music.on .eq i{animation:eq calc(var(--beat,.6s)) ease-in-out infinite alternate}
.music.on .eq i:nth-child(2){animation-delay:calc(var(--beat,.6s) * -.33)}
.music.on .eq i:nth-child(3){animation-delay:calc(var(--beat,.6s) * -.66)}
@keyframes eq{from{height:20%}to{height:100%}}
.panel:not([hidden]).dock ~ .music{display:none}
@media (max-width:560px){.panel:not([hidden]) ~ .music{display:none}}

/* --- panel --- */
.backdrop{position:fixed;inset:0;z-index:2147483001;background:rgba(10,20,22,.55);backdrop-filter:blur(3px);animation:fade .25s both}
@keyframes fade{from{opacity:0}}
.panel{position:fixed;z-index:2147483002;background:var(--paper);display:flex;flex-direction:column;overflow:hidden;box-shadow:0 18px 50px rgba(0,0,0,.35);animation:pop .3s ease-out both}
.panel.dock{left:16px;bottom:16px;width:min(400px,calc(100vw - 32px));height:min(640px,calc(100vh - 32px));border-radius:22px}
.panel.welcome{left:50%;top:50%;transform:translate(-50%,-50%);width:min(620px,calc(100vw - 32px));max-height:calc(100vh - 32px);border-radius:26px;animation:none}
@media (max-width:560px){
  .panel.dock,.panel.welcome{left:0;top:0;bottom:0;right:0;transform:none;width:100%;height:100%;max-height:none;border-radius:0}
}

header{position:relative;background:radial-gradient(120% 90% at 50% 0%,var(--lagoon2),var(--lagoon) 70%);color:#f3ead8;display:flex;align-items:center;gap:12px;padding:12px 14px}
.welcome header{flex-direction:column;padding:14px 16px 10px}
.stage{position:relative;flex:none;width:92px;height:118px}
.welcome .stage{width:170px;height:218px}
.welcome.chatting .stage{width:110px;height:140px}
.stage .capy{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.ring{position:absolute;left:50%;bottom:4%;width:86%;height:26%;transform:translateX(-50%);border-radius:50%;background:radial-gradient(closest-side,rgba(41,169,225,.55),transparent);opacity:0;transition:opacity .3s}
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
.hgroup span{font-size:13px;color:#a9c3bb}
.tools{display:flex;gap:4px;align-self:flex-start}
.welcome .tools{position:absolute;right:10px;top:10px}
.icon{width:38px;height:38px;border-radius:12px;border:0;background:rgba(255,255,255,.08);color:#f3ead8;display:grid;place-items:center}
.icon:hover{background:rgba(255,255,255,.16)}
.icon svg{width:20px;height:20px}

/* animaciones del carpincho (coordenadas del viewBox) */
.capy *{transform-box:view-box}
.bounce,.sway{transform-origin:200px 462px}
.head{transform-origin:200px 252px;transition:transform .35s}
.armL{transform-origin:116px 292px;transform:rotate(14deg)}
.armR{transform-origin:284px 292px;transform:rotate(-14deg)}
.earL{transform-origin:142px 128px}.earR{transform-origin:258px 128px}
.mandarina{transform-origin:200px 114px}
.body{transform-origin:200px 430px}
.legL{transform-origin:162px 380px}.legR{transform-origin:238px 380px}
.shadow{transform-origin:200px 462px}
.eye{transform-box:fill-box!important;transform-origin:center}
.eyes{transition:transform .3s}
.mouthOpen{transform-origin:200px 236px;transform:scaleY(0);opacity:0}
.eyesHappy{opacity:0}
.happy .eyesHappy{opacity:1}.happy .eyesOpen{opacity:0}

.stage .body{animation:breathe 3.2s ease-in-out infinite}
.stage .eye{animation:blink 4.5s infinite}
.stage .earL{animation:twitch 7s infinite}.stage .earR{animation:twitch 7s 1.3s infinite}
@keyframes breathe{50%{transform:scale(1.015,1.025)}}
@keyframes blink{0%,94%,100%{transform:scaleY(1)}97%{transform:scaleY(.1)}}
@keyframes twitch{0%,90%,100%{transform:rotate(0)}93%{transform:rotate(-14deg)}96%{transform:rotate(6deg)}}

.listening .head{transform:rotate(-7deg)}
.listening .earL{animation:none;transform:rotate(-16deg)}.listening .earR{animation:none;transform:rotate(16deg)}
.thinking .eyes{transform:translate(4px,-5px)}
.thinking .mandarina{animation:think 1.6s ease-in-out infinite}
@keyframes think{50%{transform:rotate(18deg) translateY(-3px)}}
.talking .head{animation:nod .9s ease-in-out infinite}
@keyframes nod{50%{transform:rotate(-2.5deg) translateY(2px)}}
.waving .armR{animation:wave .45s ease-in-out 4 alternate}
@keyframes wave{from{transform:rotate(-150deg)}to{transform:rotate(-115deg)}}
.happy .bounce{animation:hop .5s ease-out 2}

/* baile al ritmo de la canción (--beat = 60 / bpm) */
.dance .capy .bounce{animation:dBounce var(--beat) ease-in-out infinite}
.dance .capy .sway{animation:dSway calc(var(--beat)*2) ease-in-out infinite}
.dance .capy .head{animation:dHead calc(var(--beat)*2) ease-in-out infinite}
.dance .capy .armL{animation:dArmL calc(var(--beat)*2) ease-in-out infinite}
.dance .capy .armR{animation:dArmR calc(var(--beat)*2) ease-in-out infinite}
.dance .capy .legL{animation:dStep calc(var(--beat)*2) ease-in-out infinite}
.dance .capy .legR{animation:dStep calc(var(--beat)*2) ease-in-out calc(var(--beat)*-1) infinite}
.dance .capy .mandarina{animation:dWobble var(--beat) ease-in-out calc(var(--beat)*-.15) infinite}
.dance .capy .earL{animation:dFlap var(--beat) ease-in-out infinite}
.dance .capy .earR{animation:dFlap var(--beat) ease-in-out calc(var(--beat)*-.5) infinite}
.dance .capy .shadow{animation:dShadow var(--beat) ease-in-out infinite}
.dance .capy .eyesHappy{opacity:1}.dance .capy .eyesOpen{opacity:0}
@keyframes dBounce{0%,100%{transform:translateY(0) scale(1.04,.96)}50%{transform:translateY(-18px) scale(.97,1.03)}}
@keyframes dSway{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}
@keyframes dHead{0%,100%{transform:rotate(9deg)}50%{transform:rotate(-9deg)}}
@keyframes dArmL{0%,100%{transform:rotate(25deg)}50%{transform:rotate(155deg)}}
@keyframes dArmR{0%,100%{transform:rotate(-155deg)}50%{transform:rotate(-25deg)}}
@keyframes dStep{0%,40%,100%{transform:translateY(0) rotate(0)}20%{transform:translateY(-14px) rotate(-8deg)}}
@keyframes dWobble{0%,100%{transform:rotate(-12deg)}50%{transform:rotate(12deg) translateY(-4px)}}
@keyframes dFlap{0%,100%{transform:rotate(0)}50%{transform:rotate(-12deg)}}
@keyframes dShadow{0%,100%{transform:scale(1)}50%{transform:scale(.8);opacity:.6}}
@keyframes hop{50%{transform:translateY(-16px) scale(.98,1.03)}}

/* --- conversación --- */
.say{margin:0 14px;padding:12px 16px;background:var(--soft);border-radius:4px 16px 16px 16px;font-size:16px}
.welcome .say{margin:14px 22px 0;border-radius:16px;text-align:center;font-size:17px}
.log{flex:1;min-height:0;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;overscroll-behavior:contain}
.welcome .log{min-height:120px}
.log>*{flex-shrink:0}
.msg{max-width:88%;padding:10px 14px;border-radius:16px;word-wrap:break-word}
.msg p{margin:0 0 6px}.msg p:last-child{margin:0}
.msg ul{margin:4px 0;padding-left:18px}
.msg a{color:#0b6fa4}
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
.card:hover{border-color:var(--rt-blue);box-shadow:0 4px 14px rgba(41,169,225,.2)}
.card img{width:100%;aspect-ratio:1;object-fit:contain;background:#fff;padding:8px}
.card .ci{padding:8px 10px 10px;display:flex;flex-direction:column;gap:4px;border-top:1px solid var(--line);flex:1}
.card .cn{font-size:13px;line-height:1.3;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.card .cp{font-weight:700;font-size:15px;margin-top:auto}
.card .cc{font-size:11px;color:var(--muted)}

.chips{display:flex;flex-wrap:wrap;gap:8px;padding:12px 14px 4px}
.welcome .chips{justify-content:center;padding:14px 22px 4px}
.chip{border:1px solid var(--line);background:#fff;color:var(--text);border-radius:999px;padding:9px 14px;font-size:14px}
.chip:hover{border-color:var(--rt-blue);color:#0b6fa4;background:#f0f9fe}

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

  class CarpinchoAvatar extends HTMLElement {
    connectedCallback() {
      if (this._ready) return;
      this._ready = true;

      const a = (n, d) => (this.getAttribute(n) || d || '').trim();
      this.cfg = {
        ws: a('ws-url').replace(/\/+$/, ''),
        api: a('api-url').replace(/\/+$/, ''),
        productsApi: a('products-api', 'https://api-ecommerce.robotec.com.uy').replace(/\/+$/, ''),
        productBase: a('product-base', '/productos/'),
        whatsapp: a('whatsapp', '59899263226').replace(/\D/g, ''),
        welcome: a('welcome', 'on') !== 'off',
        musicSrc: a('music-src'),
        musicPages: a('music-pages', '/').split(',').map((x) => x.trim().replace(/\/+$/, '') || '/'),
        bpm: parseFloat(a('music-bpm', '97.5')) || 97.5,
        musicVolume: Math.min(1, Math.max(0, parseFloat(a('music-volume', '0.35')) || 0.35)),
      };
      this.sid = ss.get('carpincho_sid') || `web_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      ss.set('carpincho_sid', this.sid);
      this.msgs = ss.get('carpincho_msgs') || [];
      this.muted = ls.get('carpincho_muted') === '1' || a('voice') === 'off';
      this.ttsServer = this.cfg.api ? null : false; // null = no probado
      this.queue = [];
      this.retries = 0;
      this.used = !!ss.get('carpincho_used') || this.msgs.some((m) => m.role === 'user');
      this.musicOff = ls.get('carpincho_music_off') === '1';

      this.render();
      this.renderLog();

      const force = /[?&]carpincho=1\b/.test(location.search);
      const seen = ls.get('carpincho_welcome_seen') === '1';
      const wasOpen = ss.get('carpincho_open');
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
      root.innerHTML = `<style>${CSS}</style>
<button class="launcher" type="button" aria-label="Abrir el asistente Carpincho Viajero">
  <span class="tip" hidden></span>
  <span class="mini">${CAPY_SVG('l')}</span>
</button>
<div class="backdrop" hidden></div>
<section class="panel dock" role="dialog" aria-modal="false" aria-label="Carpincho Viajero, asistente de Robotec" hidden>
  <header>
    <div class="stage">${CAPY_SVG('p')}<div class="ring"></div><div class="dots"><i></i><i></i><i></i></div></div>
    <div class="hgroup"><strong>Carpincho Viajero</strong><span class="status">Asistente de Robotec</span></div>
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
        mouth: $('.stage .mouthOpen'), smile: $('.stage .mouthSmile'),
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
        ls.set('carpincho_muted', this.muted ? '1' : '0');
        if (this.muted) { this.stopSpeaking(); this.stopMusic(); } else this.armMusic();
        this.updateMute();
      });
      this.el.chips.addEventListener('click', (e) => { const b = e.target.closest('.chip'); if (b) { this.unlockAudio(); this.send(CHIPS[+b.dataset.i].text); } });
      this.el.input.addEventListener('input', () => { this.el.send.disabled = !this.el.input.value.trim(); });
      this.el.form.addEventListener('submit', (e) => { e.preventDefault(); this.unlockAudio(); this.send(this.el.input.value); });
      this.el.mic.addEventListener('click', () => { this.unlockAudio(); this.toggleMic(); });
      this.el.panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.close(); });
      // si la pestaña queda en segundo plano, el carpincho deja de hablar
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
      if (!this.el.panel.hidden || ss.get('carpincho_tip')) return;
      ss.set('carpincho_tip', 1);
      this.el.tip.textContent = '¡Hola! ¿Te ayudo a encontrar algo?';
      this.el.tip.hidden = false;
      setTimeout(() => { this.el.tip.hidden = true; }, 8000);
    }

    open(mode, withGesture) {
      clearTimeout(this.tipTimer);
      this.el.tip.hidden = true;
      this.mode = mode;
      ss.set('carpincho_open', mode);
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
      ls.set('carpincho_welcome_seen', '1');
      ss.del('carpincho_open');
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
      const text = `Hola Robotec, vengo del Carpincho Viajero de la web.${lastQ ? ` Mi consulta: ${lastQ.text}` : ''}`;
      this.el.wa.href = `https://wa.me/${this.cfg.whatsapp}?text=${encodeURIComponent(text)}`;
    }

    setState(s) {
      this.state = s;
      const st = this.el.stage;
      st.classList.remove('idle', 'listening', 'thinking', 'talking', 'happy', 'waving');
      st.classList.add(s);
      const labels = { listening: 'Te escucho…', thinking: 'Pensando…', talking: 'Hablando', idle: 'Asistente de Robotec', happy: 'Asistente de Robotec', waving: 'Asistente de Robotec' };
      this.el.status.textContent = this.offline ? 'Sin conexión, reintentando…' : (labels[s] || '');
    }

    // ---------- canción del Carpincho Viajero ----------
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

    // autoplay bloqueado: la canción arranca con el primer gesto en la página (no en el carpincho)
    waitGesture() {
      if (this.offGesture) return;
      const evs = ['pointerdown', 'keydown', 'touchend'];
      const h = (e) => {
        // si toca el chat (atajos, campo de texto, botón del carpincho) está empezando a usarlo: no arrancamos
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
      ls.set('carpincho_music_off', playing ? '1' : '0');
      if (playing) this.stopMusic();
      else { if (this.muted) { this.muted = false; ls.set('carpincho_muted', '0'); this.updateMute(); } this.armMusic(); }
    }

    markUsed() {
      if (!this.used) { this.used = true; ss.set('carpincho_used', 1); }
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
      this.el.musicLabel.textContent = playing ? 'Pausar la canción' : 'Escuchar la canción';
      b.setAttribute('aria-label', playing ? 'Pausar la canción del Carpincho Viajero' : 'Escuchar la canción del Carpincho Viajero');
    }

    musicTip() {
      if (!this.el.panel.hidden || ss.get('carpincho_music_tip')) return;
      ss.set('carpincho_music_tip', 1);
      clearTimeout(this.tipTimer);
      this.el.tip.textContent = '¡Esta es mi canción! Tocame y te ayudo a encontrar lo que buscás.';
      this.el.tip.hidden = false;
      setTimeout(() => { this.el.tip.hidden = true; }, 9000);
    }

    // ---------- mensajes ----------
    save() {
      this.msgs = this.msgs.slice(-30);
      ss.set('carpincho_msgs', this.msgs);
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
      const id = String(p.id || p.codigo || '').trim();
      const name = String(p.name || p.nombre || '').trim();
      const price = Number(p.price ?? p.precio_usd);
      const img = p.image_url || p.imagen || (p.images && p.images[0]) || '';
      const href = p.url || (this.cfg.productBase + encodeURIComponent(id));
      return `<a class="card" href="${esc(href)}" target="_top">
        ${img ? `<img src="${esc(img)}" alt="" loading="lazy">` : ''}
        <span class="ci"><span class="cn">${esc(name)}</span>
        ${Number.isFinite(price) && price > 0 ? `<span class="cp">U$S ${price.toFixed(2)}</span>` : ''}
        <span class="cc">Cód. ${esc(id)}</span></span></a>`;
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
      const add = (c) => { c = c.toUpperCase(); if (!found.includes(c)) found.push(c); };
      for (const m of String(text).matchAll(/productos\/([A-Za-z0-9_-]{3,20})/g)) add(m[1]);
      for (const m of String(text).matchAll(/\*\*([A-Z]{1,6}\d{2,}[A-Z0-9-]*)\*\*/g)) add(m[1]);
      return found.slice(0, 6);
    }

    async productsByCode(codes) {
      const res = await Promise.all(codes.map((c) => this.searchProducts(c, 3)));
      return res.map((list, i) => (list || []).find((p) => String(p.id).toUpperCase() === codes[i])).filter(Boolean);
    }

    async searchProducts(q, limit = 6) {
      try {
        const keywords = String(q).trim().split(/\s+/).filter(Boolean);
        const r = await fetch(`${this.cfg.productsApi}/api/products/search`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keywords, limit, only_public: true }),
        });
        if (!r.ok) return null;
        const j = await r.json();
        return (j.data || []).map((p) => ({ id: p.id, name: p.name, price: p.price, image_url: p.image_url }));
      } catch { return null; }
    }

    // texto apto para decir en voz alta
    spoken(text, hasCards) {
      let t = String(text || '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/https?:\/\/\S+/g, '')
        .replace(/(?:U\$S|USD|US\$)\s?(\d+)(?:[.,](\d{1,2}))?/gi, (m, n, c) => (c && +c ? `${n} con ${c} dólares` : `${n} dólares`))
        .replace(/(\d+)(?:[.,](\d{1,2}))?\s?(?:USD|U\$S|dólares)/gi, (m, n, c) => (c && +c ? `${n} con ${c} dólares` : `${n} dólares`))
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
      u.rate = 1.04; u.pitch = 1.15;
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
      this.el.mouth.style.opacity = open ? '1' : '0';
      this.el.mouth.style.transform = `scaleY(${open ? 0.25 + m * 0.85 : 0})`;
      this.el.smile.style.opacity = open ? '0' : '1';
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

  customElements.define('carpincho-avatar', CarpinchoAvatar);
})();
