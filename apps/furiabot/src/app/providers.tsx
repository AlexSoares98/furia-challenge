'use client';

import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const [client] = useState(() =>
    createPagesBrowserClient() as SupabaseClient
  );

  return (
    <SessionContextProvider supabaseClient={client}>
      {children}
    </SessionContextProvider>
  );
}
