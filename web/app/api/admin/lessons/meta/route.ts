import { NextRequest, NextResponse } from 'next/server'

const API = process.env.BACKEND_URL ?? 'http://localhost:3001'

function requireAuth(req: NextRequest) {
  return !!req.cookies.get('admin_session')?.value
}

export async function GET(req: NextRequest) {
  if (!requireAuth(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  const [langs, mods] = await Promise.all([
    fetch(`${API}/lessons/meta/languages`, { cache: 'no-store' }).then(r => r.json()).catch(() => []),
    fetch(`${API}/lessons/meta/modules`, { cache: 'no-store' }).then(r => r.json()).catch(() => []),
  ])
  return NextResponse.json({ languages: langs, modules: mods })
}
