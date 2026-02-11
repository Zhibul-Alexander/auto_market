'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import { Button } from './ui';

const Wrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 18px;
`;

const Info = styled.div`
  color: var(--muted);
  font-size: 13px;
`;

function withPage(pathname: string, searchParams: URLSearchParams, page: number) {
  const sp = new URLSearchParams(searchParams.toString());
  sp.set('page', String(page));
  return `${pathname}?${sp.toString()}`;
}

export default function Pagination({
  total,
  page,
  pageSize
}: {
  total: number;
  page: number;
  pageSize: number;
}) {
  const pathname = usePathname() || '';
  const sp = useSearchParams();
  const params = new URLSearchParams(sp?.toString() || '');

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const prev = Math.max(1, page - 1);
  const next = Math.min(totalPages, page + 1);

  return (
    <Wrap>
      <Info>
        {total.toLocaleString()} items · page {page}/{totalPages}
      </Info>
      <div style={{ display: 'flex', gap: 10 }}>
        <Link href={withPage(pathname, params, prev)} aria-disabled={page === 1} tabIndex={page === 1 ? -1 : 0}>
          <Button disabled={page === 1}>Prev</Button>
        </Link>
        <Link href={withPage(pathname, params, next)} aria-disabled={page === totalPages} tabIndex={page === totalPages ? -1 : 0}>
          <Button disabled={page === totalPages}>Next</Button>
        </Link>
      </div>
    </Wrap>
  );
}
