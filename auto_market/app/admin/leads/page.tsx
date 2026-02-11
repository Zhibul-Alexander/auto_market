'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button, Card, CardBody, H2, Input, P, Hr } from '../../../components/ui';

type Lead = {
  id: number;
  type: string;
  name: string | null;
  phone: string;
  message: string | null;
  lotId: number | null;
  serviceSlug: string | null;
  locale: string;
  pageUrl: string;
  status: string;
  note: string | null;
  createdAt: string;
};

export default function AdminLeadsPage() {
  const [status, setStatus] = useState('all');
  const [q, setQ] = useState('');
  const [items, setItems] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [note, setNote] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  const query = useMemo(() => {
    const sp = new URLSearchParams();
    if (status !== 'all') sp.set('status', status);
    if (q.trim()) sp.set('q', q.trim());
    sp.set('page', '1');
    sp.set('pageSize', '50');
    return sp.toString();
  }, [status, q]);

  async function load() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/leads?${query}`);
      const data = await res.json();
      setItems(data.rows || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  async function updateStatus(id: number, next: string) {
    setMsg(null);
    const res = await fetch(`/api/admin/leads/${id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ status: next })
    });
    if (res.ok) {
      setItems((prev) => prev.map((l) => (l.id === id ? { ...l, status: next } : l)));
      if (selected?.id === id) setSelected({ ...(selected as Lead), status: next });
    } else {
      const data = await res.json().catch(() => ({}));
      setMsg(data?.error || 'Update failed');
    }
  }

  async function saveNote() {
    if (!selected) return;
    setMsg(null);
    const res = await fetch(`/api/admin/leads/${selected.id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ note })
    });
    if (res.ok) {
      setItems((prev) => prev.map((l) => (l.id === selected.id ? { ...l, note } : l)));
      setSelected({ ...selected, note });
      setMsg('Saved.');
    } else {
      const data = await res.json().catch(() => ({}));
      setMsg(data?.error || 'Save failed');
    }
  }

  async function remove(id: number) {
    if (!confirm('Delete lead?')) return;
    const res = await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setItems((prev) => prev.filter((l) => l.id !== id));
      if (selected?.id === id) setSelected(null);
    }
  }

  return (
    <div>
      <H2>Leads</H2>
      <P style={{ marginTop: 8 }}>Manage incoming leads: status, notes, delete.</P>
      <div style={{ height: 12 }} />

      <Card>
        <CardBody>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: 10, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface2)', color: 'var(--text)' }}>
              <option value="all">All</option>
              <option value="new">New</option>
              <option value="in_progress">In progress</option>
              <option value="done">Done</option>
            </select>
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by phone/name" style={{ flex: '1 1 220px' }} />
            <Button onClick={load} disabled={loading}>{loading ? 'Loading…' : 'Refresh'}</Button>
          </div>
        </CardBody>
      </Card>

      <div style={{ height: 14 }} />

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 14 }}>
        <Card>
          <CardBody>
            <div style={{ fontWeight: 900, marginBottom: 10 }}>List ({items.length})</div>
            <div style={{ display: 'grid', gap: 10 }}>
              {items.map((l) => (
                <button
                  key={l.id}
                  onClick={() => { setSelected(l); setNote(l.note || ''); }}
                  style={{
                    textAlign: 'left',
                    padding: 12,
                    borderRadius: 14,
                    border: '1px solid var(--border)',
                    background: selected?.id === l.id ? 'rgba(255,107,53,0.12)' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ fontWeight: 900 }}>{l.phone}</div>
                    <div style={{ color: 'var(--muted)', fontSize: 12 }}>{new Date(l.createdAt).toLocaleString()}</div>
                  </div>
                  <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 4 }}>
                    {l.type} · {l.status} · {l.locale}
                  </div>
                  {l.message ? <div style={{ marginTop: 6, color: 'var(--muted)', fontSize: 13 }}>{l.message.slice(0, 120)}</div> : null}
                </button>
              ))}
              {!items.length ? <P style={{ color: 'var(--muted)' }}>No leads yet.</P> : null}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div style={{ fontWeight: 900, marginBottom: 10 }}>Details</div>
            {selected ? (
              <>
                <P><b>Phone:</b> {selected.phone}</P>
                <P><b>Name:</b> {selected.name || '—'}</P>
                <P><b>Status:</b> {selected.status}</P>
                <P><b>Page:</b> {selected.pageUrl}</P>
                {selected.lotId ? <P><b>LotId:</b> {selected.lotId}</P> : null}
                {selected.serviceSlug ? <P><b>Service:</b> {selected.serviceSlug}</P> : null}

                <Hr />

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <Button onClick={() => updateStatus(selected.id, 'new')}>New</Button>
                  <Button onClick={() => updateStatus(selected.id, 'in_progress')}>In progress</Button>
                  <Button onClick={() => updateStatus(selected.id, 'done')}>Done</Button>
                  <Button onClick={() => remove(selected.id)} style={{ borderColor: 'rgba(255,180,162,0.45)' }}>Delete</Button>
                </div>

                <div style={{ height: 12 }} />
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Internal note"
                  style={{ width: '100%', minHeight: 120, padding: 12, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface2)', color: 'var(--text)' }}
                />
                <div style={{ height: 10 }} />
                <Button $variant="primary" onClick={saveNote}>Save note</Button>

                {msg ? <P style={{ marginTop: 10, color: msg === 'Saved.' ? '#8be28b' : '#ffb4a2' }}>{msg}</P> : null}
              </>
            ) : (
              <P style={{ color: 'var(--muted)' }}>Select a lead from the list.</P>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
