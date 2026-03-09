'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import { useTranslations } from 'next-intl';
import type { Locale } from '../lib/i18n/routing';
import { Container, Button } from './ui';

const Wrap = styled.header`
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

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 800;
  letter-spacing: 0.2px;
`;

const Dot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--accent);
  box-shadow: 0 0 0 6px rgba(255, 107, 53, 0.15);
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

  @media (max-width: 860px) {
    display: none;
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Lang = styled.div`
  display: flex;
  gap: 6px;
  padding: 4px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: #F8FAFC;
`;

const LangLink = styled(Link)<{ $active?: boolean }>`
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  color: ${(p) => (p.$active ? '#FFFFFF' : 'var(--muted)')};
  background: ${(p) => (p.$active ? 'var(--accent)' : 'transparent')};
  transition: color 120ms ease, background 120ms ease;
`;

function replaceLocale(pathname: string, newLocale: Locale): string {
  const parts = pathname.split('?')[0].split('/').filter(Boolean);
  if (parts.length === 0) return `/${newLocale}`;
  // if first segment is locale, replace; otherwise prepend
  const first = parts[0];
  const known: Locale[] = ['ka', 'ru', 'en'];
  if ((known as string[]).includes(first)) {
    parts[0] = newLocale;
    return '/' + parts.join('/');
  }
  return `/${newLocale}/` + parts.join('/');
}

export default function Header({ locale }: { locale: Locale }) {
  const t = useTranslations();
  const pathname = usePathname() || '/';
  const sp = useSearchParams();
  const qs = sp?.toString();
  const base = qs ? `${pathname}?${qs}` : pathname;

  const mk = (l: Locale) => {
    const p = replaceLocale(base, l);
    return p;
  };

  return (
    <Wrap>
      <Container>
        <Row>
          <Link href={`/${locale}`} aria-label="Home">
            <Brand>
              <Dot />
              <span>{t('common.brand')}</span>
            </Brand>
          </Link>

          <Nav>
            <Link href={`/${locale}/catalog/cars`}>{t('nav.catalog')}</Link>
            <Link href={`/${locale}/services`}>{t('nav.services')}</Link>
            <Link href={`/${locale}/tracking`}>{t('nav.tracking')}</Link>
            <Link href={`/${locale}/about`}>{t('nav.about')}</Link>
            <Link href={`/${locale}/contacts`}>{t('nav.contacts')}</Link>
          </Nav>

          <Right>
            <Lang aria-label="Language switcher">
              <LangLink href={mk('ka')} $active={locale === 'ka'}>KA</LangLink>
              <LangLink href={mk('ru')} $active={locale === 'ru'}>RU</LangLink>
              <LangLink href={mk('en')} $active={locale === 'en'}>EN</LangLink>
            </Lang>

            <Link href={`/${locale}/contacts`}>
              <Button $variant="primary">{t('common.cta')}</Button>
            </Link>
          </Right>
        </Row>
      </Container>
    </Wrap>
  );
}
