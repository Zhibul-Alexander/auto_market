'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { H1, P, Button, Hr } from './ui';
import LeadForm from './LeadForm';
import type { Locale } from '../lib/i18n/routing';

const Hero = styled.section`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 18px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.div`
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 18px;
  background: radial-gradient(1000px 400px at 20% 10%, rgba(255,107,53,0.16), transparent 50%),
              rgba(255,255,255,0.02);
`;

export default function HomeHero({
  locale,
  title,
  subtitle,
  ctaBrowse,
  navServices,
  priceRule,
  leadTitle,
  pageUrl
}: {
  locale: Locale;
  title: string;
  subtitle: string;
  ctaBrowse: string;
  navServices: string;
  priceRule: string;
  leadTitle: string;
  pageUrl: string;
}) {
  return (
    <Hero>
      <Panel>
        <H1>{title}</H1>
        <P style={{ marginTop: 12 }}>{subtitle}</P>
        <div style={{ height: 16 }} />
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link href={`/${locale}/catalog/cars`}>
            <Button $variant="primary">{ctaBrowse}</Button>
          </Link>
          <Link href={`/${locale}/services`}>
            <Button>{navServices}</Button>
          </Link>
        </div>
        <div style={{ height: 16 }} />
        <Hr />
        <P style={{ fontSize: 13 }}>{priceRule}</P>
      </Panel>
      <LeadForm type="general" locale={locale} pageUrl={pageUrl} title={leadTitle} />
    </Hero>
  );
}
