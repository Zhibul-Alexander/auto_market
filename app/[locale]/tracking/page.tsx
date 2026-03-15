export const runtime = 'edge';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { locales, type Locale } from '../../../lib/i18n/routing';

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'tracking' });
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: {
      canonical: `/${params.locale}/tracking`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/tracking`])),
    },
  };
}
import TrackingForm from '../../../components/TrackingForm';
import { P } from '../../../components/ui';
import Link from 'next/link';

export default async function TrackingPage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale });

  return (
    <div>
      <TrackingForm locale={params.locale} />
      <div style={{ height: 12 }} />
      <P style={{ fontSize: 13 }}>
        {t('tracking.help')}{' '}
        <Link href={`/${params.locale}/contacts`} style={{ color: 'var(--accent)' }}>
          {t('nav.contacts')}
        </Link>
      </P>
    </div>
  );
}
