'use client';

import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

export const Card = styled.div`
  background: #FFFFFF;
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
  transition: transform 200ms ease, box-shadow 200ms ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
  }
`;

export const CardBody = styled.div`
  padding: 16px;
`;

export const H1 = styled.h1`
  margin: 0;
  font-size: 38px;
  line-height: 1.1;
  color: var(--text);
`;

export const H2 = styled.h2`
  margin: 0;
  font-size: 24px;
  line-height: 1.2;
  color: var(--text);
`;

export const P = styled.p`
  margin: 0;
  color: var(--muted);
  line-height: 1.6;
`;

export const Button = styled.button<{ $variant?: 'primary' | 'ghost' }>`
  border: ${(p) => (p.$variant === 'primary' ? 'none' : '1px solid var(--border)')};
  background: ${(p) =>
    p.$variant === 'primary'
      ? 'linear-gradient(135deg, #FF6B35, #FF8A50)'
      : '#FFFFFF'};
  color: ${(p) => (p.$variant === 'primary' ? '#FFFFFF' : 'var(--text)')};
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: transform 120ms ease, opacity 120ms ease, background 120ms ease;
  &:hover {
    transform: translateY(-1px);
    background: ${(p) =>
      p.$variant === 'primary'
        ? 'linear-gradient(135deg, #F2551F, #FF7A3D)'
        : 'var(--hover-bg)'};
  }
  &:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
`;

export const Input = styled.input`
  width: 100%;
  background: #F8FAFC;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 12px;
  color: var(--text);
  outline: none;
  transition: border-color 150ms ease, box-shadow 150ms ease;
  &:focus { border-color: #FF6B35; box-shadow: 0 0 0 3px rgba(255,107,53,0.15); }
`;

export const Textarea = styled.textarea`
  width: 100%;
  background: #F8FAFC;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 12px;
  color: var(--text);
  outline: none;
  min-height: 110px;
  resize: vertical;
  transition: border-color 150ms ease, box-shadow 150ms ease;
  &:focus { border-color: #FF6B35; box-shadow: 0 0 0 3px rgba(255,107,53,0.15); }
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px;
  border-radius: 8px;
  background: #F1F5F9;
  color: #475569;
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
