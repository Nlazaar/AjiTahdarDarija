import { NextRequest, NextResponse } from 'next/server'

const API = process.env.BACKEND_URL ?? 'http://localhost:3001'
const ADMIN_TOKEN = process.env.ADMIN_TOKEN ?? 'darija-admin-dev-2026'

function requireAuth(req: NextRequest) {
  return !!req.cookies.get('admin_session')?.value
}

/** Proxy multipart upload : on rebascule le FormData tel quel vers le backend NestJS */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  if (!requireAuth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const incoming = await req.formData()
  const fwd = new FormData()
  for (const [k, v] of incoming.entries()) fwd.append(k, v as any)

  const r = await fetch(`${API}/vocabulary/${params.id}/audio`, {
    method: 'POST',
    headers: { 'X-Admin-Token': ADMIN_TOKEN },
    body: fwd,
  })
  return NextResponse.json(await r.json().catch(() => ({})), { status: r.status })
}
