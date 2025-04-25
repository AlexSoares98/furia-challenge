import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';

export interface FaqItem {            // 👈  tipo público
  question: string;
  answer: string;
}

export default function useFaq() {
  const [faq, setFaq] = useState<FaqItem[]>([]);   // 👈  usa o tipo

  useEffect(() => {
    supabase
      .from('faq')
      .select('question,answer')
      .then(({ data }) => {
        if (data) setFaq(data as FaqItem[]);
      });
  }, []);

  return faq;
}
