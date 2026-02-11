'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import { Button, Card, CardBody, Input, Hr, P } from './ui';
import { useTranslations } from 'next-intl';

const Wrap = styled.div`
  border: 1px solid var(--border);
  background: rgba(255,255,255,0.02);
  border-radius: 16px;
  padding: 14px;
  position: sticky;
  top: 84px;

  @media (max-width: 980px) {
    position: static;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const Label = styled.label`
  display: grid;
  gap: 8px;
  font-size: 12px;
  color: var(--muted);
`;

const Chips = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Chip = styled.button<{ $active?: boolean }>`
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid ${(p) => (p.$active ? 'rgba(255,107,53,0.65)' : 'var(--border)')};
  background: ${(p) => (p.$active ? 'rgba(255,107,53,0.15)' : 'rgba(255,255,255,0.02)')};
  color: ${(p) => (p.$active ? 'var(--text)' : 'var(--muted)')};
  cursor: pointer;
  font-size: 12px;
`;

const Select = styled.select`
  width: 100%;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 12px;
  color: var(--text);
  outline: none;
`;

const bodyTypes = ['sedan','hatchback','crossover','coupe','minivan','pickup','convertible','sport','wagon','other'] as const;
const fuelTypes = ['gas','diesel','hybrid','electric','other'] as const;

function getNum(sp: URLSearchParams, key: string) {
  const v = sp.get(key);
  if (!v) return '';
  const n = Number(v);
  return Number.isFinite(n) ? String(n) : '';
}

function getStr(sp: URLSearchParams, key: string) {
  return sp.get(key) || '';
}

function getList(sp: URLSearchParams, key: string) {
  const v = sp.get(key);
  if (!v) return [] as string[];
  return v.split(',').map((x) => x.trim()).filter(Boolean);
}

export default function FiltersPanel() {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const params = useMemo(() => new URLSearchParams(sp?.toString() || ''), [sp]);

  const [make, setMake] = useState(getStr(params, 'make'));
  const [model, setModel] = useState(getStr(params, 'model'));
  const [priceMin, setPriceMin] = useState(getNum(params, 'priceMin'));
  const [priceMax, setPriceMax] = useState(getNum(params, 'priceMax'));
  const [yearMin, setYearMin] = useState(getNum(params, 'yearMin'));
  const [yearMax, setYearMax] = useState(getNum(params, 'yearMax'));
  const [engineMin, setEngineMin] = useState(getNum(params, 'engineMin'));
  const [engineMax, setEngineMax] = useState(getNum(params, 'engineMax'));
  const [bodyType, setBodyType] = useState<string[]>(getList(params, 'bodyType'));
  const [fuelType, setFuelType] = useState<string[]>(getList(params, 'fuelType'));
  const [sort, setSort] = useState(getStr(params, 'sort') || 'newest');
  const [pageSize, setPageSize] = useState(getStr(params, 'pageSize') || '30');

  function toggle(list: string[], val: string) {
    if (list.includes(val)) return list.filter((x) => x !== val);
    return [...list, val];
  }

  function apply() {
    const next = new URLSearchParams(params.toString());

    const setOrDelete = (k: string, v: string) => {
      if (v && v.trim()) next.set(k, v.trim());
      else next.delete(k);
    };

    setOrDelete('make', make.toUpperCase());
    setOrDelete('model', model.toUpperCase());
    setOrDelete('priceMin', priceMin);
    setOrDelete('priceMax', priceMax);
    setOrDelete('yearMin', yearMin);
    setOrDelete('yearMax', yearMax);
    setOrDelete('engineMin', engineMin);
    setOrDelete('engineMax', engineMax);

    if (bodyType.length) next.set('bodyType', bodyType.join(','));
    else next.delete('bodyType');

    if (fuelType.length) next.set('fuelType', fuelType.join(','));
    else next.delete('fuelType');

    setOrDelete('sort', sort);
    setOrDelete('pageSize', pageSize);

    next.set('page', '1'); // reset
    router.push(`${pathname}?${next.toString()}`);
  }

  function clearAll() {
    router.push(`${pathname}`);
  }

  return (
    <Wrap>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontWeight: 900 }}>{t('common.filters')}</div>
        <button onClick={clearAll} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}>
          {t('common.clear')}
        </button>
      </div>

      <div style={{ height: 12 }} />

      <Grid>
        <Label>
          Make
          <Input value={make} onChange={(e) => setMake(e.target.value)} placeholder="TOYOTA" />
        </Label>
        <Label>
          Model
          <Input value={model} onChange={(e) => setModel(e.target.value)} placeholder="CAMRY" />
        </Label>
        <Label>
          Price min
          <Input value={priceMin} onChange={(e) => setPriceMin(e.target.value)} placeholder="5000" />
        </Label>
        <Label>
          Price max
          <Input value={priceMax} onChange={(e) => setPriceMax(e.target.value)} placeholder="12000" />
        </Label>
        <Label>
          Year min
          <Input value={yearMin} onChange={(e) => setYearMin(e.target.value)} placeholder="2018" />
        </Label>
        <Label>
          Year max
          <Input value={yearMax} onChange={(e) => setYearMax(e.target.value)} placeholder="2024" />
        </Label>
        <Label>
          Engine min (L)
          <Input value={engineMin} onChange={(e) => setEngineMin(e.target.value)} placeholder="2.0" />
        </Label>
        <Label>
          Engine max (L)
          <Input value={engineMax} onChange={(e) => setEngineMax(e.target.value)} placeholder="3.5" />
        </Label>
      </Grid>

      <div style={{ height: 12 }} />

      <Label>
        Body type
        <Chips>
          {bodyTypes.map((bt) => (
            <Chip key={bt} $active={bodyType.includes(bt)} onClick={() => setBodyType((x) => toggle(x, bt))} type="button">
              {bt}
            </Chip>
          ))}
        </Chips>
      </Label>

      <div style={{ height: 12 }} />

      <Label>
        Fuel type
        <Chips>
          {fuelTypes.map((ft) => (
            <Chip key={ft} $active={fuelType.includes(ft)} onClick={() => setFuelType((x) => toggle(x, ft))} type="button">
              {ft}
            </Chip>
          ))}
        </Chips>
      </Label>

      <div style={{ height: 12 }} />

      <Grid>
        <Label>
          Sort
          <Select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="price_asc">Price ↑</option>
            <option value="price_desc">Price ↓</option>
            <option value="year_desc">Year ↓</option>
            <option value="engine_desc">Engine ↓</option>
          </Select>
        </Label>
        <Label>
          {t('common.pageSize')}
          <Select value={pageSize} onChange={(e) => setPageSize(e.target.value)}>
            <option value="30">30</option>
            <option value="60">60</option>
            <option value="90">90</option>
          </Select>
        </Label>
      </Grid>

      <div style={{ height: 14 }} />
      <Button $variant="primary" onClick={apply} type="button" style={{ width: '100%' }}>
        {t('common.apply')}
      </Button>
      <div style={{ height: 10 }} />
      <P style={{ fontSize: 12 }}>{t('catalog.hint')}</P>
    </Wrap>
  );
}
