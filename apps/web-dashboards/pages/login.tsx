import { useState } from 'react';

export default function Login() {
  const [pass, setPass] = useState('');
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErr(false);
    try {
      const r = await fetch(`${base}/api/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pass }) });
      if (r.ok) { window.location.href = base || '/'; return; }
      setErr(true);
    } catch { setErr(true); }
    setLoading(false);
  };

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={submit}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 1000 92" fill="none" className="logo" style={{ color: 'var(--ink)', alignSelf: 'center' }}>
          <path d="M21.7 0H0V22.2V35.2V57.2V92H22V57H85.6L107.6 92H129.6L107.6 57H107.8H130V35.2V22.2V0H107.7H21.7ZM108 35H22V22H108V35Z" fill="currentColor" />
          <path d="M166.7 0H145V22.2V70.2V92H166.7H252.7H275V70.2V22.2V0H252.7H166.7ZM253 70H167V22H253V70Z" fill="currentColor" />
          <path d="M456.7 0H435V22.2V70.2V92H456.7H542.7H565V70.2V22.2V0H542.7H456.7ZM543 70H457V22H543V70Z" fill="currentColor" />
          <path d="M398 22.2V0H375.7H311.7H290V22.2V35.2V57.2V70.2V92H311.7H397.7H420V70.2V57.2V35H398V22.2ZM398 70H312V57H375.7H398V70ZM312 35V22H376V35H312Z" fill="currentColor" />
          <path d="M1000 22V0H891.7H870V22.2V70.2V92H891.7H1000V70H892V22H1000Z" fill="#00B0E7" />
          <path d="M644 0H621.7H580V22H622V92H644V22.2V0Z" fill="currentColor" />
          <path d="M644 0V22.2V92H666V22H710V0H665.7H644Z" fill="#00B0E7" />
          <path d="M725 0V22.2V35.2V57.2V70.2V92H746.7H855V70H747V57H833V35H747V22H855V0H746.7H725Z" fill="#00B0E7" />
        </svg>
        <h1>Panel de ventas</h1>
        <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Contrasena" autoFocus />
        {err && <p className="login-err">Contrasena incorrecta</p>}
        <button disabled={loading || !pass}>{loading ? '...' : 'Entrar'}</button>
      </form>
    </div>
  );
}
