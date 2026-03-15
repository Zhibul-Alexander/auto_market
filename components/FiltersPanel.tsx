'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import { Input } from './ui';
import { useTranslations } from 'next-intl';

/* ---------- types ---------- */

type FilterState = {
  make: string[]; model: string;
  priceMin: string; priceMax: string;
  yearMin: string; yearMax: string;
  engineMin: string; engineMax: string;
  bodyType: string[]; fuelType: string[];
  driveType: string[]; transmissionType: string[];
  sort: string;
};

/* ---------- styled ---------- */

const Wrap = styled.div`
  border: 1px solid var(--border);
  background: #FFFFFF;
  border-radius: 16px;
  overflow: hidden;
  position: sticky;
  top: 84px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);

  @media (max-width: 980px) {
    position: static;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 14px 16px;
  cursor: pointer;
  color: var(--text);
  font-size: 15px;
  font-weight: 900;
  user-select: none;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ActiveCount = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: 999px;
  background: var(--accent);
  color: #FFFFFF;
  font-size: 11px;
  font-weight: 800;
`;

const ResetBtn = styled.button`
  font-size: 12px;
  font-weight: 600;
  color: var(--muted);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 6px;
  &:hover { color: var(--accent); }
`;

const Chevron = styled.span<{ $open: boolean }>`
  font-size: 12px;
  color: var(--muted);
  transition: transform 200ms ease;
  transform: ${(p) => (p.$open ? 'rotate(180deg)' : 'rotate(0deg)')};
  display: inline-block;
`;

const Body = styled.div<{ $open: boolean }>`
  display: ${(p) => (p.$open ? 'block' : 'none')};
  padding: 0 16px 16px;
  max-height: calc(100vh - 84px - 52px);
  overflow-y: auto;
  overscroll-behavior: contain;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: var(--border); border-radius: 999px; }

  @media (max-width: 860px) {
    max-height: none;
    overflow-y: visible;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--border);
  margin: 12px 0;
`;

const Section = styled.div`
  margin-top: 12px;
`;

const SectionLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: var(--muted);
  margin-bottom: 7px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const RangeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  input { flex: 1; min-width: 0; }
  span { color: var(--muted); font-size: 13px; flex-shrink: 0; }
`;

const Chips = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const Chip = styled.button<{ $active?: boolean }>`
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid ${(p) => (p.$active ? '#FF6B35' : 'var(--border)')};
  background: ${(p) => (p.$active ? 'rgba(255,107,53,0.1)' : '#F8FAFC')};
  color: ${(p) => (p.$active ? '#FF6B35' : 'var(--muted)')};
  cursor: pointer;
  font-size: 12px;
  font-weight: ${(p) => (p.$active ? 700 : 400)};
  transition: all 100ms ease;
  white-space: nowrap;

  @media (max-width: 860px) {
    padding: 8px 12px;
    font-size: 13px;
  }
`;

const SortChips = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const SortChip = styled.button<{ $active?: boolean }>`
  padding: 5px 10px;
  border-radius: 8px;
  border: 1px solid ${(p) => (p.$active ? '#FF6B35' : 'var(--border)')};
  background: ${(p) => (p.$active ? 'rgba(255,107,53,0.1)' : '#F8FAFC')};
  color: ${(p) => (p.$active ? '#FF6B35' : 'var(--muted)')};
  cursor: pointer;
  font-size: 12px;
  font-weight: ${(p) => (p.$active ? 700 : 400)};
  transition: all 100ms ease;
  white-space: nowrap;
`;


const FoundBadge = styled.div`
  text-align: center;
  padding: 10px 0 0;
  font-size: 13px;
  color: var(--muted);
`;

/* ---------- Make dropdown ---------- */

const DropdownWrap = styled.div`
  position: relative;
`;

const DropdownBtn = styled.button<{ $active?: boolean }>`
  width: 100%;
  padding: 8px 10px;
  border: 1px solid ${(p) => (p.$active ? '#FF6B35' : 'var(--border)')};
  border-radius: 8px;
  background: ${(p) => (p.$active ? 'rgba(255,107,53,0.05)' : '#F8FAFC')};
  color: ${(p) => (p.$active ? '#FF6B35' : 'var(--muted)')};
  font-size: 13px;
  font-weight: ${(p) => (p.$active ? 600 : 400)};
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
  transition: all 100ms ease;
`;

const DropdownList = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.1);
  z-index: 200;
  max-height: 220px;
  overflow-y: auto;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: var(--border); border-radius: 999px; }
`;

