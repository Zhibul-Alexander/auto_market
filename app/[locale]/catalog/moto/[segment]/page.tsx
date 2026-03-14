export const runtime = 'edge';

import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '../../../../../lib/i18n/routing';
import { Suspense } from 'react';
import { Grid, H2, P, Card, CardBody } from '../../../../../components/ui';
import Pagination from '../../../../../components/Pagination';
import LotCard from '../../../../../components/LotCard';
import { listVehicles } from '../../../../../lib/server/vehicles';

const segmentToBody: Record<string, string> = {
  motorcycles: 'motorcycle',
  buggies: 'buggy',
  atvs: 'atv',
  scooters: 'scooter',
  snowmobiles: 'snowmobile'
};

function asNum(v: string | string[] | undefined) {
  if (!v) return undefined;
  const s = Array.isArray(v) ? v[0] : v;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

export default async function MotoSegmentPage({
  params,
  searchParams
}: {
  params: { locale: Locale; segment: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale });

  const bodyPreset = segmentToBody[params.segment] || 'other';
  const page = Math.max(1, asNum(searchParams.page) ?? 1);
  const pageSizeRaw = asNum(searchParams.pageSize) ?? 30;
  const pageSize = [30, 60, 90].includes(pageSizeRaw) ? pageSizeRaw : 30;

  let segmentLabel = params.segment;
  try { segmentLabel = t(`catalog.motoSegments.${params.segment}`); } catch {}

  let data: { total: number; rows: any[]; page: number; pageSize: number } = { total: 0, rows: [], page, pageSize };
  try {
    data = await listVehicles({
      filters: { category: 'moto', bodyType: [bodyPreset] },
      sort: 'newest',
      page,
      pageSize
    });
  } catch (err) {
    console.error('[MotoSegment] DB error:', err);
  }

  return (
    <div>
      <H2>{t('catalog.moto')} · {segmentLabel}</H2>
      <P style={{ marginTop: 8 }}>{t('catalog.motoSegmentSub', { segment: segmentLabel })}</P>
      <div style={{ height: 16 }} />

      {data.total === 0 && (
        <Card>
          <CardBody>
            <P style={{ color: 'var(--muted)', margin: 0 }}>{t('common.noResults')}</P>
          </CardBody>
        </Card>
      )}
      <Grid>
        {data.rows.map((it) => (
          <div key={it.id} style={{ gridColumn: 'span 4' }}>
            <LotCard
              locale={params.locale}
              item={{
                slug: it.slug, year: it.year, make: it.make, model: it.model, trim: it.trim,
                fullModelName: it.fullModelName, thumbUrl: it.thumbUrl, bodyType: it.bodyType,
                engineVolumeL: it.engineVolumeL, odometerReading: it.odometerReading,
                odometerUnit: it.odometerUnit, driveType: it.driveType, fuelType: it.fuelType,
                displayedPrice: it.displayedPrice, currency: it.currency
              }}
            />
          </div>
        ))}
      </Grid>

      <Suspense fallback={null}><Pagination total={data.total} page={data.page} pageSize={data.pageSize} /></Suspense>
    </div>
  );
}
