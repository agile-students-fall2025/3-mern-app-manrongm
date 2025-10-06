import React, { useEffect, useState } from 'react';

const API = process.env.REACT_APP_API_BASE_URL;

export default function About() {
  const [data, setData] = useState(null);
  const [state, setState] = useState({ loading: true, error: null });

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch(`http://localhost:5002/api/About`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!ignore) {
          setData(json);
          setState({ loading: false, error: null });
        }
      } catch (e) {
        if (!ignore) setState({ loading: false, error: e.message || 'Error' });
      }
    }
    load();
    return () => { ignore = true; };
  }, []);

  if (state.loading) return <main style={{ padding: 24 }}>Loading…</main>;
  if (state.error)   return <main style={{ padding: 24, color: 'crimson' }}>Error: {state.error}</main>;

  return (
    <main style={{ maxWidth: 900, margin: '40px auto', padding: '0 16px', lineHeight: 1.6 }}>
      <h1>About Us</h1>
      {data?.photoUrl && (
        <img
          src={data.photoUrl}
          alt={data?.name || 'About photo'}
          style={{ width: 220, height: 220, objectFit: 'cover', borderRadius: '50%', margin: '16px 0' }}
        />
      )}
      {data?.name && <h2 style={{ marginTop: 8 }}>{data.name}</h2>}
      {Array.isArray(data?.paragraphs) &&
        data.paragraphs.map((p, i) => <p key={i} style={{ marginTop: 12 }}>{p}</p>)}
      {data?.updatedAt && (
        <p style={{ fontSize: 12, color: '#666', marginTop: 24 }}>
          Last updated: {new Date(data.updatedAt).toLocaleString()}
        </p>
      )}
    </main>
  );
}
