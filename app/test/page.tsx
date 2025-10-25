'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestPage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error(error);
    setNotes(data || []);
    setLoading(false);
  }

  async function addNote() {
    if (!text.trim()) return;
    const { error } = await supabase.from('notes').insert({ content: text.trim() });
    if (error) return alert(error.message);
    setText('');
    load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>Supabase Test</h1>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a note"
          style={{ padding: 8, flex: 1 }}
        />
        <button onClick={addNote}>Add</button>
      </div>
      {loading && <p>Loading...</p>}
      <ul style={{ marginTop: 16 }}>
        {notes.map((n) => (
          <li key={n.id}>
            {n.content} — {new Date(n.created_at).toLocaleString()}
          </li>
        ))}
      </ul>
    </main>
  );
}
