import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-client'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const otherId = url.searchParams.get('otherId')
    if (!otherId) return NextResponse.json({ error: 'missing otherId' }, { status: 400 })

    const authHeader = req.headers.get('authorization') || ''
    const token = authHeader.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabase = createClient()
    const { data: userData, error: userErr } = await supabase.auth.getUser(token)
    if (userErr || !userData?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = userData.user.id

    // check connections
    const { data: conn } = await supabase
      .from('connections')
      .select('*')
      .or(`and(requester.eq.${userId},recipient.eq.${otherId}),and(requester.eq.${otherId},recipient.eq.${userId})`)
      .maybeSingle();

    if (conn) {
      return NextResponse.json({ status: conn.status, connection: conn })
    }

    // check for pending request
    const { data: reqSent } = await supabase.from('connection_requests').select('*').eq('from_profile', userId).eq('to_profile', otherId).maybeSingle();
    if (reqSent) return NextResponse.json({ status: 'request_sent', request: reqSent })

    const { data: reqReceived } = await supabase.from('connection_requests').select('*').eq('from_profile', otherId).eq('to_profile', userId).maybeSingle();
    if (reqReceived) return NextResponse.json({ status: 'request_received', request: reqReceived })

    return NextResponse.json({ status: 'not_connected' })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
