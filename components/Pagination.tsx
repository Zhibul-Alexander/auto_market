'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import { useTranslations } from 'next-intl';

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  margin-top: 18px;
  flex-wrap: wrap;
`;

const PageBtn = styled.a<{ $active?: boolean; $disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 6px;
  border-radius: 8px;
  border: 1px solid ${(p) => (p.$active ? '#FF6B35' : 'var(--border)')};
  background: ${(p) => (p.$active ? '#FF6B35' : '#F8FAFC')};
  color: ${(p) => (p.$active ? '#fff' : p.$disabled ? 'var(--border)' : 'var(--text)')};
  font-size: 13px;
  font-weight: ${(p) => (p.$active ? 700 : 400)};
  cursor: ${(p) => (p.$disabled ? 'default' : 'pointer')};
  pointer-events: ${(p) => (p.$disabled ? 'none' : 'auto')};
  text-decoration: none;
  transition: all 100ms ease;
  user-select: none;

  &:hover {
    border-color: ${(p) => (p.$active || p.$disabled ? undefined : '#FF6B35')};
    color: ${(p) => (p.$active || p.$disabled ? undefined : '#FF6B35')};
  }
`;

const Dots = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  font-size: 13px;
  color: var(--muted);
  user-select: none;
`;


function withPage(pathname: string, searchParams: URLSearchParams, page: number) {
  const sp = new URLSearchParams(searchParams.toString());
  sp.set('page', String(page));
  return `${pathname}?${sp.toString()}`;
}

function buildPages(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | '…')[] = [1];

  if (current > 3) pages.push('…');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push('…');

  pages.push(total);
  return pages;
}

export default function Pagination({
  total,
  page,
  pageSize,
}: {
  total: number;
  page: number;
  pageSize: number;
}) {
  const t = useTranslations('common');
  const pathname = usePathname() || '';
  const sp = useSearchParams();
  const params = new URLSearchParams(sp?.toString() || '');

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (total === 0 || totalPages <= 1) return null;

  const pages = buildPages(page, totalPages);

  return (
    <>
      <Wrap>
        {/* Prev */}
        <PageBtn
          as={Link}
          href={withPage(pathname, params, page - 1)}
          $disabled={page === 1}
          aria-label={t('prev')}
        >
          ‹
        </PageBtn>

        {pages.map((p, i) =>
          p === '…' ? (
            <Dots key={`dots-${i}`}>…</Dots>
          ) : (
            <PageBtn
              key={p}
              as={Link}
              href={withPage(pathname, params, p)}
              $active={p === page}
            >
              {p}
            </PageBtn>
          )
        )}

        {/* Next */}
        <PageBtn
          as={Link}
          href={withPage(pathname, params, page + 1)}
          $disabled={page === totalPages}
          aria-label={t('next')}
        >
          ›
        </PageBtn>
      </Wrap>
    </>
  );
}
