'use client';
import { supabase } from '@/app/lib/supabase';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (!error) setSent(true);
  }
  return (
    <main className="h-screen flex flex-col items-center justify-center">
      {sent ? (
        <p>Link mágico enviado! Confira seu e-mail.</p>
      ) : (
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input
            className="border p-2 rounded"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="bg-purple-700 text-white p-2 rounded">Entrar</button>
        </form>
      )}
    </main>
  );
}
