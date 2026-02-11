import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '../../lib/i18n/routing';
import { H1, H2, P, Grid, Card, CardBody, Button, Hr } from '../../components/ui';
import styled from 'styled-components';
import Link from 'next/link';
import { listVehicles } from '../../lib/server/vehicles';
import LotCard from '../../components/LotCard';
import LeadForm from '../../components/LeadForm';

const Hero = styled.section`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 18px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.div`
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 18px;
  background: radial-gradient(1000px 400px at 20% 10%, rgba(255,107,53,0.16), transparent 50%),
              rgba(255,255,255,0.02);
`;

export default async function HomePage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale });

  const fresh = await listVehicles({
    filters: { category: 'cars' },
    sort: 'newest',
    page: 1,
    pageSize: 6
  });

  return (
    <div>
      <Hero>
        <Panel>
          <H1>{t('home.title')}</H1>
          <P style={{ marginTop: 12 }}>{t('home.subtitle')}</P>
          <div style={{ height: 16 }} />
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link href={`/${params.locale}/catalog/cars`}>
              <Button $variant="primary">{t('home.ctaBrowse')}</Button>
            </Link>
            <Link href={`/${params.locale}/services`}>
              <Button>{t('nav.services')}</Button>
            </Link>
          </div>

          <div style={{ height: 16 }} />
          <Hr />
          <P style={{ fontSize: 13 }}>{t('home.priceRule')}</P>
        </Panel>

        <LeadForm
          type="general"
          locale={params.locale}
          pageUrl={`/${params.locale}`}
          title={t('home.leadTitle')}
        />
      </Hero>

      <div style={{ height: 26 }} />

      <H2>{t('home.freshLots')}</H2>
      <div style={{ height: 12 }} />

      <Grid>
        {fresh.rows.map((it) => (
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
                displayedPrice: it.displayedPrice,
                currency: it.currency
              }}
            />
          </div>
        ))}
      </Grid>

      <div style={{ height: 26 }} />

      <Grid>
        <div style={{ gridColumn: 'span 6' }}>
          <Card>
            <CardBody>
              <H2>{t('home.stepsTitle')}</H2>
              <div style={{ height: 10 }} />
              <P>{t('home.steps')}</P>
            </CardBody>
          </Card>
        </div>
        <div style={{ gridColumn: 'span 6' }}>
          <Card>
            <CardBody>
              <H2>{t('home.faqTitle')}</H2>
              <div style={{ height: 10 }} />
              <P>{t('home.faq')}</P>
              <div style={{ height: 12 }} />
              <Link href={`/${params.locale}/contacts`}>
                <Button $variant="primary">{t('common.cta')}</Button>
              </Link>
            </CardBody>
          </Card>
        </div>
      </Grid>
    </div>
  );
}
