'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { useTranslations } from 'next-intl';
import { Card, CardBody, Badge } from './ui';
import type { Locale } from '../lib/i18n/routing';

const ImgWrap = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: #F1F5F9;
  border-bottom: 1px solid var(--border);
`;

const ImgTag = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImgOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.45) 100%);
  pointer-events: none;
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
  font-weight: 700;
  font-size: 18px;
  color: #FF6B35;
`;

export default function LotCard({
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
    odometerReading?: number | null;
    odometerUnit?: string | null;
    driveType?: string | null;
    fuelType?: string | null;
    displayedPrice?: number | null;
    buyItNow?: number | null;
    estRetail?: number | null;
    currency?: string | null;
  };
}) {
  const t = useTranslations();

  const estimatedPrice = computeEstimatedPrice(item.displayedPrice, item.buyItNow, item.estRetail);
  const price = estimatedPrice != null ? `${formatMoney(estimatedPrice)} ${item.currency || 'USD'}` : t('common.priceOnRequest');

  const title =
    `${item.year} ${item.make} ${item.model}${item.trim ? ` ${item.trim}` : ''}`.trim();

  const odometer = item.odometerReading != null
    ? `${formatMoney(item.odometerReading)} ${item.odometerUnit || 'mi'}`
    : null;

  return (
    <Link href={`/${locale}/lot/${item.slug}`} aria-label={title}>
      <Card>
        <ImgWrap>
          {item.thumbUrl && <ImgTag src={item.thumbUrl} alt={title} loading="lazy" />}
          <ImgOverlay />
        </ImgWrap>
        <CardBody>
          <Title>{title}</Title>
          <Meta>
            <Badge>{item.year}</Badge>
            {odometer ? <Badge>{odometer}</Badge> : null}
            {item.engineVolumeL ? <Badge>{item.engineVolumeL.toFixed(1)}L</Badge> : null}
            {item.driveType ? <Badge>{item.driveType.toUpperCase()}</Badge> : null}
            {item.fuelType ? <Badge>{item.fuelType}</Badge> : null}
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

function computeEstimatedPrice(displayedPrice: number | null | undefined, buyItNow: number | null | undefined, estRetail: number | null | undefined): number | null {
  const b = buyItNow != null && buyItNow > 0 ? buyItNow : null;
  const e = estRetail != null && estRetail > 0 ? estRetail : null;

  if (displayedPrice != null && displayedPrice > 0) return displayedPrice;
  if (b && e) return Math.round(Math.min(0.65 * e, 0.70 * b) * 100) / 100;
  if (b) return Math.round(0.70 * b * 100) / 100;
  if (e) return Math.round(0.65 * e * 100) / 100;
  return null;
}
