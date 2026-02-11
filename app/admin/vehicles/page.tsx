'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button, Card, CardBody, H2, Input, P } from '../../../components/ui';

type Item = {
  id: number;
  slug: string;
  externalId: string;
  year: number;
  make: string;
  model: string;
  displayedPrice: number | null;
  updatedAt: string;
};

export default function AdminVehiclesPage() {
  const [q, setQ] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  const query = useMemo(() => {
    const sp = new URLSearchParams();
    sp.set('category', 'cars');
    sp.set('page', '1');
    sp.set('pageSize', '30');
    if (q.trim()) sp.set('q', q.trim());
    return sp.toString();
  }, [q]);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/vehicles?${query}`);
      const data = await res.json();
      setItems(data.items || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div>
      <H2>Vehicles</H2>
      <P style={{ marginTop: 8 }}>Quick lookup using the public listing API.</P>
      <div style={{ height: 12 }} />
      <Card>
        <CardBody>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search make/model/lot id" style={{ flex: '1 1 260px' }} />
            <Button onClick={load} disabled={loading}>{loading ? 'Loading…' : 'Refresh'}</Button>
          </div>
          <div style={{ height: 12 }} />
          <div style={{ display: 'grid', gap: 8 }}>
            {items.map((it) => (
              <div key={it.id} style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 12, background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{ fontWeight: 900 }}>{it.year} {it.make} {it.model}</div>
                  <div style={{ color: 'var(--muted)', fontSize: 12 }}>{new Date(it.updatedAt).toLocaleString()}</div>
                </div>
                <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 6 }}>
                  lot #{it.externalId} · slug: {it.slug} · price: {it.displayedPrice ?? '—'}
                </div>
              </div>
            ))}
            {!items.length ? <P style={{ color: 'var(--muted)' }}>No results.</P> : null}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
