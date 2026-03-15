export const runtime = 'edge';

import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { locales, type Locale } from '../../../../lib/i18n/routing';

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'catalog' });
  return {
    title: t('moto'),
    description: t('motoDesc'),
    alternates: {
      canonical: `/${params.locale}/catalog/moto`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/catalog/moto`])),
    },
  };
}
import { H2, P, Grid, Card, CardBody, Button } from '../../../../components/ui';
import { listVehicles } from '../../../../lib/server/vehicles';
import LotCard from '../../../../components/LotCard';
import Link from 'next/link';

const MOTO_SEGMENTS = ['motorcycles', 'buggies', 'atvs', 'scooters', 'snowmobiles'] as const;

export default async function Moto({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale });

  let data: { total: number; rows: any[]; page: number; pageSize: number } = { total: 0, rows: [], page: 1, pageSize: 30 };
  try {
    data = await listVehicles({ filters: { category: 'moto' }, sort: 'newest', page: 1, pageSize: 30 });
  } catch (err) {
    console.error('[Moto] DB error:', err);
  }

  return (
    <div>
      <H2>{t('catalog.moto')}</H2>
      <P style={{ marginTop: 8 }}>{t('catalog.motoDesc')}</P>

      <div style={{ height: 16 }} />
      <Grid>
        {MOTO_SEGMENTS.map((seg) => (
          <div key={seg} style={{ gridColumn: 'span 4' }}>
            <Link href={`/${params.locale}/catalog/moto/${seg}`}>
              <Card>
                <CardBody>
                  <P style={{ fontWeight: 800, color: 'var(--text)' }}>
                    {t(`catalog.motoSegments.${seg}`)}
                  </P>
                  <div style={{ height: 8 }} />
                  <Button $variant="primary" style={{ fontSize: 13, padding: '8px 12px' }}>
                    {t('catalog.open')}
                  </Button>
                </CardBody>
              </Card>
            </Link>
          </div>
        ))}
      </Grid>

      <div style={{ height: 24 }} />
      <H2>{t('catalog.moto')} — {t('catalog.minimal')}</H2>
      <div style={{ height: 12 }} />
      <Grid>
        {data.rows.map((it) => (
          <div key={it.id} style={{ gridColumn: 'span 4' }}>
            <LotCard locale={params.locale} item={{
              slug: it.slug, year: it.year, make: it.make, model: it.model, trim: it.trim,
              fullModelName: it.fullModelName, thumbUrl: it.thumbUrl, bodyType: it.bodyType, engineVolumeL: it.engineVolumeL,
              odometerReading: it.odometerReading, odometerUnit: it.odometerUnit, driveType: it.driveType, fuelType: it.fuelType,
              displayedPrice: it.displayedPrice, currency: it.currency
            }} />
          </div>
        ))}
      </Grid>
    </div>
  );
}
