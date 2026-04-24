import { NextRequest, NextResponse } from 'next/server'

const API = process.env.BACKEND_URL ?? 'http://localhost:3001'
const ADMIN_TOKEN = process.env.ADMIN_TOKEN ?? 'darija-admin-dev-2026'

function requireAuth(req: NextRequest) {
  return !!req.cookies.get('admin_session')?.value
}

type Params = { params: Promise<{ id: string; position: string }> }

export async function GET(req: NextRequest, ctx: Params) {
  if (!requireAuth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  const { id, position } = await ctx.params
  const r = await fetch(
    `${API}/admin/modules/${encodeURIComponent(id)}/revisions/${encodeURIComponent(position)}`,
    { headers: { 'X-Admin-Token': ADMIN_TOKEN }, cache: 'no-store' },
  )
  return NextResponse.json(await r.json().catch(() => ({})), { status: r.status })
}

export async function PUT(req: NextRequest, ctx: Params) {
  if (!requireAuth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  const { id, position } = await ctx.params
  const body = await req.json().catch(() => ({}))
  const r = await fetch(
    `${API}/admin/modules/${encodeURIComponent(id)}/revisions/${encodeURIComponent(position)}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Token': ADMIN_TOKEN },
      body: JSON.stringify(body),
    },
  )
  return NextResponse.json(await r.json().catch(() => ({})), { status: r.status })
}

export async function DELETE(req: NextRequest, ctx: Params) {
  if (!requireAuth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  const { id, position } = await ctx.params
  const r = await fetch(
    `${API}/admin/modules/${encodeURIComponent(id)}/revisions/${encodeURIComponent(position)}`,
    { method: 'DELETE', headers: { 'X-Admin-Token': ADMIN_TOKEN } },
  )
  return NextResponse.json(await r.json().catch(() => ({})), { status: r.status })
}
