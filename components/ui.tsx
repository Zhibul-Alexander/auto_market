'use client';

import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

export const Card = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
`;

export const CardBody = styled.div`
  padding: 16px;
`;

export const H1 = styled.h1`
  margin: 0;
  font-size: 38px;
  line-height: 1.1;
`;

export const H2 = styled.h2`
  margin: 0;
  font-size: 24px;
  line-height: 1.2;
`;

export const P = styled.p`
  margin: 0;
  color: var(--muted);
  line-height: 1.6;
`;

export const Button = styled.button<{ $variant?: 'primary' | 'ghost' }>`
  border: 1px solid var(--border);
  background: ${(p) => (p.$variant === 'primary' ? 'var(--accent)' : 'transparent')};
  color: ${(p) => (p.$variant === 'primary' ? '#120700' : 'var(--text)')};
  padding: 10px 14px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: transform 120ms ease, opacity 120ms ease;
  &:hover { transform: translateY(-1px); }
  &:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
`;

export const Input = styled.input`
  width: 100%;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 12px;
  color: var(--text);
  outline: none;
  &:focus { border-color: rgba(255,107,53,0.7); box-shadow: 0 0 0 3px rgba(255,107,53,0.12); }
`;

export const Textarea = styled.textarea`
  width: 100%;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 12px;
  color: var(--text);
  outline: none;
  min-height: 110px;
  resize: vertical;
  &:focus { border-color: rgba(255,107,53,0.7); box-shadow: 0 0 0 3px rgba(255,107,53,0.12); }
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: rgba(255,255,255,0.04);
  color: var(--muted);
  font-size: 12px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
`;

export const Hr = styled.hr`
  border: none;
  border-top: 1px solid var(--border);
  margin: 16px 0;
`;
