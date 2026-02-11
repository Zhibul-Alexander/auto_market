'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { useTranslations } from 'next-intl';
import { Container, Hr } from './ui';
import type { Locale } from '../lib/i18n/routing';

const Wrap = styled.footer`
  border-top: 1px solid var(--border);
  padding: 28px 0 40px;
  background: rgba(255,255,255,0.02);
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1.3fr 1fr 1fr;
  gap: 16px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
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

export default function Footer({ locale }: { locale: Locale }) {
  const t = useTranslations();

  return (
    <Wrap>
      <Container>
        <Row>
          <div>
            <ColTitle>{t('common.brand')}</ColTitle>
            <Small>{t('footer.tagline')}</Small>
            <Hr />
            <Small>© {new Date().getFullYear()} {t('common.brand')}</Small>
          </div>

          <div>
            <ColTitle>{t('footer.links')}</ColTitle>
            <Links>
              <Link href={`/${locale}/catalog/cars`}>{t('nav.catalog')}</Link>
              <Link href={`/${locale}/services`}>{t('nav.services')}</Link>
              <Link href={`/${locale}/tracking`}>{t('nav.tracking')}</Link>
              <Link href={`/${locale}/contacts`}>{t('nav.contacts')}</Link>
            </Links>
          </div>

          <div>
            <ColTitle>{t('footer.legal')}</ColTitle>
            <Links>
              <Link href={`/${locale}/privacy`}>{t('footer.privacy')}</Link>
              <Link href={`/${locale}/cookies`}>{t('footer.cookies')}</Link>
              <Link href={`/admin/login`}>{t('footer.admin')}</Link>
            </Links>
          </div>
        </Row>
      </Container>
    </Wrap>
  );
}
