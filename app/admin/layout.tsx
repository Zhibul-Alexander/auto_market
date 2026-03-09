'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { Container } from '../../components/ui';
import { AdminI18nProvider, useAdminI18n, type AdminLocale } from '../../lib/admin-i18n';

const Wrap = styled.div`
  min-height: 100vh;
  padding: 28px 0 60px;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
  flex-wrap: wrap;
`;

const Nav = styled.nav`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;

  a {
    padding: 8px 10px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: #F8FAFC;
    color: var(--muted);
    transition: color 120ms, border-color 120ms;
  }
  a:hover { color: var(--text); border-color: #FF6B35; }
`;

const LangWrap = styled.div`
  display: flex;
  gap: 4px;
  padding: 3px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: #F8FAFC;
`;

const LangBtn = styled.button<{ $active?: boolean }>`
  padding: 5px 9px;
  border-radius: 999px;
  border: none;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  color: ${(p) => (p.$active ? '#FFFFFF' : 'var(--muted)')};
  background: ${(p) => (p.$active ? 'var(--accent)' : 'transparent')};
  transition: color 120ms, background 120ms;
`;

const BackLink = styled(Link)`
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: #F8FAFC;
  color: var(--accent);
  font-weight: 600;
  font-size: 13px;
  transition: color 120ms, border-color 120ms, background 120ms;

  &:hover {
    border-color: #FF6B35;
    background: rgba(255,107,53,0.08);
  }
`;

function AdminBar({ children }: { children: React.ReactNode }) {
  const { locale, setLocale, t } = useAdminI18n();
  const langs: AdminLocale[] = ['ge', 'ru', 'en'];

  return (
    <Wrap>
      <Container>
        <Top>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 10, height: 10, borderRadius: 999, background: 'var(--accent)' }} />
              Admin
            </div>
            <LangWrap>
              {langs.map((l) => (
                <LangBtn key={l} $active={locale === l} onClick={() => setLocale(l)}>
                  {l.toUpperCase()}
                </LangBtn>
              ))}
            </LangWrap>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <Nav>
              <Link href="/admin/import">{t('nav.import')}</Link>
              <Link href="/admin/leads">{t('nav.leads')}</Link>
              <Link href="/admin/offices">{t('nav.offices')}</Link>
            </Nav>
            <BackLink href={`/${locale}`}>
              ← {t('nav.backToSite')}
            </BackLink>
          </div>
        </Top>

        {children}
      </Container>
    </Wrap>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminI18nProvider>
      <AdminBar>{children}</AdminBar>
    </AdminI18nProvider>
  );
}
