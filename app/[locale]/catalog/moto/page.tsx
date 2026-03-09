export const runtime = 'edge';

import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '../../../../lib/i18n/routing';
import { H2, P, Grid } from '../../../../components/ui';
import { listVehicles } from '../../../../lib/server/vehicles';
import LotCard from '../../../../components/LotCard';

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
      <P style={{ marginTop: 8 }}>{t('catalog.minimal')}</P>
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
