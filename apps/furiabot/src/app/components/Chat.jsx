'use client';
import useFaq from '../hooks/useFaq';
import { useState } from 'react';

export default function Chat() {
  const faq = useFaq();
  const [msg, setMsg] = useState('');
  const [history, setHistory] = useState([]);

  function handleSend() {
    const found = faq.find(f => f.question.toLowerCase() === msg.toLowerCase());
    const answer = found ? found.answer : 'Ainda não sei 😅';
    setHistory([...history, { q: msg, a: answer }]);
    setMsg('');
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="h-64 overflow-y-auto border rounded-lg p-2 mb-2">
        {history.map((h, i) => (
          <div key={i} className="mb-2">
            <p className="font-semibold">{h.q}</p>
            <p>{h.a}</p>
          </div>
        ))}
      </div>
      <input
        className="border w-full p-2 rounded mb-2"
        value={msg}
        onChange={e => setMsg(e.target.value)}
        placeholder="Pergunte algo sobre a FURIA…"
      />
      <button
        onClick={handleSend}
        className="bg-purple-700 text-white px-4 py-2 rounded w-full"
      >
        Enviar
      </button>
    </div>
  );
}
