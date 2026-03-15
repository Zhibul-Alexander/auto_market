export const runtime = 'edge';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '../../../lib/i18n/routing';
import { H2, P, Card, CardBody, Hr } from '../../../components/ui';

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

export default async function PrivacyPage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale });

  const sections = [
    { title: t('privacy.s1Title'), body: t('privacy.s1Body'), items: [] as string[] },
    { title: t('privacy.s2Title'), body: t('privacy.s2Body'), items: tList(t, 'privacy.s2Items') },
    { title: t('privacy.s3Title'), body: t('privacy.s3Body'), items: tList(t, 'privacy.s3Items') },
    { title: t('privacy.s4Title'), body: t('privacy.s4Body'), items: tList(t, 'privacy.s4Items') },
    { title: t('privacy.s5Title'), body: t('privacy.s5Body'), items: [] as string[] },
    { title: t('privacy.s6Title'), body: t('privacy.s6Body'), items: tList(t, 'privacy.s6Items') },
    { title: t('privacy.s7Title'), body: t('privacy.s7Body'), items: tList(t, 'privacy.s7Items') },
    { title: t('privacy.s8Title'), body: t('privacy.s8Body'), items: [] as string[] },
    { title: t('privacy.s9Title'), body: t('privacy.s9Body'), items: [] as string[] },
    { title: t('privacy.s10Title'), body: t('privacy.s10Body'), items: [] as string[] },
  ];

  return (
    <Card>
      <CardBody>
        <H2>{t('privacy.title')}</H2>
        <p style={{ color: 'var(--muted)', fontSize: 13, margin: '6px 0 0' }}>{t('privacy.lastUpdated')}</p>
        {sections.map((s, i) => (
          <div key={i}>
            <Hr />
            <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>{s.title}</h3>
            <P>{s.body}</P>
            {s.items.length > 0 && (
              <ul style={{ margin: '10px 0 0 20px', padding: 0, color: 'var(--muted)', lineHeight: 1.7 }}>
                {s.items.map((item, j) => (
                  <li key={j} style={{ marginBottom: 4 }}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