const DropdownItem = styled.button<{ $active?: boolean }>`
  width: 100%;
  padding: 7px 10px;
  background: ${(p) => (p.$active ? 'rgba(255,107,53,0.08)' : 'transparent')};
  color: ${(p) => (p.$active ? '#FF6B35' : 'var(--text)')};
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 13px;
  font-weight: ${(p) => (p.$active ? 600 : 400)};
  display: flex;
  align-items: center;
  gap: 6px;
  &:hover { background: #F1F5F9; }

  @media (max-width: 860px) {
    padding: 10px 12px;
    font-size: 14px;
  }
`;

const DropdownBtnLabel = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const DropdownBtnArrow = styled.span`
  font-size: 10px;
  flex-shrink: 0;
`;

const CheckMark = styled.span<{ $active?: boolean }>`
  width: 14px;
  height: 14px;
  border: 1.5px solid ${(p) => (p.$active ? '#FF6B35' : 'var(--border)')};
  border-radius: 3px;
  background: ${(p) => (p.$active ? '#FF6B35' : 'transparent')};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 9px;
  color: #fff;
`;

/* ---------- option maps ---------- */

const bodyTypes = ['sedan', 'hatchback', 'crossover', 'coupe', 'minivan', 'pickup', 'convertible', 'sport', 'wagon'] as const;
const bodyTypeKeyMap: Record<string, string> = {
  sedan: 'bodySedan', hatchback: 'bodyHatchback', crossover: 'bodySuv',
  coupe: 'bodyCoupe', minivan: 'bodyMinivan', pickup: 'bodyPickup',
  convertible: 'bodyConvertible', sport: 'bodySport', wagon: 'bodyWagon',
};

const fuelTypes = ['gas', 'diesel', 'hybrid', 'electric'] as const;
const fuelTypeKeyMap: Record<string, string> = {
  gas: 'fuelGas', diesel: 'fuelDiesel', hybrid: 'fuelHybrid', electric: 'fuelElectric',
};

const driveTypes = ['fwd', 'rwd', 'awd'] as const;
const driveTypeKeyMap: Record<string, string> = {
  fwd: 'driveFwd', rwd: 'driveRwd', awd: 'driveAwd',
};

const transmissionTypes = ['automatic', 'manual'] as const;
const transTypeKeyMap: Record<string, string> = {
  automatic: 'transAuto', manual: 'transManual',
};

const carMakes = [
  'ACURA', 'ALFA ROMEO', 'AUDI', 'BMW', 'BUICK', 'CADILLAC', 'CHEVROLET',
  'CHRYSLER', 'DODGE', 'FORD', 'GENESIS', 'GMC', 'HONDA', 'HYUNDAI', 'INFINITI',
  'JAGUAR', 'JEEP', 'KIA', 'LAND ROVER', 'LEXUS', 'LINCOLN', 'MAZDA', 'MERCEDES-BENZ',
  'MINI', 'MITSUBISHI', 'NISSAN', 'PORSCHE', 'RAM', 'SUBARU', 'TESLA', 'TOYOTA',
  'VOLKSWAGEN', 'VOLVO',
] as const;

/* ---------- URL helpers ---------- */

