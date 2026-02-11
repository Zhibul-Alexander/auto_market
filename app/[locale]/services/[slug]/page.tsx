export const runtime = 'edge';

import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '../../../../lib/i18n/routing';
import { getService } from '../../../../lib/server/services';
import ServiceBlocks from '../../../../components/ServiceBlocks';
import LeadForm from '../../../../components/LeadForm';
import { Grid, H2, P } from '../../../../components/ui';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: Locale; slug: string } }): Promise<Metadata> {
  return {
    title: params.slug,
    alternates: { canonical: `/${params.locale}/services/${params.slug}` }
  };
}

export default async function ServiceDetail({ params }: { params: { locale: Locale; slug: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale });

  let svc;
  try {
    svc = await getService(params.slug, params.locale);
  } catch (err) {
    console.error('[ServiceDetail] DB error:', err);
  }
  if (!svc) return notFound();

  return (
    <div>
      <ServiceBlocks blocks={svc.blocks} />
      <div style={{ height: 18 }} />

      <Grid>
        <div style={{ gridColumn: 'span 8' }}>
          <H2>{t('services.ctaTitle')}</H2>
          <P style={{ marginTop: 8 }}>{t('services.ctaText')}</P>
        </div>
        <div style={{ gridColumn: 'span 4' }}>
          <LeadForm
            type="service"
            locale={params.locale}
            pageUrl={`/${params.locale}/services/${svc.slug}`}
            serviceSlug={svc.slug}
            title={t('services.leadTitle')}
          />
        </div>
      </Grid>
    </div>
  );
}
