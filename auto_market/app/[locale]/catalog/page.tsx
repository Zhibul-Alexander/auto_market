import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '../../../lib/i18n/routing';
import Link from 'next/link';
import { Card, CardBody, H2, P, Grid, Button } from '../../../components/ui';

export default async function CatalogHub({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale });

  const items = [
    { href: `/${params.locale}/catalog/cars`, title: t('catalog.cars'), desc: t('catalog.carsDesc') },
    { href: `/${params.locale}/catalog/moto`, title: t('catalog.moto'), desc: t('catalog.motoDesc') },
    { href: `/${params.locale}/catalog/water`, title: t('catalog.water'), desc: t('catalog.waterDesc') },
    { href: `/${params.locale}/catalog/special`, title: t('catalog.special'), desc: t('catalog.specialDesc') }
  ];

  return (
    <div>
      <H2>{t('catalog.hubTitle')}</H2>
      <div style={{ height: 12 }} />
      <Grid>
        {items.map((it) => (
          <div key={it.href} style={{ gridColumn: 'span 6' }}>
            <Link href={it.href}>
              <Card>
                <CardBody>
                  <H2>{it.title}</H2>
                  <P style={{ marginTop: 10 }}>{it.desc}</P>
                  <div style={{ height: 14 }} />
                  <Button $variant="primary">{t('catalog.open')}</Button>
                </CardBody>
              </Card>
            </Link>
          </div>
        ))}
      </Grid>
    </div>
  );
}
