import Link from 'next/link';
import styled from 'styled-components';
import { Card, CardBody, Badge } from './ui';
import type { Locale } from '../lib/i18n/routing';
import { getTranslations } from 'next-intl/server';

const Img = styled.div<{ $url?: string | null }>`
  width: 100%;
  aspect-ratio: 16 / 10;
  background: ${(p) =>
    p.$url
      ? `linear-gradient(180deg, rgba(0,0,0,0.0), rgba(0,0,0,0.55)), url(${p.$url}) center/cover no-repeat`
      : 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))'};
  border-bottom: 1px solid var(--border);
`;

const Title = styled.div`
  font-weight: 800;
  font-size: 16px;
  line-height: 1.25;
`;

const Meta = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 10px;
`;

const Price = styled.div`
  margin-top: 12px;
  font-weight: 900;
  font-size: 18px;
`;

export default async function LotCard({
  locale,
  item
}: {
  locale: Locale;
  item: {
    slug: string;
    year: number;
    make: string;
    model: string;
    trim?: string | null;
    fullModelName?: string | null;
    thumbUrl?: string | null;
    bodyType?: string | null;
    engineVolumeL?: number | null;
    displayedPrice?: number | null;
    currency?: string | null;
  };
}) {
  const t = await getTranslations({ locale });

  const title =
    item.fullModelName?.trim() ||
    `${item.year} ${item.make} ${item.model}${item.trim ? ` ${item.trim}` : ''}`.trim();

  const price = item.displayedPrice != null ? `${formatMoney(item.displayedPrice)} ${item.currency || 'USD'}` : t('common.priceOnRequest');

  return (
    <Link href={`/${locale}/lot/${item.slug}`} aria-label={title}>
      <Card>
        <Img $url={item.thumbUrl} />
        <CardBody>
          <Title>{title}</Title>
          <Meta>
            {item.bodyType ? <Badge>{item.bodyType}</Badge> : null}
            {item.engineVolumeL ? <Badge>{item.engineVolumeL.toFixed(1)}L</Badge> : null}
          </Meta>
          <Price>{price}</Price>
        </CardBody>
      </Card>
    </Link>
  );
}

function formatMoney(v: number) {
  return v.toLocaleString(undefined, { maximumFractionDigits: 0 });
}
