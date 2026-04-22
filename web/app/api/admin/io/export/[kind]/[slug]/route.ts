import { NextRequest, NextResponse } from 'next/server'

const API = process.env.BACKEND_URL ?? 'http://localhost:3001'
const ADMIN_TOKEN = process.env.ADMIN_TOKEN ?? 'darija-admin-dev-2026'

const ALLOWED = new Set(['section', 'lessons', 'vocabulary', 'exercises'])

function requireAuth(req: NextRequest) {
  return !!req.cookies.get('admin_session')?.value
}

export async function GET(
  req: NextRequest,
  { params }: { params: { kind: string; slug: string } },
) {
  if (!requireAuth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  if (!ALLOWED.has(params.kind)) {
    return NextResponse.json({ error: `kind invalide : ${params.kind}` }, { status: 400 })
  }
  const r = await fetch(`${API}/io/export/${params.kind}/${encodeURIComponent(params.slug)}`, {
    headers: { 'X-Admin-Token': ADMIN_TOKEN },
  })
  const json = await r.json().catch(() => ({}))
  return NextResponse.json(json, { status: r.status })
}
