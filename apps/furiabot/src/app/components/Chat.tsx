'use client'; // precisa ser client component

import { useEffect, useState } from 'react';
import type { Session } from '@supabase/auth-helpers-nextjs';
import { supabase } from '@/app/lib/supabase';

interface Props {
  session: Session;
}

interface Msg {
  id?: string;
  text: string;
  role: 'user' | 'bot';
  created_at?: string;
}

export default function Chat({ session }: Props) {
  const [history, setHistory] = useState<Msg[]>([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/messages', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const data = (await res.json()) as Msg[];
      setHistory(data);
    })();
  }, [session.access_token]);

  async function send() {
    if (!msg.trim()) return;

    // grava pergunta
    await fetch('/api/messages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: msg, role: 'user' }),
    });

    // resposta (demo): consulta FAQ rápido
    const { data: faq } = await supabase
      .from('faq')
      .select('answer')
      .eq('question', msg)
      .single();

    const answer = faq?.answer ?? 'Ainda não sei 😅';

    // grava resposta
    await fetch('/api/messages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: answer, role: 'bot' }),
    });

    // atualiza UI local
    setHistory((h) => [
      ...h,
      { text: msg, role: 'user' },
      { text: answer, role: 'bot' },
    ]);
    setMsg('');
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="h-64 overflow-y-auto border rounded-lg p-2 mb-2 space-y-2">
        {history.map((m, i) => (
          <p key={i} className={m.role === 'user' ? 'font-semibold' : ''}>
            {m.role === 'user' ? 'Você: ' : 'Bot: '}
            {m.text}
          </p>
        ))}
      </div>

      <input
        className="border w-full p-2 rounded mb-2"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && send()}
        placeholder="Pergunte algo sobre a FURIA…"
      />

      <button
        onClick={send}
        className="bg-purple-700 text-white w-full py-2 rounded"
      >
        Enviar
      </button>

      <button
        className="text-sm text-purple-400 mt-2 underline"
        onClick={() => supabase.auth.signOut()}
      >
        Logout
      </button>
    </div>
  );
}