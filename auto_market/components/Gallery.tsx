'use client';

import { useMemo, useState } from 'react';
import styled from 'styled-components';

const Wrap = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.6fr;
  gap: 12px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Main = styled.div<{ $url?: string }>`
  aspect-ratio: 16 / 10;
  border-radius: 16px;
  border: 1px solid var(--border);
  background: ${(p) =>
    p.$url
      ? `linear-gradient(180deg, rgba(0,0,0,0.0), rgba(0,0,0,0.55)), url(${p.$url}) center/cover no-repeat`
      : 'rgba(255,255,255,0.04)'};
  overflow: hidden;
`;

const Thumbs = styled.div`
  display: grid;
  grid-auto-rows: minmax(60px, 1fr);
  gap: 10px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(6, 1fr);
    grid-auto-rows: 60px;
    overflow-x: auto;
  }
`;

const Thumb = styled.button<{ $url?: string; $active?: boolean }>`
  border: 1px solid ${(p) => (p.$active ? 'rgba(255,107,53,0.65)' : 'var(--border)')};
  border-radius: 14px;
  background: ${(p) => (p.$url ? `url(${p.$url}) center/cover no-repeat` : 'rgba(255,255,255,0.04)')};
  cursor: pointer;
  height: 100%;
  min-height: 64px;
`;

export default function Gallery({ images }: { images: string[] }) {
  const list = useMemo(() => (Array.isArray(images) ? images.filter(Boolean) : []), [images]);
  const [idx, setIdx] = useState(0);
  const main = list[idx] || list[0];

  return (
    <Wrap>
      <Main $url={main} />
      <Thumbs>
        {list.slice(0, 8).map((u, i) => (
          <Thumb key={u + i} $url={u} $active={i === idx} onClick={() => setIdx(i)} aria-label={`Image ${i + 1}`} />
        ))}
      </Thumbs>
    </Wrap>
  );
}
