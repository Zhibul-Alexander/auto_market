'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import { useTranslations } from 'next-intl';
import type { Locale } from '../lib/i18n/routing';
import { Container, Button } from './ui';
import LangSwitcher from './LangSwitcher';

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

  a:hover, a.active {
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


function replaceLocale(pathname: string, newLocale: Locale): string {
  const [path, qs] = pathname.split('?') as [string, string | undefined];
  const parts = path.split('/').filter(Boolean);
  const known: Locale[] = ['ge', 'ru', 'en'];
  let newPath: string;
  if (parts.length === 0) {
    newPath = `/${newLocale}`;
  } else if ((known as string[]).includes(parts[0]!)) {
    parts[0] = newLocale;
    newPath = '/' + parts.join('/');
  } else {
    newPath = `/${newLocale}/` + parts.join('/');
  }
  return qs ? `${newPath}?${qs}` : newPath;
}

export default function Header({ locale }: { locale: Locale }) {
  const t = useTranslations();
  const pathname = usePathname() || '/';
  const sp = useSearchParams();
  const qs = sp?.toString();
  const base = qs ? `${pathname}?${qs}` : pathname;

  const mk = (l: Locale) => replaceLocale(base, l);

  const isActive = (segment: string) => pathname.includes(`/${locale}/${segment}`);

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
            <Link href={`/${locale}/catalog/cars`} className={isActive('catalog') ? 'active' : ''}>{t('nav.catalog')}</Link>
            <Link href={`/${locale}/services`} className={isActive('services') ? 'active' : ''}>{t('nav.services')}</Link>
            <Link href={`/${locale}/tracking`} className={isActive('tracking') ? 'active' : ''}>{t('nav.tracking')}</Link>
            <Link href={`/${locale}/about`} className={isActive('about') ? 'active' : ''}>{t('nav.about')}</Link>
            <Link href={`/${locale}/contacts`} className={isActive('contacts') ? 'active' : ''}>{t('nav.contacts')}</Link>
          </Nav>

          <Right>
            <LangSwitcher items={[
              { label: 'GE', active: locale === 'ge', href: mk('ge') },
              { label: 'RU', active: locale === 'ru', href: mk('ru') },
              { label: 'EN', active: locale === 'en', href: mk('en') },
            ]} />

            <Link href={`/${locale}/contacts`}>
              <Button $variant="primary">{t('common.cta')}</Button>
            </Link>
          </Right>
        </Row>
      </Container>
    </Wrap>
  );
}
