'use client';

import { useState } from 'react';
import { Card, CardBody, Button, Input, P, Hr } from './ui';
import styled from 'styled-components';
import { useTranslations } from 'next-intl';

const Timeline = styled.div`
  display: grid;
  gap: 12px;
  margin-top: 14px;
`;

const Item = styled.div`
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 12px;
  background: rgba(255,255,255,0.02);
`;

export default function TrackingForm({ locale }: { locale: string }) {
  const t = useTranslations();
  const [vin, setVin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<any[] | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setEvents(null);

    try {
      const res = await fetch(`/api/tracking?vin=${encodeURIComponent(vin.trim().toUpperCase())}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Request failed');

      setEvents(data.events || []);
      if (!data.events?.length) {
        setError(t('tracking.notFound'));
      }
    } catch (err: any) {
      setError(err?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardBody>
        <h2 style={{ margin: 0 }}>{t('tracking.title')}</h2>
        <P style={{ marginTop: 8 }}>{t('tracking.subtitle')}</P>

        <div style={{ height: 12 }} />
        <form onSubmit={submit} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Input value={vin} onChange={(e) => setVin(e.target.value)} placeholder="VIN (17 chars)" style={{ flex: '1 1 280px' }} />
          <Button $variant="primary" disabled={loading}>{loading ? t('tracking.loading') : t('tracking.search')}</Button>
        </form>

        {error ? <P style={{ marginTop: 12, color: '#ffb4a2' }}>{error}</P> : null}

        {events && events.length ? (
          <>
            <Hr />
            <Timeline>
              {events.map((ev, i) => (
                <Item key={i}>
                  <div style={{ fontWeight: 900 }}>{ev.status}</div>
                  <div style={{ color: 'var(--muted)', marginTop: 6 }}>{ev.checkpoint} · {new Date(ev.date).toLocaleString()}</div>
                  {ev.notes ? <div style={{ marginTop: 8, color: 'var(--muted)' }}>{ev.notes}</div> : null}
                </Item>
              ))}
            </Timeline>
          </>
        ) : null}
      </CardBody>
    </Card>
  );
}
