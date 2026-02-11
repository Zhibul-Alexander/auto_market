import { NextRequest, NextResponse } from 'next/server';
import { getService } from '../../../../lib/server/services';

export const runtime = 'edge';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const url = new URL(req.url);
  const locale = url.searchParams.get('locale') || 'en';

  const svc = await getService(params.slug, locale);
  if (!svc) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({
    slug: svc.slug,
    locale: svc.locale,
    title: svc.title,
    blocks: svc.blocks
  });
}
