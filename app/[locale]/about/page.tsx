import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '../../../lib/i18n/routing';
import { H1, H2, P, Card, CardBody, Grid, Badge, Hr } from '../../../components/ui';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'about' });
  return { title: t('title') };
}

export default async function AboutPage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale });

  const stats = [
    { label: t('about.stats.vehicles'), value: t('about.stats.vehiclesValue') },
    { label: t('about.stats.clients'), value: t('about.stats.clientsValue') },
    { label: t('about.stats.experience'), value: t('about.stats.experienceValue') },
    { label: t('about.stats.cities'), value: t('about.stats.citiesValue') }
  ];

  const whyItems: string[] = [];
  for (let i = 0; i < 20; i++) {
    if (!t.has(`about.whyItems.${i}`)) break;
    whyItems.push(t(`about.whyItems.${i}`));
  }

  const howSteps: string[] = [];
  for (let i = 0; i < 20; i++) {
    if (!t.has(`about.howSteps.${i}`)) break;
    howSteps.push(t(`about.howSteps.${i}`));
  }

  return (
    <div>
      <H1>{t('about.title')}</H1>
      <P style={{ marginTop: 12, fontSize: 18, maxWidth: 700 }}>{t('about.subtitle')}</P>
      <div style={{ height: 16 }} />
      <P style={{ maxWidth: 800, lineHeight: 1.8 }}>{t('about.intro')}</P>

      <div style={{ height: 32 }} />
      <H2>{t('about.statsTitle')}</H2>
      <div style={{ height: 16 }} />
      <Grid>
        {stats.map((s) => (
          <div key={s.label} style={{ gridColumn: 'span 3' }}>
            <Card>
              <CardBody style={{ textAlign: 'center', padding: 24 }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--accent)' }}>{s.value}</div>
                <P style={{ marginTop: 8 }}>{s.label}</P>
              </CardBody>
            </Card>
          </div>
        ))}
      </Grid>

      <div style={{ height: 32 }} />
      <H2>{t('about.whyTitle')}</H2>
      <div style={{ height: 16 }} />
      <Grid>
        {whyItems.map((item, i) => (
          <div key={i} style={{ gridColumn: 'span 6' }}>
            <Card>
              <CardBody style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <Badge style={{ flexShrink: 0, background: 'var(--accent)', color: '#120700', fontWeight: 800 }}>
                  {i + 1}
                </Badge>
                <P style={{ color: 'var(--text)' }}>{item}</P>
              </CardBody>
            </Card>
          </div>
        ))}
      </Grid>

      <div style={{ height: 32 }} />
      <H2>{t('about.howTitle')}</H2>
      <div style={{ height: 16 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {howSteps.map((step, i) => (
          <Card key={i}>
            <CardBody style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%', background: 'var(--accent)',
                color: '#120700', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: 18, flexShrink: 0
              }}>
                {i + 1}
              </div>
              <P style={{ color: 'var(--text)', paddingTop: 8 }}>{step}</P>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
