'use client';

import { useState } from 'react';
import { Button, Card, CardBody, H2, P, Hr } from '../../../components/ui';
import { useAdminI18n } from '../../../lib/admin-i18n';

type PreviewRes =
  | { ok: false; error: string }
  | { ok: true; mode: 'preview'; total: number; preview: any[]; skipped: any[]; errors: any[] };

type ImportRes =
  | { ok: false; error: string }
  | { ok: true; mode: 'import'; total: number; processed: number; inserted: number; updated: number; skipped: number; skippedReasons: Record<string, number>; failed: number; errors: any[] };

export default function AdminImportPage() {
  const { t } = useAdminI18n();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PreviewRes | null>(null);
  const [report, setReport] = useState<ImportRes | null>(null);
  const [loading, setLoading] = useState(false);

  async function doPreview() {
    if (!file) return;
    setLoading(true);
    setPreview(null);
    setReport(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/import?mode=preview', { method: 'POST', body: fd });
      const data = (await res.json()) as PreviewRes;
      setPreview(data);
    } finally {
      setLoading(false);
    }
  }

  async function doImport() {
    if (!file) return;
    setLoading(true);
    setReport(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/import?mode=import', { method: 'POST', body: fd });
      const data = (await res.json()) as ImportRes;
      setReport(data);
    } finally {
      setLoading(false);
    }
  }

  function downloadErrors(errors: any[]) {
    const blob = new Blob([JSON.stringify(errors, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'import-errors.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <H2>{t('import.title')}</H2>
      <P style={{ marginTop: 8 }}>{t('import.desc')}</P>
      <div style={{ height: 12 }} />

      <Card>
        <CardBody>
          <input type="file" accept=".json,application/json" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <div style={{ height: 12 }} />
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <Button $variant="primary" disabled={!file || loading} onClick={doPreview}>{t('import.preview')}</Button>
            <Button disabled={!file || loading} onClick={doImport}>{t('import.import')}</Button>
            {loading && (
              <>
                <style>{`@keyframes _spin { to { transform: rotate(360deg); } }`}</style>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--muted)', fontSize: 14 }}>
                  <span style={{ width: 14, height: 14, border: '2px solid var(--border)', borderTopColor: '#FF6B35', borderRadius: '50%', display: 'inline-block', animation: '_spin 0.7s linear infinite', flexShrink: 0 }} />
                  {t('import.loading')}
                </span>
              </>
            )}
          </div>
          <P style={{ marginTop: 10, fontSize: 13, color: 'var(--muted)' }}>
            {t('import.tip')}
          </P>
        </CardBody>
      </Card>

      {preview ? (
        <>
          <div style={{ height: 18 }} />
          <Card>
            <CardBody>
              <H2 style={{ fontSize: 18 }}>{t('import.previewTitle')}</H2>
              {'ok' in preview && preview.ok ? (
                <>
                  <P style={{ marginTop: 8 }}>{t('import.total')}: {preview.total}. {t('import.showing').replace('{n}', String(preview.preview.length))}</P>
                  <Hr />
                  <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12, color: 'var(--muted)' }}>
                    {JSON.stringify(preview.preview, null, 2)}
                  </pre>
                  {preview.errors?.length ? (
                    <>
                      <Hr />
                      <P style={{ color: '#DC2626' }}>{t('import.validationErrors')}: {preview.errors.length}</P>
                      <Button onClick={() => downloadErrors(preview.errors)}>{t('import.downloadErrors')}</Button>
                    </>
                  ) : null}
                </>
              ) : (
                <P style={{ color: '#DC2626' }}>{(preview as any).error || t('import.previewFailed')}</P>
              )}
            </CardBody>
          </Card>
        </>
      ) : null}

      {report ? (
        <>
          <div style={{ height: 18 }} />
          <Card>
            <CardBody>
              <H2 style={{ fontSize: 18 }}>{t('import.reportTitle')}</H2>
              {'ok' in report && report.ok ? (
                <>
                  <P style={{ marginTop: 8 }}>
                    {t('import.total')}: {report.total} · {t('import.inserted')}: {report.inserted} · {t('import.skipped')}: {report.skipped} · {t('import.failed')}: {report.failed}
                  </P>
                  {report.skipped > 0 && report.skippedReasons && (
                    <P style={{ marginTop: 6, fontSize: 13, color: 'var(--muted)' }}>
                      {t('import.skipped')}: {Object.entries(report.skippedReasons).map(([reason, count]) => `${reason}: ${count}`).join(' · ')}
                    </P>
                  )}
                  {report.errors?.length ? (
                    <>
                      <Hr />
                      <P style={{ color: '#DC2626' }}>{t('import.errors')}: {report.errors.length}</P>
                      <Button onClick={() => downloadErrors(report.errors)}>{t('import.downloadErrors')}</Button>
                    </>
                  ) : (
                    <P style={{ color: '#16A34A' }}>{t('import.done')}</P>
                  )}
                </>
              ) : (
                <P style={{ color: '#DC2626' }}>{(report as any).error || t('import.importFailed')}</P>
              )}
            </CardBody>
          </Card>
        </>
      ) : null}
    </div>
  );
}
