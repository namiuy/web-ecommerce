import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="es">
      <Head />
      <body>
        {/* Fija el tema guardado antes del primer paint para evitar flash */}
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('rbt-theme')||'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){}` }} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
