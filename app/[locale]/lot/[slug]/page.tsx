export const runtime = 'edge';

import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '../../../../lib/i18n/routing';
import { getVehicleBySlug, listSimilarVehicles } from '../../../../lib/server/vehicles';
import { maskVin } from '../../../../lib/server/normalize';
import Gallery from '../../../../components/Gallery';
import LeadForm from '../../../../components/LeadForm';
import LotCard from '../../../../components/LotCard';
import { Grid, H1, H2, P, Card, CardBody, Badge, Hr } from '../../../../components/ui';
import Link from 'next/link';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: Locale; slug: string } }): Promise<Metadata> {
  try {
    const v = await getVehicleBySlug(params.slug);
    if (!v) return {};
    const title = v.fullModelName?.trim() || `${v.year} ${v.make} ${v.model}${v.trim ? ` ${v.trim}` : ''}`.trim();
    const desc = `Lot ${v.externalId} · ${v.make} ${v.model} · Auto Market`;
    return {
      title,
      description: desc,
      alternates: {
        canonical: `/${params.locale}/lot/${params.slug}`
      }
    };
  } catch {
    return {};
  }
}

export default async function LotDetail({ params }: { params: { locale: Locale; slug: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale });

  let v;
  try {
    v = await getVehicleBySlug(params.slug);
  } catch (err) {
    console.error('[LotDetail] DB error:', err);
  }
  if (!v) return notFound();

  let gallery: string[] = [];
  try { gallery = v.galleryJson ? JSON.parse(v.galleryJson) : []; } catch { gallery = []; }
  if (!gallery.length && v.thumbUrl) gallery = [v.thumbUrl];

  const title = v.fullModelName?.trim() || `${v.year} ${v.make} ${v.model}${v.trim ? ` ${v.trim}` : ''}`.trim();
  const price = v.displayedPrice != null ? `${formatMoney(v.displayedPrice)} ${v.currency || 'USD'}` : t('common.priceOnRequest');

  let similar: any[] = [];
  try {
    similar = await listSimilarVehicles({
      excludeId: v.id,
      make: v.make,
      model: v.model,
      bodyType: v.bodyType,
      limit: 6
    });
  } catch (err) {
    console.error('[LotDetail] Similar DB error:', err);
  }

  return (
    <div>
      <H1 style={{ fontSize: 34 }}>{title}</H1>
      <P style={{ marginTop: 8 }}>{t('lot.subtitle', { id: v.externalId })}</P>

      <div style={{ height: 14 }} />

      <Gallery images={gallery} />

      <div style={{ height: 16 }} />

      <Grid>
        <div style={{ gridColumn: 'span 8' }}>
          <Card>
            <CardBody>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <H2>{t('lot.price')}</H2>
                  <div style={{ fontSize: 26, fontWeight: 700, marginTop: 8, color: '#FF6B35' }}>{price}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  {v.bodyType ? <Badge>{v.bodyType}</Badge> : null}
                  {v.engineVolumeL ? <Badge>{v.engineVolumeL.toFixed(1)}L</Badge> : null}
                  {v.fuelType ? <Badge>{v.fuelType}</Badge> : null}
                </div>
              </div>

              <Hr />

              <SpecGrid>
                <Spec label={t('lot.specs.year')} value={String(v.year)} />
                <Spec label={t('lot.specs.body')} value={v.bodyTypeRaw || v.bodyType || '—'} />
                <Spec label={t('lot.specs.engine')} value={v.engineVolumeL ? `${v.engineVolumeL.toFixed(1)}L` : '—'} />
                <Spec label={t('lot.specs.fuel')} value={v.fuelRaw || v.fuelType || '—'} />
                <Spec label={t('lot.specs.drive')} value={v.driveRaw || v.driveType || '—'} />
                <Spec label={t('lot.specs.transmission')} value={v.transmissionRaw || v.transmissionType || '—'} />
                <Spec label={t('lot.specs.color')} value={v.color || '—'} />
                <Spec label={t('lot.specs.vin')} value={maskVin(v.vin) || '—'} />
              </SpecGrid>

              {v.itemUrl ? (
                <>
                  <Hr />
                  <Link href={v.itemUrl} target="_blank" style={{ color: 'var(--accent)' }}>
                    {t('lot.sourceLink')}
                  </Link>
                </>
              ) : null}
            </CardBody>
          </Card>

          <div style={{ height: 18 }} />

          <H2>{t('lot.similar')}</H2>
          <div style={{ height: 12 }} />
          <Grid>
            {similar.map((it) => (
              <div key={it.id} style={{ gridColumn: 'span 4' }}>
                <LotCard
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
                    currency: it.currency
                  }}
                />
              </div>
            ))}
          </Grid>
        </div>

        <div style={{ gridColumn: 'span 4' }}>
          <LeadForm
            type="lot"
            locale={params.locale}
            pageUrl={`/${params.locale}/lot/${v.slug}`}
            lotId={v.id}
            title={t('lot.leadTitle')}
          />
          <div style={{ height: 12 }} />
          <P style={{ fontSize: 13 }}>{t('lot.leadHint')}</P>
        </div>
      </Grid>
    </div>
  );
}

function formatMoney(v: number) {
  return v.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

const SpecGrid = (props: { children: React.ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>{props.children}</div>
);

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 14, padding: 12, background: '#F8FAFC' }}>
      <div style={{ fontSize: 12, color: 'var(--muted)' }}>{label}</div>
      <div style={{ fontWeight: 800, marginTop: 6, color: 'var(--text)' }}>{value}</div>
    </div>
  );
}
