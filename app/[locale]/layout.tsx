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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com')
};

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
