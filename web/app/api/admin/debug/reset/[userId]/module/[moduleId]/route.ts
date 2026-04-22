import { NextRequest, NextResponse } from 'next/server'

const API = process.env.BACKEND_URL ?? 'http://localhost:3001'
const ADMIN_TOKEN = process.env.ADMIN_TOKEN ?? 'darija-admin-dev-2026'

function requireAuth(req: NextRequest) {
  return !!req.cookies.get('admin_session')?.value
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ userId: string; moduleId: string }> }) {
  if (!requireAuth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  const { userId, moduleId } = await ctx.params
  const r = await fetch(
    `${API}/admin/debug/reset-user/${encodeURIComponent(userId)}/module/${encodeURIComponent(moduleId)}`,
    { method: 'POST', headers: { 'X-Admin-Token': ADMIN_TOKEN } },
  )
  return NextResponse.json(await r.json().catch(() => ({})), { status: r.status })
}
