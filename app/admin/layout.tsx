'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { Container } from '../../components/ui';

const Wrap = styled.div`
  min-height: 100vh;
  padding: 28px 0 60px;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
`;

const Nav = styled.nav`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

  a {
    padding: 8px 10px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: rgba(255,255,255,0.02);
    color: var(--muted);
  }
  a:hover { color: var(--text); border-color: rgba(255,107,53,0.55); }
`;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Wrap>
      <Container>
        <Top>
          <div style={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 10, height: 10, borderRadius: 999, background: 'var(--accent)' }} />
            Admin
          </div>
          <Nav>
            <Link href="/admin/import">Import</Link>
            <Link href="/admin/leads">Leads</Link>
            <Link href="/admin/offices">Offices</Link>
          </Nav>
        </Top>

        {children}
      </Container>
    </Wrap>
  );
}
