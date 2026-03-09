'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Card, CardBody, P } from './ui';

type Office = {
  id: number;
  city: string;
  phone: string;
  address: string | null;
};

const OfficeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
`;

const PhoneLink = styled.a`
  color: var(--accent);
  font-weight: 700;
  font-size: 15px;
  &:hover { text-decoration: underline; }
`;

export default function OfficesList() {
  const [offices, setOffices] = useState<Office[]>([]);

  useEffect(() => {
    fetch('/api/offices')
      .then((r) => r.json())
      .then((d) => setOffices(d.rows || []))
      .catch(() => {});
  }, []);

  if (!offices.length) return null;

  return (
    <OfficeGrid>
      {offices.map((o) => (
        <Card key={o.id}>
          <CardBody>
            <div style={{ fontWeight: 800, marginBottom: 6 }}>{o.city}</div>
            <PhoneLink href={`tel:${o.phone.replace(/\s/g, '')}`}>{o.phone}</PhoneLink>
            {o.address ? <P style={{ marginTop: 6, fontSize: 13 }}>{o.address}</P> : null}
          </CardBody>
        </Card>
      ))}
    </OfficeGrid>
  );
}
