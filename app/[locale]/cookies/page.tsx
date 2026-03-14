export const runtime = 'edge';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '../../../lib/i18n/routing';
import { H2, P, Card, CardBody, Hr } from '../../../components/ui';

export default async function CookiesPage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale });

  return (
    <Card>
      <CardBody>
        <H2>{t('cookies.title')}</H2>
        <div style={{ height: 10 }} />
        <P>{t('cookies.body1')}</P>
        <Hr />
        <P>{t('cookies.body2')}</P>
      </CardBody>
    </Card>
  );
}
