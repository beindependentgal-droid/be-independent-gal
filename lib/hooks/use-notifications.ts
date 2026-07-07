import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'

export function useNotifications() {
  const [notifications, setNotifications] = useState<Record<string, unknown>[]>([])
  const [unreadCount, setUnreadCount] = useState<number>(0)

  useEffect(() => {
    const supabase = createClient()

    let mounted = true

    const load = async () => {
      const { data } = await supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(50)
      if (!mounted) return
      const list = (data || []) as Record<string, unknown>[]
      setNotifications(list)
      setUnreadCount(list.filter((n) => !(n.read as boolean)).length)
    }
    void load()

    const channel = supabase.channel('notifications')
    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, (payload: unknown) => {
      const ev = payload as Record<string, unknown>
      const eventType = ev.eventType as string | undefined
      const newRow = ev.new as Record<string, unknown> | undefined
      if (eventType === 'INSERT' && newRow) {
        setNotifications((prev) => [newRow, ...prev].slice(0, 50))
        setUnreadCount((c) => c + 1)
      } else if (eventType === 'UPDATE' && newRow) {
        setNotifications((prev) => prev.map((n) => ((n.id as string) === (newRow.id as string) ? newRow : n)))
        setUnreadCount((prev) => ((newRow.read as boolean) ? Math.max(0, prev - 1) : prev))
      }
    })
    channel.subscribe()

    return () => {
      mounted = false
      void supabase.removeChannel(channel)
    }
  }, [])

  return { notifications, unreadCount }
}
