import { NextRequest, NextResponse } from 'next/server'

const API = process.env.BACKEND_URL ?? 'http://localhost:3001'
const ADMIN_TOKEN = process.env.ADMIN_TOKEN ?? 'darija-admin-dev-2026'

function requireAuth(req: NextRequest) {
  return !!req.cookies.get('admin_session')?.value
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  if (!requireAuth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  const r = await fetch(`${API}/lessons/${params.id}`, { cache: 'no-store' })
  return NextResponse.json(await r.json(), { status: r.status })
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!requireAuth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  const body = await req.json().catch(() => ({}))
  const r = await fetch(`${API}/lessons/${params.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'X-Admin-Token': ADMIN_TOKEN },
    body: JSON.stringify(body),
  })
  return NextResponse.json(await r.json().catch(() => ({})), { status: r.status })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!requireAuth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  const hard = req.nextUrl.searchParams.get('hard') === 'true'
  const r = await fetch(`${API}/lessons/${params.id}${hard ? '?hard=true' : ''}`, {
    method: 'DELETE',
    headers: { 'X-Admin-Token': ADMIN_TOKEN },
  })
  return NextResponse.json(await r.json().catch(() => ({})), { status: r.status })
}
