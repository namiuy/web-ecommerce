import { useEffect, useState, useCallback } from 'react';

const LogoRobotec = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="26" viewBox="0 0 1000 92" fill="none" className="logo">
    <path d="M21.7 0H0V22.2V35.2V57.2V92H22V57H85.6L107.6 92H129.6L107.6 57H107.8H130V35.2V22.2V0H107.7H21.7ZM108 35H22V22H108V35Z" fill="currentColor" />
    <path d="M166.7 0H145V22.2V70.2V92H166.7H252.7H275V70.2V22.2V0H252.7H166.7ZM253 70H167V22H253V70Z" fill="currentColor" />
    <path d="M456.7 0H435V22.2V70.2V92H456.7H542.7H565V70.2V22.2V0H542.7H456.7ZM543 70H457V22H543V70Z" fill="currentColor" />
    <path d="M398 22.2V0H375.7H311.7H290V22.2V35.2V57.2V70.2V92H311.7H397.7H420V70.2V57.2V35H398V22.2ZM398 70H312V57H375.7H398V70ZM312 35V22H376V35H312Z" fill="currentColor" />
    <path d="M1000 22V0H891.7H870V22.2V70.2V92H891.7H1000V70H892V22H1000Z" fill="#00B0E7" />
    <path d="M644 0H621.7H580V22H622V92H644V22.2V0Z" fill="currentColor" />
    <path d="M644 0V22.2V92H666V22H710V0H665.7H644Z" fill="#00B0E7" />
    <path d="M725 0V22.2V35.2V57.2V70.2V92H746.7H855V70H747V57H833V35H747V22H855V0H746.7H725Z" fill="#00B0E7" />
  </svg>
);

const Clock = () => {
  const [t, setT] = useState('');
  useEffect(() => {
    const tick = () => setT(new Date().toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="clock mono">{t}</span>;
};

export default function TopBar({ source, property }: { source: string; property: string }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [tv, setTv] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem('rbt-theme') as 'dark' | 'light') || 'dark';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('rbt-theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const enterTv = useCallback(() => {
    document.documentElement.requestFullscreen?.().catch(() => {});
    document.body.classList.add('tv');
    setTv(true);
  }, []);

  useEffect(() => {
    const onFs = () => {
      if (!document.fullscreenElement) { document.body.classList.remove('tv'); setTv(false); }
    };
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  // En modo TV refresca la pagina cada 3 min para traer la data agregada actualizada
  useEffect(() => {
    if (!tv) return;
    const id = setInterval(() => window.location.reload(), 180000);
    return () => clearInterval(id);
  }, [tv]);

  return (
    <header className="top">
      <div className="brand"><LogoRobotec /><small>Panel de ventas</small></div>
      <div className="top-right">
        {source === 'mock' && <span className="flag">DATOS DE EJEMPLO</span>}
        <Clock />
        <button className="ctrl" onClick={toggleTheme} title="Tema claro/oscuro" aria-label="tema">{theme === 'dark' ? '☀' : '☾'}</button>
        <button className="ctrl" onClick={enterTv} title="Modo TV (pantalla completa)" aria-label="modo tv">TV</button>
        <span className="muted mono prop">{property}</span>
      </div>
    </header>
  );
}
