export const runtime = 'edge';

import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import type { Locale } from '../../lib/i18n/routing';
import { listVehicles } from '../../lib/server/vehicles';
import HomePageContent from '../../components/HomePageContent';

export default async function HomePage({ params }: { params: { locale: Locale } }) {
  unstable_setRequestLocale(params.locale);

  try {
    const t = await getTranslations({ locale: params.locale });

    let freshRows: {
      id: number;
      slug: string;
      year: number;
      make: string;
      model: string;
      trim: string | null;
      fullModelName: string | null;
      thumbUrl: string | null;
      bodyType: string | null;
      engineVolumeL: number | null;
      odometerReading: number | null;
      odometerUnit: string | null;
      driveType: string | null;
      fuelType: string | null;
      displayedPrice: number | null;
      currency: string | null;
    }[] = [];

    try {
      const fresh = await listVehicles({
        filters: { category: 'cars' },
        sort: 'newest',
        page: 1,
        pageSize: 6
      });

      freshRows = fresh.rows.map((row) => ({
        id: row.id,
        slug: row.slug,
        year: row.year,
        make: row.make,
        model: row.model,
        trim: row.trim ?? null,
        fullModelName: row.fullModelName ?? null,
        thumbUrl: row.thumbUrl ?? null,
        bodyType: row.bodyType ?? null,
        engineVolumeL: row.engineVolumeL ?? null,
        odometerReading: row.odometerReading ?? null,
        odometerUnit: row.odometerUnit ?? null,
        driveType: row.driveType ?? null,
        fuelType: row.fuelType ?? null,
        displayedPrice: row.displayedPrice ?? null,
        currency: row.currency ?? null
      }));
    } catch (dbErr) {
      console.error('[HomePage] Failed to load vehicles:', dbErr);
    }

    const tStrings = {
      title: t('home.title'),
      subtitle: t('home.subtitle'),
      ctaBrowse: t('home.ctaBrowse'),
      navServices: t('nav.services'),
      priceRule: t('home.priceRule'),
      leadTitle: t('home.leadTitle'),
      freshLots: t('home.freshLots'),
      stepsTitle: t('home.stepsTitle'),
      steps: t('home.steps'),
      faqTitle: t('home.faqTitle'),
      faq: t('home.faq'),
      cta: t('common.cta')
    };

    const payload = JSON.parse(
      JSON.stringify({ locale: params.locale, freshRows, t: tStrings })
    );

    return (
      <HomePageContent
        locale={payload.locale}
        freshRows={payload.freshRows}
        t={payload.t}
      />
    );
  } catch (err) {
    console.error('[HomePage] Render error:', err);
    return (
      <div style={{ padding: 40 }}>
        <h1>Ошибка загрузки страницы</h1>
        <p>Попробуйте обновить страницу.</p>
      </div>
    );
  }
}
