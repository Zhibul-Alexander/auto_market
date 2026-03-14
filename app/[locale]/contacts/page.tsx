export const runtime = 'edge';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '../../../lib/i18n/routing';
import { Grid, H2, P, Card, CardBody, Badge, Hr } from '../../../components/ui';
import LeadForm from '../../../components/LeadForm';
import OfficesList from '../../../components/OfficesList';

export default async function ContactsPage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale });

  return (
    <div>
      <Grid>
        <div style={{ gridColumn: 'span 7' }}>
          <H2>{t('contacts.title')}</H2>
          <P style={{ marginTop: 8 }}>{t('contacts.subtitle')}</P>

          <div style={{ height: 12 }} />
          <Card>
            <CardBody>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Badge>{t('contacts.city')}</Badge>
                <Badge>{t('contacts.hours')}</Badge>
                <Badge>{t('contacts.response')}</Badge>
              </div>
              <div style={{ height: 12 }} />
              <P style={{ color: 'var(--text)' }}>{t('contacts.note')}</P>
            </CardBody>
          </Card>

          <div style={{ height: 20 }} />
          <OfficesList title={t('contacts.offices')} />
        </div>

        <div style={{ gridColumn: 'span 5' }}>
          <LeadForm
            type="contact"
            locale={params.locale}
            pageUrl={`/${params.locale}/contacts`}
            title={t('contacts.leadTitle')}
          />
        </div>
      </Grid>
    </div>
  );
}
