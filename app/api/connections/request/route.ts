import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-client'
import { sendConnectionRequest } from '@/lib/connections'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { toProfileId, message } = body

    const authHeader = req.headers.get('authorization') || ''
    const token = authHeader.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = createClient()
    const { data: userData, error: userErr } = await supabase.auth.getUser(token)
    if (userErr || !userData?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const fromProfile = userData.user.id

    await sendConnectionRequest(fromProfile, toProfileId, message)

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
