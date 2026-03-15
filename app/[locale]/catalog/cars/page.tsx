export const runtime = 'edge';

import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '../../../../lib/i18n/routing';
import { Suspense } from 'react';
import { H2, P, Card, CardBody, CatalogPageGrid, CatalogCardsGrid } from '../../../../components/ui';
import FiltersPanel from '../../../../components/FiltersPanel';
import Pagination from '../../../../components/Pagination';
import LotCard from '../../../../components/LotCard';
import { listVehicles } from '../../../../lib/server/vehicles';

function asNum(v: string | string[] | undefined) {
  if (!v) return undefined;
  const s = Array.isArray(v) ? v[0] : v;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

function asStr(v: string | string[] | undefined) {
  if (!v) return undefined;
  return (Array.isArray(v) ? v[0] : v) || undefined;
}

function asList(v: string | string[] | undefined) {
  const s = asStr(v);
  if (!s) return undefined;
  const arr = s.split(',').map((x) => x.trim()).filter(Boolean);
  return arr.length ? arr : undefined;
}

export default async function CarsListing({
  params,
  searchParams
}: {
  params: { locale: Locale };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale });

  const page = Math.max(1, asNum(searchParams.page) ?? 1);
  const pageSize = 50;

  const sort = (asStr(searchParams.sort) as any) || 'price_asc';

  let data: { total: number; rows: any[]; page: number; pageSize: number } = { total: 0, rows: [], page, pageSize };
  try {
    data = await listVehicles({
      filters: {
        category: 'cars',
        make: asList(searchParams.make)?.map((m) => m.toUpperCase()),
        model: asStr(searchParams.model)?.toUpperCase(),
        priceMin: asNum(searchParams.priceMin),
        priceMax: asNum(searchParams.priceMax),
        yearMin: asNum(searchParams.yearMin),
        yearMax: asNum(searchParams.yearMax),
        engineMin: asNum(searchParams.engineMin),
        engineMax: asNum(searchParams.engineMax),
        bodyType: asList(searchParams.bodyType),
        fuelType: asList(searchParams.fuelType),
        driveType: asList(searchParams.driveType),
        transmissionType: asList(searchParams.transmissionType),
        color: asStr(searchParams.color)
      },
      sort,
      page,
      pageSize
    });
  } catch (err) {
    console.error('[CarsListing] DB error:', err);
  }

  return (
    <div>
      <H2>{t('catalog.cars')}</H2>
      <P style={{ marginTop: 8 }}>{t('catalog.carsSub')}</P>
      <div style={{ height: 16 }} />

      <CatalogPageGrid>
        <div>
          <Suspense fallback={null}><FiltersPanel total={data.total} /></Suspense>
        </div>
        <div>
          {data.total === 0 && (
            <Card>
              <CardBody>
                <P style={{ color: 'var(--muted)', margin: 0 }}>{t('common.noResults')}</P>
              </CardBody>
            </Card>
          )}
          <CatalogCardsGrid>
            {data.rows.map((it) => (
              <LotCard
                key={it.id}
                locale={params.locale}
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
                  buyItNow: it.buyItNow,
                  estRetail: it.estRetail,
                  currency: it.currency
                }}
              />
            ))}
          </CatalogCardsGrid>

          <Suspense fallback={null}><Pagination total={data.total} page={data.page} pageSize={data.pageSize} /></Suspense>
        </div>
      </CatalogPageGrid>
    </div>
  );
}
