import { NextRequest, NextResponse } from 'next/server';

const ADMIN_USER     = process.env.ADMIN_USER     ?? 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'darija2026';
const COOKIE_NAME    = 'admin_session';
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 heures

export async function POST(req: NextRequest) {
  const { username, password } = await req.json().catch(() => ({}));

  if (username !== ADMIN_USER || password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 });
  }

  const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
    secure: process.env.NODE_ENV === 'production',
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(COOKIE_NAME);
  return res;
}

