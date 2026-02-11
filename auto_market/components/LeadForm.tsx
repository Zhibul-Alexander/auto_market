'use client';

import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Button, Input, Textarea, Card, CardBody, P } from './ui';
import { useTranslations } from 'next-intl';

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  display: grid;
  gap: 8px;
  font-size: 13px;
  color: var(--muted);
`;

const Check = styled.label`
  display: flex;
  gap: 10px;
  align-items: flex-start;
  color: var(--muted);
  font-size: 13px;
`;

const Error = styled.div`
  color: #ffb4a2;
  font-size: 13px;
`;

export default function LeadForm(props: {
  type: 'general' | 'lot' | 'service' | 'contact';
  locale: string;
  pageUrl: string;
  lotId?: number | null;
  serviceSlug?: string | null;
  title?: string;
}) {
  const t = useTranslations();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const payload = useMemo(
    () => ({
      type: props.type,
      name: name || null,
      phone,
      message: message || null,
      consent: consent as true,
      lotId: props.lotId ?? null,
      serviceSlug: props.serviceSlug ?? null,
      locale: props.locale,
      pageUrl: props.pageUrl
    }),
    [name, phone, message, consent, props.type, props.lotId, props.serviceSlug, props.locale, props.pageUrl]
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(false);

    if (!phone.trim()) {
      setError(t('lead.errors.phone'));
      return;
    }
    if (!consent) {
      setError(t('lead.errors.consent'));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Request failed');
      setOk(true);
      setName('');
      setPhone('');
      setMessage('');
      setConsent(false);
    } catch (err: any) {
      setError(err?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardBody>
        {props.title ? <h3 style={{ margin: 0, fontSize: 18 }}>{props.title}</h3> : null}
        <div style={{ height: 10 }} />
        <form onSubmit={submit}>
          <Row>
            <Label>
              {t('common.name')}
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('lead.placeholders.name')} />
            </Label>
            <Label>
              {t('common.phone')} *
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t('lead.placeholders.phone')} />
            </Label>
          </Row>

          <div style={{ height: 12 }} />

          <Label>
            {t('common.message')}
            <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t('lead.placeholders.message')} />
          </Label>

          <div style={{ height: 12 }} />

          <Check>
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span>{t('common.consent')}</span>
          </Check>

          <div style={{ height: 12 }} />

          {error ? <Error>{error}</Error> : null}
          {ok ? <P style={{ color: '#8be28b' }}>{t('lead.success')}</P> : null}

          <div style={{ height: 12 }} />
          <Button $variant="primary" disabled={loading}>
            {loading ? t('lead.sending') : t('common.send')}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
