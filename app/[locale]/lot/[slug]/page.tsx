export const runtime = 'edge';

import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '../../../../lib/i18n/routing';
import { getVehicleBySlug, listSimilarVehicles } from '../../../../lib/server/vehicles';
import Gallery from '../../../../components/Gallery';
import LeadForm from '../../../../components/LeadForm';
import LotCard from '../../../../components/LotCard';
import { H1, H2, P, Card, CardBody, Badge, Hr, LotPageGrid, CardsGrid, LotSpecGrid, LotPrice } from '../../../../components/ui';
import Link from 'next/link';
import { Metadata } from 'next';
import { locales } from '../../../../lib/i18n/routing';

export async function generateMetadata({ params }: { params: { locale: Locale; slug: string } }): Promise<Metadata> {
  try {
    const v = await getVehicleBySlug(params.slug);
    if (!v) return {};
    const title = v.fullModelName?.trim() || `${v.year} ${v.make} ${v.model}${v.trim ? ` ${v.trim}` : ''}`.trim();
    const desc = `${v.year} ${v.make} ${v.model}${v.trim ? ` ${v.trim}` : ''} — lot ${v.externalId}. Buy directly from US auction. Delivery and customs clearance to Georgia. Auto Market.`;
    const images = v.thumbUrl ? [{ url: v.thumbUrl }] : undefined;
    return {
      title,
      description: desc,
      openGraph: {
        title,
        description: desc,
        type: 'website',
        images,
      },
      twitter: { images },
      alternates: {
        canonical: `/${params.locale}/lot/${params.slug}`,
        languages: Object.fromEntries(locales.map((l) => [l, `/${l}/lot/${params.slug}`])),
      },
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

  const bodyLabel = (() => {
    const map: Record<string, string> = {
      sedan: t('common.bodySedan'), hatchback: t('common.bodyHatchback'),
      crossover: t('common.bodySuv'), coupe: t('common.bodyCoupe'),
      minivan: t('common.bodyMinivan'), pickup: t('common.bodyPickup'),
      convertible: t('common.bodyConvertible'), sport: t('common.bodySport'),
      wagon: t('common.bodyWagon'),
    };
    return (v.bodyType && map[v.bodyType]) || v.bodyTypeRaw || null;
  })();

  const fuelLabel = (() => {
    const map: Record<string, string> = {
      gas: t('common.fuelGas'), diesel: t('common.fuelDiesel'),
      hybrid: t('common.fuelHybrid'), electric: t('common.fuelElectric'),
    };
    return (v.fuelType && map[v.fuelType]) || v.fuelRaw || null;
  })();

  const driveLabel = (() => {
    const map: Record<string, string> = {
      fwd: t('common.driveFwd'), rwd: t('common.driveRwd'),
      awd: t('common.driveAwd'), '4wd': t('common.driveAwd'),
    };
    return (v.driveType && map[v.driveType]) || v.driveRaw || null;
  })();

  const transLabel = (() => {
    const map: Record<string, string> = {
      automatic: t('common.transAuto'), manual: t('common.transManual'),
    };
    return (v.transmissionType && map[v.transmissionType]) || v.transmissionRaw || null;
  })();

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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    name: title,
    brand: { '@type': 'Brand', name: v.make },
    model: v.model,
    modelDate: String(v.year),
    ...(v.vin ? { vehicleIdentificationNumber: v.vin } : {}),
    ...(v.engineVolumeL ? { engineDisplacement: { '@type': 'QuantitativeValue', value: v.engineVolumeL, unitCode: 'LTR' } } : {}),
    ...(gallery[0] ? { image: gallery[0] } : {}),
    ...(v.displayedPrice != null ? {
      offers: {
        '@type': 'Offer',
        price: v.displayedPrice,
        priceCurrency: v.currency || 'USD',
        availability: 'https://schema.org/InStock',
        seller: { '@type': 'Organization', name: 'Auto Market' },
      },
    } : {}),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <H1 style={{ fontSize: 34 }}>{title}</H1>
      <div style={{ height: 14 }} />

      <Gallery images={gallery} />

      <div style={{ height: 16 }} />

      <LotPageGrid>
        <div>
          <Card>
            <CardBody>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <div>
                  <H2>{t('lot.price')}</H2>
                  <LotPrice>{price}</LotPrice>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  {bodyLabel ? <Badge>{bodyLabel}</Badge> : null}
                  {v.engineVolumeL ? <Badge>{v.engineVolumeL.toFixed(1)}L</Badge> : null}
                  {fuelLabel ? <Badge>{fuelLabel}</Badge> : null}
                </div>
              </div>

              <Hr />

              <LotSpecGrid>
                <Spec label={t('lot.specs.year')} value={String(v.year)} />
                <Spec label={t('lot.specs.body')} value={bodyLabel || '—'} />
                <Spec label={t('lot.specs.engine')} value={v.engineVolumeL ? `${v.engineVolumeL.toFixed(1)}L` : '—'} />
                <Spec label={t('lot.specs.fuel')} value={fuelLabel || '—'} />
                <Spec label={t('lot.specs.drive')} value={driveLabel || '—'} />
                <Spec label={t('lot.specs.transmission')} value={transLabel || '—'} />
                <Spec label={t('lot.specs.color')} value={v.color || '—'} />
                <Spec label={t('lot.specs.vin')} value={v.vin || '—'} />
              </LotSpecGrid>

            </CardBody>
          </Card>

          <div style={{ height: 18 }} />
          <H2>{t('lot.descTitle')}</H2>
          <div style={{ height: 12 }} />
          <Card>
            <CardBody>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <P style={{ margin: 0 }}>
                  {t('lot.descIntro', {
                    title,
                    odometer: v.odometerReading
                      ? `${v.odometerReading.toLocaleString()} ${v.odometerUnit ?? ''}`
                      : '—'
                  })}
                </P>
                <P style={{ margin: 0, fontWeight: 600 }}>
                  {t('lot.descBuy', { title })}
                </P>
                <P style={{ margin: 0 }}>{t('lot.descDelivery')}</P>
                <P style={{ margin: 0 }}>{t('lot.descCarfax')}</P>
                <P style={{ margin: 0, color: 'var(--muted)' }}>{t('lot.descAbout')}</P>
              </div>
            </CardBody>
          </Card>

          {similar.length > 0 && (
            <>
              <div style={{ height: 18 }} />
              <H2>{t('lot.similar')}</H2>
              <div style={{ height: 12 }} />
              <CardsGrid>
                {similar.map((it) => (
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
                      currency: it.currency
                    }}
                  />
                ))}
              </CardsGrid>
            </>
          )}
        </div>

        <div>
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
      </LotPageGrid>

    </div>
  );
}

function formatMoney(v: number) {
  return v.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 14, padding: 12, background: '#F8FAFC' }}>
      <div style={{ fontSize: 12, color: 'var(--muted)' }}>{label}</div>
      <div style={{ fontWeight: 800, marginTop: 6, color: 'var(--text)', wordBreak: 'break-all' }}>{value}</div>
    </div>
  );
}
