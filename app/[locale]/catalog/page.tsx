import { redirect } from 'next/navigation';
import type { Locale } from '../../../lib/i18n/routing';

export default function CatalogHub({ params }: { params: { locale: Locale } }) {
  redirect(`/${params.locale}/catalog/cars`);
}
