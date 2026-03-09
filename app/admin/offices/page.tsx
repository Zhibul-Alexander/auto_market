'use client';

import { useEffect, useState } from 'react';
import { Button, Card, CardBody, H2, Input, P, Hr } from '../../../components/ui';

type Office = {
  id: number;
  city: string;
  phone: string;
  address: string | null;
  sortOrder: number;
};

export default function AdminOfficesPage() {
  const [items, setItems] = useState<Office[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [sortOrder, setSortOrder] = useState('0');

  const [editId, setEditId] = useState<number | null>(null);
  const [editCity, setEditCity] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editSort, setEditSort] = useState('0');

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/offices');
      const data = await res.json();
      setItems(data.rows || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function add() {
    if (!city.trim() || !phone.trim()) { setMsg('City and phone required'); return; }
    setMsg(null);
    const res = await fetch('/api/admin/offices', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ city, phone, address, sortOrder: Number(sortOrder) || 0 })
    });
    if (res.ok) {
      setCity(''); setPhone(''); setAddress(''); setSortOrder('0');
      setMsg('Added');
      load();
    } else {
      const d = await res.json().catch(() => ({}));
      setMsg(d?.error || 'Failed');
    }
  }

  async function save() {
    if (editId === null) return;
    setMsg(null);
    const res = await fetch(`/api/admin/offices/${editId}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ city: editCity, phone: editPhone, address: editAddress, sortOrder: Number(editSort) || 0 })
    });
    if (res.ok) {
      setEditId(null);
      setMsg('Saved');
      load();
    } else {
      const d = await res.json().catch(() => ({}));
      setMsg(d?.error || 'Failed');
    }
  }

  async function remove(id: number) {
    if (!confirm('Delete office?')) return;
    const res = await fetch(`/api/admin/offices/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setItems((prev) => prev.filter((o) => o.id !== id));
      if (editId === id) setEditId(null);
    }
  }

  function startEdit(o: Office) {
    setEditId(o.id);
    setEditCity(o.city);
    setEditPhone(o.phone);
    setEditAddress(o.address || '');
    setEditSort(String(o.sortOrder));
  }

  return (
    <div>
      <H2>Offices</H2>
      <P style={{ marginTop: 8 }}>Manage office locations displayed on the contacts page.</P>
      <div style={{ height: 14 }} />

      <Card>
        <CardBody>
          <div style={{ fontWeight: 900, marginBottom: 10 }}>Add new office</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 10, alignItems: 'end' }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--muted)' }}>City</label>
              <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Tbilisi" />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--muted)' }}>Phone</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+995 ..." />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--muted)' }}>Address</label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Optional" />
            </div>
            <Button $variant="primary" onClick={add}>Add</Button>
          </div>
          <div style={{ marginTop: 6 }}>
            <label style={{ fontSize: 12, color: 'var(--muted)' }}>Sort order</label>
            <Input value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={{ width: 80 }} />
          </div>
          {msg ? <P style={{ marginTop: 10, color: msg === 'Added' || msg === 'Saved' ? '#8be28b' : '#ffb4a2' }}>{msg}</P> : null}
        </CardBody>
      </Card>

      <div style={{ height: 14 }} />

      <Card>
        <CardBody>
          <div style={{ fontWeight: 900, marginBottom: 10 }}>
            Offices ({items.length}) {loading && '...'}
          </div>
          {items.map((o) => (
            <div key={o.id}>
              {editId === o.id ? (
                <div style={{ padding: 12, border: '1px solid var(--accent)', borderRadius: 14, marginBottom: 10, background: 'rgba(255,107,53,0.06)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 80px', gap: 10 }}>
                    <Input value={editCity} onChange={(e) => setEditCity(e.target.value)} />
                    <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} />
                    <Input value={editAddress} onChange={(e) => setEditAddress(e.target.value)} />
                    <Input value={editSort} onChange={(e) => setEditSort(e.target.value)} />
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <Button $variant="primary" onClick={save}>Save</Button>
                    <Button onClick={() => setEditId(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: 12, borderRadius: 14, border: '1px solid var(--border)',
                  marginBottom: 10, background: 'rgba(255,255,255,0.02)'
                }}>
                  <div>
                    <div style={{ fontWeight: 900 }}>{o.city}</div>
                    <div style={{ color: 'var(--muted)', fontSize: 13 }}>{o.phone}{o.address ? ` · ${o.address}` : ''}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button onClick={() => startEdit(o)}>Edit</Button>
                    <Button onClick={() => remove(o.id)} style={{ borderColor: 'rgba(255,180,162,0.45)' }}>Del</Button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {!items.length && !loading ? <P style={{ color: 'var(--muted)' }}>No offices yet.</P> : null}
        </CardBody>
      </Card>
    </div>
  );
}
