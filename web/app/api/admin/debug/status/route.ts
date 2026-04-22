import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const isAdmin = !!req.cookies.get('admin_session')?.value
  return NextResponse.json({ isAdmin })
}
