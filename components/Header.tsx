'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import { useTranslations } from 'next-intl';
import type { Locale } from '../lib/i18n/routing';
import { Container, Button } from './ui';
import LangSwitcher from './LangSwitcher';

/* ── header shell ── */

const Wrap = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.9);
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

  @media (max-width: 860px) { display: none; }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const DesktopCtaWrap = styled.div`
  @media (max-width: 860px) { display: none; }
`;

/* ── hamburger button ── */

const HamburgerBtn = styled.button`
  display: none;
  width: 38px;
  height: 38px;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  transition: background 120ms ease, border-color 120ms ease;
  flex-shrink: 0;

  &:hover {
    background: var(--hover-bg);
    border-color: var(--accent);
  }

  @media (max-width: 860px) { display: flex; }
`;

/* Icon box with 3 absolutely-positioned lines */
const IconBox = styled.span`
  position: relative;
  display: block;
  width: 20px;
  height: 14px;
`;

const Line = styled.span<{ $open: boolean; $pos: 'top' | 'mid' | 'bot' }>`
  position: absolute;
  left: 0;
  width: 20px;
  height: 2px;
  border-radius: 2px;
  background: var(--text);
  transition: transform 260ms ease, opacity 260ms ease;

  top: ${(p) => p.$pos === 'top' ? '0' : p.$pos === 'mid' ? '6px' : '12px'};

  ${(p) => p.$pos === 'top' && p.$open && 'transform: translateY(6px) rotate(45deg);'}
  ${(p) => p.$pos === 'mid' && p.$open && 'opacity: 0; transform: scaleX(0);'}
  ${(p) => p.$pos === 'bot' && p.$open && 'transform: translateY(-6px) rotate(-45deg);'}
`;

/* ── drawer overlay ── */

const Overlay = styled.div<{ $open: boolean }>`
  display: none;

  @media (max-width: 860px) {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.4);
    backdrop-filter: blur(3px);
    z-index: 101;
    opacity: ${(p) => (p.$open ? 1 : 0)};
    pointer-events: ${(p) => (p.$open ? 'all' : 'none')};
    transition: opacity 280ms ease;
  }
`;

/* ── sliding drawer ── */

const Drawer = styled.div<{ $open: boolean }>`
  display: none;

  @media (max-width: 860px) {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    right: 0;
    height: 100%;
    width: 280px;
    max-width: 85vw;
    background: #ffffff;
    box-shadow: -6px 0 40px rgba(15, 23, 42, 0.12);
    z-index: 102;
    transform: translateX(${(p) => (p.$open ? '0' : '100%')});
    transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
    padding: 0 0 32px;
    overflow-y: auto;
  }
`;

const DrawerTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
`;

const DrawerClose = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--hover-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  color: var(--muted);
  transition: color 120ms, border-color 120ms;
  &:hover { color: var(--text); border-color: var(--accent); }
`;

const DrawerNav = styled.nav`
  display: flex;
  flex-direction: column;
  padding: 12px 12px 0;
  gap: 2px;

  a {
    display: block;
    padding: 13px 14px;
    border-radius: 10px;
    color: var(--text);
    font-size: 16px;
    font-weight: 600;
    transition: background 120ms ease, color 120ms ease;
  }
  a:hover { background: var(--hover-bg); }
  a.active { color: var(--accent); background: rgba(255,107,53,0.06); }
`;

const DrawerFooter = styled.div`
  padding: 16px 20px 0;
  margin-top: auto;
  border-top: 1px solid var(--border);
  flex-shrink: 0;
`;

/* ── locale helpers ── */

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

/* ── component ── */

export default function Header({ locale }: { locale: Locale }) {
  const t = useTranslations();
  const pathname = usePathname() || '/';
  const sp = useSearchParams();
  const qs = sp?.toString();
  const base = qs ? `${pathname}?${qs}` : pathname;

  const mk = (l: Locale) => replaceLocale(base, l);
  const isActive = (segment: string) => pathname.includes(`/${locale}/${segment}`);

  const [mobileOpen, setMobileOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
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

              <DesktopCtaWrap>
                <Link href={`/${locale}/contacts`}>
                  <Button $variant="primary">{t('common.cta')}</Button>
                </Link>
              </DesktopCtaWrap>

              <HamburgerBtn
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((v) => !v)}
              >
                <IconBox aria-hidden>
                  <Line $open={mobileOpen} $pos="top" />
                  <Line $open={mobileOpen} $pos="mid" />
                  <Line $open={mobileOpen} $pos="bot" />
                </IconBox>
              </HamburgerBtn>
            </Right>
          </Row>
        </Container>
      </Wrap>

      <Overlay $open={mobileOpen} onClick={() => setMobileOpen(false)} />

      <Drawer $open={mobileOpen} aria-hidden={!mobileOpen}>
        <DrawerTop>
          <Brand>
            <Dot />
            <span>{t('common.brand')}</span>
          </Brand>
          <DrawerClose onClick={() => setMobileOpen(false)} aria-label="Close menu">
            ✕
          </DrawerClose>
        </DrawerTop>

        <DrawerNav>
          <Link href={`/${locale}/catalog/cars`} className={isActive('catalog') ? 'active' : ''}>{t('nav.catalog')}</Link>
          <Link href={`/${locale}/services`} className={isActive('services') ? 'active' : ''}>{t('nav.services')}</Link>
          <Link href={`/${locale}/tracking`} className={isActive('tracking') ? 'active' : ''}>{t('nav.tracking')}</Link>
          <Link href={`/${locale}/about`} className={isActive('about') ? 'active' : ''}>{t('nav.about')}</Link>
          <Link href={`/${locale}/contacts`} className={isActive('contacts') ? 'active' : ''}>{t('nav.contacts')}</Link>
        </DrawerNav>

        <DrawerFooter>
          <Link href={`/${locale}/contacts`}>
            <Button $variant="primary" style={{ width: '100%' }}>{t('common.cta')}</Button>
          </Link>
        </DrawerFooter>
      </Drawer>
    </>
  );
}
