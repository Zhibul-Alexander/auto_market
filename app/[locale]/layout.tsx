import { NextIntlClientProvider, useMessages } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { locales, type Locale } from '../../lib/i18n/routing';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Container } from '../../components/ui';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const ogLocaleMap: Record<string, string> = { ge: 'ka_GE', ru: 'ru_RU', en: 'en_US' };

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'),
    openGraph: {
      locale: ogLocaleMap[params.locale],
      alternateLocale: locales.filter((l) => l !== params.locale).map((l) => ogLocaleMap[l]),
    },
  };
}

export default function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  unstable_setRequestLocale(params.locale);
  const rawMessages = useMessages();
  // Plain object для надёжной сериализации в клиент (избегаем WeakMap-ошибки)
  const messages =
    typeof rawMessages === 'object' && rawMessages !== null
      ? JSON.parse(JSON.stringify(rawMessages))
      : rawMessages;

  return (
    <NextIntlClientProvider locale={params.locale} messages={messages}>
      <Suspense fallback={null}><Header locale={params.locale} /></Suspense>
      <main>
        <Container style={{ paddingTop: 28, paddingBottom: 56 }}>{children}</Container>
      </main>
      <Footer locale={params.locale} />
    </NextIntlClientProvider>
  );
}
