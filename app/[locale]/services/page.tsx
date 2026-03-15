export const runtime = 'edge';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { locales, type Locale } from '../../../lib/i18n/routing';

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'services' });
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: {
      canonical: `/${params.locale}/services`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/services`])),
    },
  };
}
import Link from 'next/link';
import { Card, CardBody, H2, P, TwoColGrid, Button } from '../../../components/ui';

export default async function ServicesPage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale });

  const services = [
    {
      slug: 'customs',
      href: `/${params.locale}/services/customs`,
      title: t('services.customs.title'),
      subtitle: t('services.customs.subtitle')
    },
    {
      slug: 'delivery',
      href: `/${params.locale}/services/delivery`,
      title: t('services.delivery.title'),
      subtitle: t('services.delivery.subtitle')
    }
  ];

  return (
    <div>
      <H2>{t('services.title')}</H2>
      <P style={{ marginTop: 8 }}>{t('services.subtitle')}</P>
      <div style={{ height: 12 }} />

      <TwoColGrid>
        {services.map((s) => (
          <Link key={s.slug} href={s.href}>
            <Card>
              <CardBody>
                <H2>{s.title}</H2>
                <P style={{ marginTop: 10 }}>{s.subtitle}</P>
                <div style={{ height: 14 }} />
                <Button $variant="primary">{t('services.open')}</Button>
              </CardBody>
            </Card>
          </Link>
        ))}
      </TwoColGrid>
    </div>
  );
}
