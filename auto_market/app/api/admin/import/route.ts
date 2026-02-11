import { NextRequest, NextResponse } from 'next/server';
import { importLotsFromJsonText } from '../../../../lib/server/importer';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const mode = (url.searchParams.get('mode') || 'preview') as 'preview' | 'import';

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: 'Invalid form' }, { status: 400 });

  const file = form.get('file');
  if (!file || !(file instanceof File)) return NextResponse.json({ error: 'Missing file' }, { status: 400 });

  if (!file.name.toLowerCase().endsWith('.json')) {
    return NextResponse.json({ error: 'Only .json is supported' }, { status: 400 });
  }

  const text = await file.text();
  const result = await importLotsFromJsonText(text, mode);

  if (!result.ok) return NextResponse.json(result, { status: 400 });
  return NextResponse.json(result);
}