function getNum(sp: URLSearchParams, key: string) {
  const v = sp.get(key);
  if (!v) return '';
  const n = Number(v);
  return Number.isFinite(n) ? String(n) : '';
}
function getStr(sp: URLSearchParams, key: string) { return sp.get(key) || ''; }
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
  const [makeOpen, setMakeOpen] = useState(false);

  // Collapse by default on mobile
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth <= 860) {
      setOpen(false);
    }
  }, []);
  const makeDropRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<FilterState>(() => ({
    make: getList(params, 'make'),
    model: getStr(params, 'model'),
    priceMin: getNum(params, 'priceMin'),
    priceMax: getNum(params, 'priceMax'),
    yearMin: getNum(params, 'yearMin'),
    yearMax: getNum(params, 'yearMax'),
    engineMin: getNum(params, 'engineMin'),
    engineMax: getNum(params, 'engineMax'),
    bodyType: getList(params, 'bodyType'),
    fuelType: getList(params, 'fuelType'),
    driveType: getList(params, 'driveType'),
    transmissionType: getList(params, 'transmissionType'),
    sort: getStr(params, 'sort') || 'price_asc',
  }));

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (makeDropRef.current && !makeDropRef.current.contains(e.target as Node)) {
        setMakeOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function pushFilters(state: FilterState) {
    const next = new URLSearchParams();
    const set = (k: string, v: string) => { if (v?.trim()) next.set(k, v.trim()); };
    if (state.make.length) next.set('make', state.make.join(','));
    set('model', state.model.toUpperCase());
    set('priceMin', state.priceMin);
    set('priceMax', state.priceMax);
    set('yearMin', state.yearMin);
    set('yearMax', state.yearMax);
    set('engineMin', state.engineMin);
    set('engineMax', state.engineMax);
    if (state.bodyType.length) next.set('bodyType', state.bodyType.join(','));
    if (state.fuelType.length) next.set('fuelType', state.fuelType.join(','));
    if (state.driveType.length) next.set('driveType', state.driveType.join(','));
    if (state.transmissionType.length) next.set('transmissionType', state.transmissionType.join(','));
    set('sort', state.sort);
    next.set('page', '1');
    router.push(`${pathname}?${next.toString()}`);
  }

  function scheduleApply(newState: FilterState, delay: number) {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => pushFilters(newState), delay);
  }

  function applyNow(newState: FilterState) {
    if (timerRef.current) clearTimeout(timerRef.current);
    pushFilters(newState);
  }

  function updateText(key: 'model' | 'priceMin' | 'priceMax' | 'yearMin' | 'yearMax' | 'engineMin' | 'engineMax', value: string) {
    const next = { ...filters, [key]: value };
    setFilters(next);
    scheduleApply(next, 700);
  }

  function toggleMake(make: string) {
    const cur = filters.make;
    const next = {
      ...filters,
      make: cur.includes(make) ? cur.filter((m) => m !== make) : [...cur, make],
    };
    setFilters(next);
    applyNow(next);
  }

  function toggleChip(key: 'bodyType' | 'fuelType' | 'driveType' | 'transmissionType', val: string) {
    const cur = filters[key] as string[];
    const next = { ...filters, [key]: cur.includes(val) ? cur.filter((x) => x !== val) : [...cur, val] };
    setFilters(next);
    applyNow(next);
  }

  function updateSort(val: string) {
    const next = { ...filters, sort: val };
    setFilters(next);
    applyNow(next);
  }

  function clearAll() {
    if (timerRef.current) clearTimeout(timerRef.current);
    const clean: FilterState = {
      make: [], model: '', priceMin: '', priceMax: '',
      yearMin: '', yearMax: '', engineMin: '', engineMax: '',
      bodyType: [], fuelType: [], driveType: [], transmissionType: [],
      sort: 'price_asc',
    };
    setFilters(clean);
    router.push(pathname);
  }

  const activeCount = useMemo(() => {
    let c = 0;
    if (filters.make.length) c++;
    if (filters.model) c++;
    if (filters.priceMin || filters.priceMax) c++;
    if (filters.yearMin || filters.yearMax) c++;
    if (filters.engineMin || filters.engineMax) c++;
    if (filters.bodyType.length) c++;
    if (filters.fuelType.length) c++;
    if (filters.driveType.length) c++;
    if (filters.transmissionType.length) c++;
    return c;
  }, [filters]);

  const sortOptions = [
    { value: 'price_asc', label: t('sortPriceAsc') },
    { value: 'price_desc', label: t('sortPriceDesc') },
    { value: 'year_asc', label: t('sortYearAsc') },
    { value: 'year_desc', label: t('sortYearDesc') },
  ];

  const selectedMakeText = filters.make.length === 0
    ? t('makePlaceholder')
    : filters.make.join(', ');

  return (
    <Wrap>
      <PanelHeader onClick={() => setOpen((v) => !v)}>
        <HeaderLeft>
          <span>{t('filters')}</span>
          {activeCount > 0 && <ActiveCount>{activeCount}</ActiveCount>}
          {activeCount > 0 && (
            <ResetBtn
              type="button"
              onClick={(e) => { e.stopPropagation(); clearAll(); }}
            >
              {t('clear')}
            </ResetBtn>
          )}
        </HeaderLeft>
        <Chevron $open={open}>▾</Chevron>
      </PanelHeader>

      <Body $open={open}>

        {/* Sort */}
        <Section>
          <SectionLabel>{t('sort')}</SectionLabel>
          <SortChips>
            {sortOptions.map((opt) => (
              <SortChip
                key={opt.value}
                type="button"
                $active={filters.sort === opt.value}
                onClick={() => updateSort(opt.value)}
              >
                {opt.label}
              </SortChip>
            ))}
          </SortChips>
        </Section>

        <Divider />

        {/* Make — multi-select dropdown */}
        <Section>
          <SectionLabel>{t('make')}</SectionLabel>
          <DropdownWrap ref={makeDropRef}>
            <DropdownBtn
              type="button"
              $active={filters.make.length > 0}
              onClick={() => setMakeOpen((v) => !v)}
            >
              <DropdownBtnLabel>{selectedMakeText}</DropdownBtnLabel>
              <DropdownBtnArrow>▾</DropdownBtnArrow>
            </DropdownBtn>
            {makeOpen && (
              <DropdownList>
                {carMakes.map((make) => (
                  <DropdownItem
                    key={make}
                    type="button"
                    $active={filters.make.includes(make)}
                    onClick={() => toggleMake(make)}
                  >
                    <CheckMark $active={filters.make.includes(make)}>
                      {filters.make.includes(make) ? '✓' : ''}
                    </CheckMark>
                    {make}
                  </DropdownItem>
                ))}
              </DropdownList>
            )}
          </DropdownWrap>
        </Section>

        {/* Model */}
        <Section>
          <SectionLabel>{t('model')}</SectionLabel>
          <Input
            value={filters.model}
            onChange={(e) => updateText('model', e.target.value)}
            placeholder="CAMRY"
          />
        </Section>

        {/* Price */}
        <Section>
          <SectionLabel>{t('price')}</SectionLabel>
          <RangeRow>
            <Input
              type="number"
              value={filters.priceMin}
              onChange={(e) => updateText('priceMin', e.target.value)}
              placeholder="5 000"
            />
            <span>—</span>
            <Input
              type="number"
              value={filters.priceMax}
              onChange={(e) => updateText('priceMax', e.target.value)}
              placeholder="50 000"
            />
          </RangeRow>
        </Section>

        {/* Year */}
        <Section>
          <SectionLabel>{t('year')}</SectionLabel>
          <RangeRow>
            <Input
              type="number"
              value={filters.yearMin}
              onChange={(e) => updateText('yearMin', e.target.value)}
              placeholder="2015"
            />
            <span>—</span>
            <Input
              type="number"
              value={filters.yearMax}
              onChange={(e) => updateText('yearMax', e.target.value)}
              placeholder="2024"
            />
          </RangeRow>
        </Section>

        <Divider />

        {/* Body type */}
        <Section>
          <SectionLabel>{t('bodyType')}</SectionLabel>
          <Chips>
            {bodyTypes.map((bt) => (
              <Chip
                key={bt}
                type="button"
                $active={filters.bodyType.includes(bt)}
                onClick={() => toggleChip('bodyType', bt)}
              >
                {t(bodyTypeKeyMap[bt])}
              </Chip>
            ))}
          </Chips>
        </Section>

        {/* Fuel type */}
        <Section>
          <SectionLabel>{t('fuelType')}</SectionLabel>
          <Chips>
            {fuelTypes.map((ft) => (
              <Chip
                key={ft}
                type="button"
                $active={filters.fuelType.includes(ft)}
                onClick={() => toggleChip('fuelType', ft)}
              >
                {t(fuelTypeKeyMap[ft])}
              </Chip>
            ))}
          </Chips>
        </Section>

        {/* Drive type */}
        <Section>
          <SectionLabel>{t('driveType')}</SectionLabel>
          <Chips>
            {driveTypes.map((dt) => (
              <Chip
                key={dt}
                type="button"
                $active={filters.driveType.includes(dt)}
                onClick={() => toggleChip('driveType', dt)}
              >
                {t(driveTypeKeyMap[dt])}
              </Chip>
            ))}
          </Chips>
        </Section>

        {/* Transmission */}
        <Section>
          <SectionLabel>{t('transmissionType')}</SectionLabel>
          <Chips>
            {transmissionTypes.map((tt) => (
              <Chip
                key={tt}
                type="button"
                $active={filters.transmissionType.includes(tt)}
                onClick={() => toggleChip('transmissionType', tt)}
              >
                {t(transTypeKeyMap[tt])}
              </Chip>
            ))}
          </Chips>
        </Section>

        {total != null && (
          <FoundBadge>{t('found', { count: total.toLocaleString() })}</FoundBadge>
        )}
      </Body>
    </Wrap>
  );
}
