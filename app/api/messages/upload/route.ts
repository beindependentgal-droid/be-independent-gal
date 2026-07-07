import { NextRequest } from 'next/server'
import { requireAuth, supabase } from '@/lib/api-utils'

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request)
  if (!('userId' in auth)) return auth
  const userId = auth.userId

  const body = await request.json()
  const { fileName, base64, mime } = body
  if (!fileName || !base64) return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 })

  const buffer = Buffer.from(base64, 'base64')
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'messages'
  const path = `${userId}/${Date.now()}_${fileName}`

  const { data, error } = await supabase.storage.from(bucket).upload(path, buffer, { contentType: mime })
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })

  const publicUrl = supabase.storage.from(bucket).getPublicUrl(data.path).publicUrl
  return new Response(JSON.stringify({ url: publicUrl, path: data.path }), { status: 200 })
}
