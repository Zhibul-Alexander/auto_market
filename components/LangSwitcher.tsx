'use client';

import Link from 'next/link';
import styled from 'styled-components';

const Wrap = styled.div`
  display: flex;
  gap: 6px;
  padding: 4px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: #F8FAFC;
`;

const Item = styled.span<{ $active?: boolean }>`
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  color: ${(p) => (p.$active ? '#FFFFFF' : 'var(--muted)')};
  background: ${(p) => (p.$active ? 'var(--accent)' : 'transparent')};
  transition: color 120ms ease, background 120ms ease;
  user-select: none;
  border: none;
  outline: none;
  line-height: 1;
  font-family: inherit;
`;

type LangEntry =
  | { label: string; active: boolean; href: string; onClick?: never }
  | { label: string; active: boolean; onClick: () => void; href?: never };

export default function LangSwitcher({ items }: { items: LangEntry[] }) {
  return (
    <Wrap aria-label="Language switcher">
      {items.map((item) =>
        item.href != null ? (
          <Item key={item.label} $active={item.active} as={Link} href={item.href}>
            {item.label}
          </Item>
        ) : (
          <Item key={item.label} $active={item.active} as="button" onClick={item.onClick}>
            {item.label}
          </Item>
        )
      )}
    </Wrap>
  );
}
