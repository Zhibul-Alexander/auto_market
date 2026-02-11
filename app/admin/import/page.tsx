'use client';

import { useState } from 'react';
import { Button, Card, CardBody, H2, P, Hr } from '../../../components/ui';

type PreviewRes =
  | { ok: false; error: string }
  | { ok: true; mode: 'preview'; total: number; preview: any[]; errors: any[] };

type ImportRes =
  | { ok: false; error: string }
  | { ok: true; mode: 'import'; total: number; processed: number; inserted: number; updated: number; failed: number; errors: any[] };

export default function AdminImportPage() {
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
      <H2>Import JSON</H2>
      <P style={{ marginTop: 8 }}>Upload a .json file (array of lot objects). Server will validate, normalize and upsert by lot_number.</P>
      <div style={{ height: 12 }} />

      <Card>
        <CardBody>
          <input type="file" accept=".json,application/json" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <div style={{ height: 12 }} />
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Button $variant="primary" disabled={!file || loading} onClick={doPreview}>Preview</Button>
            <Button disabled={!file || loading} onClick={doImport}>Import</Button>
          </div>
          <P style={{ marginTop: 10, fontSize: 13, color: 'var(--muted)' }}>
            Tip: displayedPrice is computed and stored for filtering (Buy It Now → else 0.5 × Est. Retail → else “Price on request”).
          </P>
        </CardBody>
      </Card>

      {preview ? (
        <>
          <div style={{ height: 18 }} />
          <Card>
            <CardBody>
              <H2 style={{ fontSize: 18 }}>Preview</H2>
              {'ok' in preview && preview.ok ? (
                <>
                  <P style={{ marginTop: 8 }}>Total objects: {preview.total}. Showing first {preview.preview.length} normalized rows.</P>
                  <Hr />
                  <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12, color: 'var(--muted)' }}>
                    {JSON.stringify(preview.preview, null, 2)}
                  </pre>
                  {preview.errors?.length ? (
                    <>
                      <Hr />
                      <P style={{ color: '#ffb4a2' }}>Validation errors: {preview.errors.length}</P>
                      <Button onClick={() => downloadErrors(preview.errors)}>Download errors</Button>
                    </>
                  ) : null}
                </>
              ) : (
                <P style={{ color: '#ffb4a2' }}>{(preview as any).error || 'Preview failed'}</P>
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
              <H2 style={{ fontSize: 18 }}>Import report</H2>
              {'ok' in report && report.ok ? (
                <>
                  <P style={{ marginTop: 8 }}>
                    processed: {report.processed} · inserted/processed: {report.inserted} · failed: {report.failed}
                  </P>
                  {report.errors?.length ? (
                    <>
                      <Hr />
                      <P style={{ color: '#ffb4a2' }}>Errors: {report.errors.length}</P>
                      <Button onClick={() => downloadErrors(report.errors)}>Download errors</Button>
                    </>
                  ) : (
                    <P style={{ color: '#8be28b' }}>Done.</P>
                  )}
                </>
              ) : (
                <P style={{ color: '#ffb4a2' }}>{(report as any).error || 'Import failed'}</P>
              )}
            </CardBody>
          </Card>
        </>
      ) : null}
    </div>
  );
}
