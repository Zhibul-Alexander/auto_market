export const runtime = 'edge';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '../../../../lib/i18n/routing';
import { H1, H2, P, Card, CardBody, Grid, Badge, Hr } from '../../../../components/ui';
import LeadForm from '../../../../components/LeadForm';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'services.delivery' });
  return { title: t('title') };
}

function tList(t: any, prefix: string, max = 20): string[] {
  const arr: string[] = [];
  for (let i = 0; i < max; i++) {
    const key = `${prefix}.${i}`;
    const val = t.has(key) ? t(key) : null;
    if (val === null) break;
    arr.push(val);
  }
  return arr;
}

export default async function DeliveryPage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale });

  const steps = tList(t, 'services.delivery.steps');
  const routes = tList(t, 'services.delivery.routes');
  const includes = tList(t, 'services.delivery.includes');
  const benefits = tList(t, 'services.delivery.benefits');

  return (
    <div>
      <H1>{t('services.delivery.title')}</H1>
      <P style={{ marginTop: 12, fontSize: 18, maxWidth: 700 }}>{t('services.delivery.subtitle')}</P>
      <div style={{ height: 16 }} />
      <P style={{ maxWidth: 800, lineHeight: 1.8 }}>{t('services.delivery.intro')}</P>

      <div style={{ height: 32 }} />
      <H2>{t('services.delivery.stepsTitle')}</H2>
      <div style={{ height: 16 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {steps.map((step, i) => (
          <Card key={i}>
            <CardBody style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', background: 'var(--accent)',
                color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, flexShrink: 0
              }}>
                {i + 1}
              </div>
              <P style={{ color: 'var(--text)', paddingTop: 6 }}>{step}</P>
            </CardBody>
          </Card>
        ))}
      </div>

      <div style={{ height: 32 }} />
      <Grid>
        <div style={{ gridColumn: 'span 6' }}>
          <H2>{t('services.delivery.routesTitle')}</H2>
          <div style={{ height: 8 }} />
          <P style={{ lineHeight: 1.7 }}>{t('services.delivery.routesIntro')}</P>
          <div style={{ height: 12 }} />
          <Card>
            <CardBody>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {routes.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Badge style={{ flexShrink: 0, background: 'var(--accent)', color: '#FFFFFF', fontWeight: 800 }}>🚢</Badge>
                    <P style={{ color: 'var(--text)' }}>{r}</P>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
        <div style={{ gridColumn: 'span 6' }}>
          <H2>{t('services.delivery.includesTitle')}</H2>
          <div style={{ height: 8 }} />
          <P style={{ lineHeight: 1.7, color: 'transparent' }}>‎</P>
          <div style={{ height: 12 }} />
          <Card>
            <CardBody>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {includes.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Badge style={{ flexShrink: 0 }}>✓</Badge>
                    <P style={{ color: 'var(--text)' }}>{item}</P>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </Grid>

      <div style={{ height: 32 }} />
      <H2>{t('services.delivery.benefitsTitle')}</H2>
      <div style={{ height: 16 }} />
      <Grid>
        {benefits.map((b, i) => (
          <div key={i} style={{ gridColumn: 'span 6' }}>
            <Card>
              <CardBody style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Badge style={{ background: 'var(--accent)', color: '#FFFFFF', fontWeight: 800 }}>✓</Badge>
                <P style={{ color: 'var(--text)' }}>{b}</P>
              </CardBody>
            </Card>
          </div>
        ))}
      </Grid>

      <div style={{ height: 32 }} />
      <Hr />
      <div style={{ height: 16 }} />
      <Grid>
        <div style={{ gridColumn: 'span 8' }}>
          <H2>{t('services.ctaTitle')}</H2>
          <P style={{ marginTop: 8 }}>{t('services.ctaText')}</P>
        </div>
        <div style={{ gridColumn: 'span 4' }}>
          <LeadForm
            type="service"
            locale={params.locale}
            pageUrl={`/${params.locale}/services/delivery`}
            serviceSlug="delivery"
            title={t('services.leadTitle')}
          />
        </div>
      </Grid>
    </div>
  );
}
