import { NextIntlClientProvider, useMessages } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
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
  setRequestLocale(params.locale);
  const messages = useMessages();

  return (
    <NextIntlClientProvider locale={params.locale} messages={messages}>
      <Header locale={params.locale} />
      <main>
        <Container style={{ paddingTop: 28, paddingBottom: 56 }}>{children}</Container>
      </main>
      <Footer locale={params.locale} />
    </NextIntlClientProvider>
  );
}
