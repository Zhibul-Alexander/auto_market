'use client';

import { useMemo, useState, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import { Button, Input } from './ui';
import { useTranslations } from 'next-intl';

/* ---------- styled ---------- */

const Wrap = styled.div`
  border: 1px solid var(--border);
  background: rgba(255,255,255,0.02);
  border-radius: 16px;
  overflow: hidden;
  position: sticky;
  top: 84px;

  @media (max-width: 980px) {
    position: static;
  }
`;

const Header = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 14px 16px;
  background: transparent;
  border: none;
  color: var(--text);
  cursor: pointer;
  font-size: 15px;
  font-weight: 900;
`;

const ActiveCount = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: 999px;
  background: var(--accent);
  color: #120700;
  font-size: 11px;
  font-weight: 800;
`;

const Toggle = styled.span`
  font-size: 18px;
  color: var(--muted);
  user-select: none;
`;

const Body = styled.div<{ $open: boolean }>`
  display: ${(p) => (p.$open ? 'block' : 'none')};
  padding: 0 16px 16px;
`;

const Section = styled.div`
  margin-top: 14px;
`;

const SectionLabel = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: var(--muted);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const Chips = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const Chip = styled.button<{ $active?: boolean }>`
  padding: 7px 10px;
  border-radius: 999px;
  border: 1px solid ${(p) => (p.$active ? 'rgba(255,107,53,0.65)' : 'var(--border)')};
  background: ${(p) => (p.$active ? 'rgba(255,107,53,0.15)' : 'rgba(255,255,255,0.02)')};
  color: ${(p) => (p.$active ? 'var(--text)' : 'var(--muted)')};
  cursor: pointer;
  font-size: 12px;
  font-weight: ${(p) => (p.$active ? 600 : 400)};
  transition: all 100ms ease;
`;

const Select = styled.select`
  width: 100%;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 12px;
  color: var(--text);
  outline: none;
  &:focus { border-color: rgba(255,107,53,0.7); }
`;

const Footer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;

const ClearBtn = styled.button`
  background: transparent;
  border: 1px solid var(--border);
  color: var(--muted);
  padding: 10px 14px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  &:hover { color: var(--text); border-color: var(--text); }
`;

const FoundBadge = styled.div`
  text-align: center;
  padding: 10px 0 0;
  font-size: 13px;
  color: var(--muted);
`;

/* ---------- chip option maps ---------- */

const bodyTypes = ['sedan', 'hatchback', 'crossover', 'coupe', 'minivan', 'pickup', 'convertible', 'sport', 'wagon'] as const;
const fuelTypes = ['gas', 'diesel', 'hybrid', 'electric'] as const;
const driveTypes = ['fwd', 'rwd', 'awd', '4wd'] as const;
const transmissionTypes = ['automatic', 'manual', 'cvt'] as const;

/* ---------- URL helpers ---------- */

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

/* ---------- component ---------- */

export default function FiltersPanel({ total }: { total?: number }) {
  const t = useTranslations('common');
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const params = useMemo(() => new URLSearchParams(sp?.toString() || ''), [sp]);

  const [open, setOpen] = useState(true);

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
  const [driveType, setDriveType] = useState<string[]>(getList(params, 'driveType'));
  const [transmissionType, setTransmissionType] = useState<string[]>(getList(params, 'transmissionType'));
  const [sort, setSort] = useState(getStr(params, 'sort') || 'newest');
  const [pageSize, setPageSize] = useState(getStr(params, 'pageSize') || '30');

  const toggle = useCallback((list: string[], val: string) => {
    return list.includes(val) ? list.filter((x) => x !== val) : [...list, val];
  }, []);

  const activeCount = useMemo(() => {
    let c = 0;
    if (make) c++;
    if (model) c++;
    if (priceMin || priceMax) c++;
    if (yearMin || yearMax) c++;
    if (engineMin || engineMax) c++;
    if (bodyType.length) c++;
    if (fuelType.length) c++;
    if (driveType.length) c++;
    if (transmissionType.length) c++;
    return c;
  }, [make, model, priceMin, priceMax, yearMin, yearMax, engineMin, engineMax, bodyType, fuelType, driveType, transmissionType]);

  function apply() {
    const next = new URLSearchParams();

    const set = (k: string, v: string) => { if (v && v.trim()) next.set(k, v.trim()); };

    set('make', make.toUpperCase());
    set('model', model.toUpperCase());
    set('priceMin', priceMin);
    set('priceMax', priceMax);
    set('yearMin', yearMin);
    set('yearMax', yearMax);
    set('engineMin', engineMin);
    set('engineMax', engineMax);

    if (bodyType.length) next.set('bodyType', bodyType.join(','));
    if (fuelType.length) next.set('fuelType', fuelType.join(','));
    if (driveType.length) next.set('driveType', driveType.join(','));
    if (transmissionType.length) next.set('transmissionType', transmissionType.join(','));

    if (sort !== 'newest') set('sort', sort);
    if (pageSize !== '30') set('pageSize', pageSize);

    next.set('page', '1');
    router.push(`${pathname}?${next.toString()}`);
  }

  function clearAll() {
    setMake(''); setModel('');
    setPriceMin(''); setPriceMax('');
    setYearMin(''); setYearMax('');
    setEngineMin(''); setEngineMax('');
    setBodyType([]); setFuelType([]);
    setDriveType([]); setTransmissionType([]);
    setSort('newest'); setPageSize('30');
    router.push(pathname);
  }

  return (
    <Wrap>
      <Header onClick={() => setOpen((v) => !v)} type="button">
        <span>
          {t('filters')}
          {activeCount > 0 && <>{' '}<ActiveCount>{activeCount}</ActiveCount></>}
        </span>
        <Toggle>{open ? '−' : '+'}</Toggle>
      </Header>

      <Body $open={open}>
        {/* Make / Model */}
        <Row>
          <div>
            <SectionLabel>{t('make')}</SectionLabel>
            <Input value={make} onChange={(e) => setMake(e.target.value)} placeholder="TOYOTA" />
          </div>
          <div>
            <SectionLabel>{t('model')}</SectionLabel>
            <Input value={model} onChange={(e) => setModel(e.target.value)} placeholder="CAMRY" />
          </div>
        </Row>

        {/* Price */}
        <Section>
          <Row>
            <div>
              <SectionLabel>{t('priceMin')}</SectionLabel>
              <Input type="number" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} placeholder="5 000" />
            </div>
            <div>
              <SectionLabel>{t('priceMax')}</SectionLabel>
              <Input type="number" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} placeholder="50 000" />
            </div>
          </Row>
        </Section>

        {/* Year */}
        <Section>
          <Row>
            <div>
              <SectionLabel>{t('yearMin')}</SectionLabel>
              <Input type="number" value={yearMin} onChange={(e) => setYearMin(e.target.value)} placeholder="2018" />
            </div>
            <div>
              <SectionLabel>{t('yearMax')}</SectionLabel>
              <Input type="number" value={yearMax} onChange={(e) => setYearMax(e.target.value)} placeholder="2026" />
            </div>
          </Row>
        </Section>

        {/* Engine */}
        <Section>
          <Row>
            <div>
              <SectionLabel>{t('engineMin')}</SectionLabel>
              <Input type="number" step="0.1" value={engineMin} onChange={(e) => setEngineMin(e.target.value)} placeholder="1.5" />
            </div>
            <div>
              <SectionLabel>{t('engineMax')}</SectionLabel>
              <Input type="number" step="0.1" value={engineMax} onChange={(e) => setEngineMax(e.target.value)} placeholder="5.0" />
            </div>
          </Row>
        </Section>

        {/* Body type */}
        <Section>
          <SectionLabel>{t('bodyType')}</SectionLabel>
          <Chips>
            {bodyTypes.map((bt) => (
              <Chip key={bt} $active={bodyType.includes(bt)} onClick={() => setBodyType((x) => toggle(x, bt))} type="button">
                {bt}
              </Chip>
            ))}
          </Chips>
        </Section>

        {/* Fuel type */}
        <Section>
          <SectionLabel>{t('fuelType')}</SectionLabel>
          <Chips>
            {fuelTypes.map((ft) => (
              <Chip key={ft} $active={fuelType.includes(ft)} onClick={() => setFuelType((x) => toggle(x, ft))} type="button">
                {ft}
              </Chip>
            ))}
          </Chips>
        </Section>

        {/* Drive type */}
        <Section>
          <SectionLabel>{t('driveType')}</SectionLabel>
          <Chips>
            {driveTypes.map((dt) => (
              <Chip key={dt} $active={driveType.includes(dt)} onClick={() => setDriveType((x) => toggle(x, dt))} type="button">
                {dt.toUpperCase()}
              </Chip>
            ))}
          </Chips>
        </Section>

        {/* Transmission type */}
        <Section>
          <SectionLabel>{t('transmissionType')}</SectionLabel>
          <Chips>
            {transmissionTypes.map((tt) => (
              <Chip key={tt} $active={transmissionType.includes(tt)} onClick={() => setTransmissionType((x) => toggle(x, tt))} type="button">
                {tt}
              </Chip>
            ))}
          </Chips>
        </Section>

        {/* Sort & Page size */}
        <Section>
          <Row>
            <div>
              <SectionLabel>{t('sort')}</SectionLabel>
              <Select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="newest">{t('sortNewest')}</option>
                <option value="price_asc">{t('sortPriceAsc')}</option>
                <option value="price_desc">{t('sortPriceDesc')}</option>
                <option value="year_desc">{t('sortYearDesc')}</option>
                <option value="engine_desc">{t('sortEngineDesc')}</option>
              </Select>
            </div>
            <div>
              <SectionLabel>{t('pageSize')}</SectionLabel>
              <Select value={pageSize} onChange={(e) => setPageSize(e.target.value)}>
                <option value="30">30</option>
                <option value="60">60</option>
                <option value="90">90</option>
              </Select>
            </div>
          </Row>
        </Section>

        {/* Actions */}
        <Footer>
          <Button $variant="primary" onClick={apply} type="button" style={{ flex: 1 }}>
            {t('apply')}
          </Button>
          {activeCount > 0 && (
            <ClearBtn onClick={clearAll} type="button">
              {t('clear')}
            </ClearBtn>
          )}
        </Footer>

        {total != null && (
          <FoundBadge>{t('found', { count: total.toLocaleString() })}</FoundBadge>
        )}
      </Body>
    </Wrap>
  );
}
