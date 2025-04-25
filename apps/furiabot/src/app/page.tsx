import Chat from '@/app/components/Chat';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export default async function Home() {
  const supabase = createServerComponentClient({ cookies }); // só cookies

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect('/login');

  return <Chat session={session} />;
}
