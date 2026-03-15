'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button, Card, CardBody, H2, Input, P, Hr } from '../../../components/ui';
import { useAdminI18n } from '../../../lib/admin-i18n';

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

const STATUS_STYLES: Record<string, { bg: string; border: string; color: string; label: string }> = {
  new:         { bg: '#EFF6FF', border: '#BFDBFE', color: '#1D4ED8', label: '🔵' },
  in_progress: { bg: '#FFFBEB', border: '#FDE68A', color: '#B45309', label: '🟡' },
  done:        { bg: '#F0FDF4', border: '#BBF7D0', color: '#15803D', label: '🟢' },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] || { bg: '#F3F4F6', border: '#E5E7EB', color: '#6B7280', label: '⚪' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 10px', borderRadius: 20,
      background: s.bg, border: `1px solid ${s.border}`, color: s.color,
      fontSize: 12, fontWeight: 700
    }}>
      {s.label} {status}
    </span>
  );
}

export default function AdminLeadsPage() {
  const { t } = useAdminI18n();
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
      const data = await res.json() as { rows?: Lead[] };
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
      const data = await res.json().catch(() => ({} as { error?: string })) as { error?: string };
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
      setMsg(t('leads.saved'));
    } else {
      const data = await res.json().catch(() => ({} as { error?: string })) as { error?: string };
      setMsg(data?.error || 'Save failed');
    }
  }

  async function remove(id: number) {
    if (!confirm(t('leads.confirmDelete'))) return;
    const res = await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setItems((prev) => prev.filter((l) => l.id !== id));
      if (selected?.id === id) setSelected(null);
    }
  }

  return (
    <div>
      <H2>{t('leads.title')}</H2>
      <P style={{ marginTop: 8 }}>{t('leads.desc')}</P>
      <div style={{ height: 12 }} />

      <Card>
        <CardBody>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: 10, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface2)', color: 'var(--text)' }}>
              <option value="all">{t('leads.all')}</option>
              <option value="new">{t('leads.new')}</option>
              <option value="in_progress">{t('leads.inProgress')}</option>
              <option value="done">{t('leads.done')}</option>
            </select>
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('leads.searchPlaceholder')} style={{ flex: '1 1 220px' }} />
            <Button onClick={load} disabled={loading}>{loading ? t('leads.loading') : t('leads.refresh')}</Button>
          </div>
        </CardBody>
      </Card>

      <div style={{ height: 14 }} />

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 14 }}>
        <Card>
          <CardBody>
            <div style={{ fontWeight: 900, marginBottom: 10 }}>{t('leads.list')} ({items.length})</div>
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
                    background: selected?.id === l.id ? 'rgba(255,107,53,0.08)' : (STATUS_STYLES[l.status]?.bg || '#F8FAFC'),
                  borderColor: selected?.id === l.id ? 'var(--border)' : (STATUS_STYLES[l.status]?.border || 'var(--border)'),
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ fontWeight: 900 }}>{l.phone}</div>
                    <div style={{ color: 'var(--muted)', fontSize: 12 }}>{new Date(l.createdAt).toLocaleString()}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <StatusBadge status={l.status} />
                    <span style={{ color: 'var(--muted)', fontSize: 12 }}>{l.type} · {l.locale}</span>
                  </div>
                  {l.message ? <div style={{ marginTop: 6, color: 'var(--muted)', fontSize: 13 }}>{l.message.slice(0, 120)}</div> : null}
                </button>
              ))}
              {!items.length ? <P style={{ color: 'var(--muted)' }}>{t('leads.noLeads')}</P> : null}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div style={{ fontWeight: 900, marginBottom: 10 }}>{t('leads.details')}</div>
            {selected ? (
              <>
                <P><b>{t('leads.phone')}:</b> {selected.phone}</P>
                <P><b>{t('leads.name')}:</b> {selected.name || '—'}</P>
                <P><b>{t('leads.status')}:</b> <StatusBadge status={selected.status} /></P>
                <P><b>{t('leads.page')}:</b> <a href={selected.pageUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', wordBreak: 'break-all' }}>{selected.pageUrl}</a></P>
                {selected.lotId ? <P><b>LotId:</b> {selected.lotId}</P> : null}
                {selected.serviceSlug ? <P><b>Service:</b> {selected.serviceSlug}</P> : null}

                <Hr />

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <Button onClick={() => updateStatus(selected.id, 'new')} style={{ background: STATUS_STYLES.new.bg, borderColor: STATUS_STYLES.new.border, color: STATUS_STYLES.new.color }}>{t('leads.new')}</Button>
                  <Button onClick={() => updateStatus(selected.id, 'in_progress')} style={{ background: STATUS_STYLES.in_progress.bg, borderColor: STATUS_STYLES.in_progress.border, color: STATUS_STYLES.in_progress.color }}>{t('leads.inProgress')}</Button>
                  <Button onClick={() => updateStatus(selected.id, 'done')} style={{ background: STATUS_STYLES.done.bg, borderColor: STATUS_STYLES.done.border, color: STATUS_STYLES.done.color }}>{t('leads.done')}</Button>
                  <Button onClick={() => remove(selected.id)} style={{ borderColor: '#FCA5A5', color: '#DC2626' }}>{t('leads.delete')}</Button>
                </div>

                <div style={{ height: 12 }} />
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={t('leads.notePlaceholder')}
                  style={{ width: '100%', minHeight: 120, padding: 12, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface2)', color: 'var(--text)' }}
                />
                <div style={{ height: 10 }} />
                <Button $variant="primary" onClick={saveNote}>{t('leads.saveNote')}</Button>

                {msg ? <P style={{ marginTop: 10, color: msg === t('leads.saved') ? '#16A34A' : '#DC2626' }}>{msg}</P> : null}
              </>
            ) : (
              <P style={{ color: 'var(--muted)' }}>{t('leads.selectLead')}</P>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
