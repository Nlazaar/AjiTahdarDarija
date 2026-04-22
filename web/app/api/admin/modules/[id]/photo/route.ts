import { NextRequest, NextResponse } from 'next/server'

const API = process.env.BACKEND_URL ?? 'http://localhost:3001'
const ADMIN_TOKEN = process.env.ADMIN_TOKEN ?? 'darija-admin-dev-2026'

function requireAuth(req: NextRequest) {
  return !!req.cookies.get('admin_session')?.value
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  if (!requireAuth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const form = await req.formData()
  const file = form.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'file manquant' }, { status: 400 })
  }

  const kind = req.nextUrl.searchParams.get('kind') === 'postcard' ? 'postcard' : 'section'

  const upstream = new FormData()
  upstream.append('file', file, file.name)

  const r = await fetch(`${API}/modules/${params.id}/photo?kind=${kind}`, {
    method: 'POST',
    headers: { 'X-Admin-Token': ADMIN_TOKEN },
    body: upstream,
  })
  return NextResponse.json(await r.json().catch(() => ({})), { status: r.status })
}
