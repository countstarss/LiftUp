import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { SupabaseAuthProvider } from '@/providers/supabase-auth-provider'

export default async function SessionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // ✅ 正确使用 cookies()
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <SupabaseAuthProvider initialSession={session}>
      {children}
    </SupabaseAuthProvider>
  )
}