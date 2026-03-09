'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import styled from 'styled-components';
import { Button, Card, CardBody, Input, H2, P, Container } from '../../../components/ui';
import { useAdminI18n } from '../../../lib/admin-i18n';

const Center = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
`;

export default function AdminLoginPage() {
  const { t } = useAdminI18n();
  const sp = useSearchParams();
  const router = useRouter();
  const next = sp?.get('next') || '/admin/import';

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Login failed');
      router.push(next);
    } catch (err: any) {
      setError(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Center>
      <Container style={{ maxWidth: 520 }}>
        <Card>
          <CardBody>
            <H2>{t('login.title')}</H2>
            <P style={{ marginTop: 8 }}>{t('login.hint')}</P>
            <div style={{ height: 14 }} />
            <form onSubmit={submit}>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('login.placeholder')} />
              <div style={{ height: 12 }} />
              {error ? <P style={{ color: '#DC2626' }}>{error}</P> : null}
              <div style={{ height: 12 }} />
              <Button $variant="primary" disabled={loading} style={{ width: '100%' }}>
                {loading ? t('login.loading') : t('login.submit')}
              </Button>
            </form>
          </CardBody>
        </Card>
      </Container>
    </Center>
  );
}
