'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';
import { Container } from '../../components/ui';
import { AdminI18nProvider, useAdminI18n } from '../../lib/admin-i18n';
import LangSwitcher from '../../components/LangSwitcher';

const HeaderWrap = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.8);
  border-bottom: 1px solid var(--border);
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  gap: 16px;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
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

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 900;
`;

const Dot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--accent);
  display: inline-block;
`;

const Nav = styled.nav`
  display: flex;
  gap: 12px;
  align-items: center;

  a {
    color: var(--muted);
    padding: 8px 10px;
    border-radius: 10px;
    border: 1px solid transparent;
    transition: color 120ms ease, background 120ms ease, border-color 120ms ease;
  }

  a:hover {
    color: var(--text);
    border-color: var(--border);
    background: var(--hover-bg);
  }

  a.active {
    color: var(--text);
    border-color: var(--border);
    background: var(--hover-bg);
  }
`;


const PageWrap = styled.div`
  min-height: 100vh;
  padding: 28px 0 60px;
`;

function AdminBar({ children }: { children: React.ReactNode }) {
  const { locale, setLocale, t } = useAdminI18n();
  const pathname = usePathname();

  return (
    <>
      <HeaderWrap>
        <Container>
          <Row>
            <Left>
              <BackLink href={`/${locale}`}>← {t('nav.backToSite')}</BackLink>
              <Brand>
                <Dot />
                Admin
              </Brand>
            </Left>

            <Nav>
              <Link href="/admin/import" className={pathname?.startsWith('/admin/import') ? 'active' : ''}>{t('nav.import')}</Link>
              <Link href="/admin/leads" className={pathname?.startsWith('/admin/leads') ? 'active' : ''}>{t('nav.leads')}</Link>
              <Link href="/admin/offices" className={pathname?.startsWith('/admin/offices') ? 'active' : ''}>{t('nav.offices')}</Link>
            </Nav>

            <LangSwitcher items={[
              { label: 'GE', active: locale === 'ge', onClick: () => setLocale('ge') },
              { label: 'RU', active: locale === 'ru', onClick: () => setLocale('ru') },
              { label: 'EN', active: locale === 'en', onClick: () => setLocale('en') },
            ]} />
          </Row>
        </Container>
      </HeaderWrap>
      <PageWrap>
        <Container>
          {children}
        </Container>
      </PageWrap>
    </>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminI18nProvider>
      <AdminBar>{children}</AdminBar>
    </AdminI18nProvider>
  );
}
