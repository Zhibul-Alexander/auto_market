'use client';

import styled from 'styled-components';
import { Card, CardBody, H2, P, Hr } from './ui';
import type { ServiceBlock } from '../lib/server/services';

const Section = styled.section`
  margin: 18px 0;
`;

const Bullets = styled.ul`
  margin: 0;
  padding-left: 18px;
  color: var(--muted);
  line-height: 1.7;
`;

const FaqItem = styled.div`
  padding: 12px 0;
`;

const Q = styled.div`
  font-weight: 800;
`;

const A = styled.div`
  color: var(--muted);
  margin-top: 6px;
  line-height: 1.7;
`;

export default function ServiceBlocks({ blocks }: { blocks: ServiceBlock[] }) {
  return (
    <div>
      {blocks.map((b, idx) => {
        if (b.type === 'hero') {
          return (
            <Card key={idx}>
              <CardBody>
                <H2 style={{ fontSize: 30 }}>{b.title}</H2>
                {b.subtitle ? <P style={{ marginTop: 10 }}>{b.subtitle}</P> : null}
              </CardBody>
            </Card>
          );
        }

        if (b.type === 'text') {
          return (
            <Section key={idx}>
              {b.title ? <H2>{b.title}</H2> : null}
              <P style={{ marginTop: b.title ? 10 : 0, color: 'var(--text)' }}>{b.body}</P>
            </Section>
          );
        }

        if (b.type === 'bullets') {
          return (
            <Section key={idx}>
              {b.title ? <H2>{b.title}</H2> : null}
              <div style={{ height: 10 }} />
              <Bullets>
                {b.items.map((it, i) => (
                  <li key={i}>{it}</li>
                ))}
              </Bullets>
            </Section>
          );
        }

        if (b.type === 'faq') {
          return (
            <Section key={idx}>
              <H2>FAQ</H2>
              <div style={{ height: 6 }} />
              {b.items.map((it, i) => (
                <FaqItem key={i}>
                  <Q>{it.q}</Q>
                  <A>{it.a}</A>
                  <Hr />
                </FaqItem>
              ))}
            </Section>
          );
        }

        return null;
      })}
    </div>
  );
}
