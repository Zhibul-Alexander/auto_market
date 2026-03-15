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

export default async function CookiesPage({ params }: { params: { locale: Locale } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations({ locale: params.locale });

  const sections = [
    { title: t('cookies.s1Title'), body: t('cookies.s1Body'), items: [] as string[] },
    { title: t('cookies.s2Title'), body: t('cookies.s2Body'), items: tList(t, 'cookies.s2Items') },
    { title: t('cookies.s3Title'), body: t('cookies.s3Body'), items: tList(t, 'cookies.s3Items') },
    { title: t('cookies.s4Title'), body: t('cookies.s4Body'), items: [] as string[] },
    { title: t('cookies.s5Title'), body: t('cookies.s5Body'), items: tList(t, 'cookies.s5Items') },
    { title: t('cookies.s6Title'), body: t('cookies.s6Body'), items: [] as string[] },
  ];

  return (
    <Card>
      <CardBody>
        <H2>{t('cookies.title')}</H2>
        <p style={{ color: 'var(--muted)', fontSize: 13, margin: '6px 0 0' }}>{t('cookies.lastUpdated')}</p>
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
