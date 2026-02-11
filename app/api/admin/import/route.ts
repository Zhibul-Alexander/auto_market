import { NextRequest, NextResponse } from 'next/server';
import { importLotsFromJsonText } from '../../../../lib/server/importer';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const mode = (url.searchParams.get('mode') || 'preview') as 'preview' | 'import';

  const form = await req.formData().catch((e) => {
    console.error('[import] formData error:', e);
    return null;
  });
  if (!form) return NextResponse.json({ error: 'Invalid form' }, { status: 400 });

  const raw = form.get('file');
  if (!raw) {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 });
  }

  // В edge-эмуляции dev-сервера File может прийти как строка или как Blob
  let text: string;
  let fileName = 'upload.json';

  if (typeof raw === 'string') {
    // Dev-режим: содержимое файла приходит как строка
    text = raw;
  } else {
    // Production (Cloudflare edge): File/Blob объект
    fileName = 'name' in raw ? String((raw as any).name) : 'upload.json';
    text = await raw.text();
  }

  if (!fileName.toLowerCase().endsWith('.json') && typeof raw !== 'string') {
    return NextResponse.json({ error: 'Only .json is supported' }, { status: 400 });
  }

  try {
    console.log(`[import] mode=${mode}, file=${fileName}, size=${text.length}`);
    const result = await importLotsFromJsonText(text, mode);

    if (!result.ok) {
      console.error('[import] result not ok:', result);
      return NextResponse.json(result, { status: 400 });
    }
    return NextResponse.json(result);
  } catch (err) {
    console.error('[import] Unhandled error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
