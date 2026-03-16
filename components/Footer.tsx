'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { useTranslations } from 'next-intl';
import { Container } from './ui';
import type { Locale } from '../lib/i18n/routing';

const Wrap = styled.footer`
  border-top: 1px solid var(--border);
  padding: 28px 0 40px;
  background: #FFFFFF;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 16px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const BottomBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 20px;
  margin-top: 20px;
  border-top: 1px solid var(--border);

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
`;

const BottomLinks = styled.div`
  display: flex;
  gap: 16px;

  a {
    color: var(--muted);
    font-size: 14px;
  }
  a:hover { color: var(--text); }
`;

const Small = styled.p`
  margin: 0;
  color: var(--muted);
  line-height: 1.6;
  font-size: 14px;
`;

const ColTitle = styled.p`
  margin: 0 0 10px;
  font-weight: 800;
`;

const Links = styled.div`
  display: grid;
  gap: 8px;

  a {
    color: var(--muted);
    font-size: 14px;
  }
  a:hover { color: var(--text); }
`;

const SocialRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 14px;

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: var(--hover-bg);
    color: var(--muted);
    transition: color 120ms, border-color 120ms, background 120ms;
  }
  a:hover {
    color: var(--text);
    border-color: #FF6B35;
    background: rgba(255,107,53,0.08);
  }
  a.phone {
    width: auto;
    height: auto;
    padding: 6px 10px;
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
  }
`;

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.858L0 24l6.335-1.508A11.933 11.933 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 0 1-5.032-1.388l-.361-.214-3.741.981.999-3.648-.235-.374A9.786 9.786 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

export default function Footer({ locale }: { locale: Locale }) {
  const t = useTranslations();

  return (
    <Wrap>
      <Container>
        <Row>
          <div>
            <ColTitle>{t('common.brand')}</ColTitle>
            <Small>{t('footer.tagline')}</Small>
            <SocialRow>
              <a href="https://wa.me/995551532661" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><WhatsAppIcon /></a>
              <a href="https://t.me/" target="_blank" rel="noopener noreferrer" aria-label="Telegram"><TelegramIcon /></a>
              <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramIcon /></a>
              <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FacebookIcon /></a>
              <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><YouTubeIcon /></a>
              <a href="tel:+995551532661" className="phone" aria-label="Phone">+995 551 532 661</a>
            </SocialRow>
          </div>

          <div>
            <ColTitle>{t('footer.links')}</ColTitle>
            <Links>
              <Link href={`/${locale}/catalog/cars`}>{t('nav.catalog')}</Link>
              <Link href={`/${locale}/services`}>{t('nav.services')}</Link>
              <Link href={`/${locale}/tracking`}>{t('nav.tracking')}</Link>
              <Link href={`/${locale}/about`}>{t('nav.about')}</Link>
              <Link href={`/${locale}/contacts`}>{t('nav.contacts')}</Link>
            </Links>
          </div>

        </Row>
        <BottomBar>
          <Small>© 2026 {t('common.brand')}</Small>
          <BottomLinks>
            <Link href={`/${locale}/privacy`}>{t('footer.privacy')}</Link>
            <Link href={`/${locale}/cookies`}>{t('footer.cookies')}</Link>
          </BottomLinks>
        </BottomBar>
      </Container>
    </Wrap>
  );
}
