import { NextRequest, NextResponse } from 'next/server'

const API = process.env.BACKEND_URL ?? 'http://localhost:3001'
const ADMIN_TOKEN = process.env.ADMIN_TOKEN ?? 'darija-admin-dev-2026'

function requireAuth(req: NextRequest) {
  return !!req.cookies.get('admin_session')?.value
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!requireAuth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  const { id } = await ctx.params
  const r = await fetch(`${API}/admin/modules/${encodeURIComponent(id)}/revisions`, {
    headers: { 'X-Admin-Token': ADMIN_TOKEN },
    cache: 'no-store',
  })
  return NextResponse.json(await r.json().catch(() => ({})), { status: r.status })
}
