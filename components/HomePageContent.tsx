'use client';

import Link from 'next/link';
import { H2, P, Card, CardBody, Button, Hr, CardsGrid, TwoColGrid } from './ui';
import HomeHero from './HomeHero';
import LotCard from './LotCard';
import type { Locale } from '../lib/i18n/routing';

type VehicleRow = {
  id: number;
  slug: string;
  year: number;
  make: string;
  model: string;
  trim?: string | null;
  fullModelName?: string | null;
  thumbUrl?: string | null;
  bodyType?: string | null;
  engineVolumeL?: number | null;
  odometerReading?: number | null;
  odometerUnit?: string | null;
  driveType?: string | null;
  fuelType?: string | null;
  displayedPrice?: number | null;
  currency?: string | null;
};

export default function HomePageContent({
  locale,
  freshRows,
  t
}: {
  locale: Locale;
  freshRows: VehicleRow[];
  t: {
    title: string;
    subtitle: string;
    ctaBrowse: string;
    navServices: string;
    priceRule: string;
    leadTitle: string;
    freshLots: string;
    stepsTitle: string;
    steps: string;
    faqTitle: string;
    faq: string;
    cta: string;
  };
}) {
  return (
    <div>
      <HomeHero
        locale={locale}
        title={t.title}
        subtitle={t.subtitle}
        ctaBrowse={t.ctaBrowse}
        navServices={t.navServices}
        leadTitle={t.leadTitle}
        pageUrl={`/${locale}`}
      />

      <div style={{ height: 26 }} />

      <H2>{t.freshLots}</H2>
      <div style={{ height: 12 }} />

      <CardsGrid>
        {freshRows.map((it) => (
          <LotCard
            key={it.id}
            locale={locale}
            item={{
              slug: it.slug,
              year: it.year,
              make: it.make,
              model: it.model,
              trim: it.trim,
              fullModelName: it.fullModelName,
              thumbUrl: it.thumbUrl,
              bodyType: it.bodyType,
              engineVolumeL: it.engineVolumeL,
              odometerReading: it.odometerReading,
              odometerUnit: it.odometerUnit,
              driveType: it.driveType,
              fuelType: it.fuelType,
              displayedPrice: it.displayedPrice,
              currency: it.currency
            }}
          />
        ))}
      </CardsGrid>

      <div style={{ height: 26 }} />

      <TwoColGrid>
        <Card style={{ display: 'flex', flexDirection: 'column' }}>
          <CardBody>
            <H2>{t.stepsTitle}</H2>
            <div style={{ height: 10 }} />
            <P>{t.steps}</P>
          </CardBody>
        </Card>
        <Card style={{ display: 'flex', flexDirection: 'column' }}>
          <CardBody>
            <H2>{t.faqTitle}</H2>
            <div style={{ height: 10 }} />
            <P>{t.faq}</P>
            <div style={{ height: 12 }} />
            <Link href={`/${locale}/contacts`}>
              <Button $variant="primary">{t.cta}</Button>
            </Link>
          </CardBody>
        </Card>
      </TwoColGrid>
    </div>
  );
}
