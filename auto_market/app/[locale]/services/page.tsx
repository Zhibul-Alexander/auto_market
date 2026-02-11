import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '../../../lib/i18n/routing';
import Link from 'next/link';
import { Card, CardBody, H2, P, Grid, Button } from '../../../components/ui';
import { listServices, upsertDefaultServicesIfEmpty } from '../../../lib/server/services';

export default async function ServicesPage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale });

  await upsertDefaultServicesIfEmpty();
  const services = await listServices(params.locale);

  return (
    <div>
      <H2>{t('services.title')}</H2>
      <P style={{ marginTop: 8 }}>{t('services.subtitle')}</P>
      <div style={{ height: 12 }} />

      <Grid>
        {services.map((s) => (
          <div key={s.slug} style={{ gridColumn: 'span 6' }}>
            <Link href={`/${params.locale}/services/${s.slug}`}>
              <Card>
                <CardBody>
                  <H2>{s.title}</H2>
                  <P style={{ marginTop: 10 }}>{t('services.openHint')}</P>
                  <div style={{ height: 14 }} />
                  <Button $variant="primary">{t('services.open')}</Button>
                </CardBody>
              </Card>
            </Link>
          </div>
        ))}
      </Grid>
    </div>
  );
}
