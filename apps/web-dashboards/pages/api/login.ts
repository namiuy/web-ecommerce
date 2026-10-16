import type { NextApiRequest, NextApiResponse } from 'next';

const PASS = process.env.DASH_PASSWORD || '';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { password } = (req.body || {}) as { password?: string };
  if (!PASS || password !== PASS) return res.status(401).json({ ok: false });
  // cookie opaca httpOnly = el propio secreto; no legible por JS del cliente
  res.setHeader('Set-Cookie', `dash_auth=${encodeURIComponent(PASS)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`);
  res.status(200).json({ ok: true });
}
