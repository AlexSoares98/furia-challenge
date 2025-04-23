import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function useFaq() {
  const [faq, setFaq] = useState([]);

  useEffect(() => {
    supabase.from('faq')
      .select('question,answer')
      .then(({ data }) => setFaq(data));
  }, []);

  return faq;
}
