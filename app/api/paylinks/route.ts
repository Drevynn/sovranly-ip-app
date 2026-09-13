import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_PAY_LINKS, PayLinkProduct } from '@/lib/paylinks';

// In-memory fallback cache for development/demo sessions
let payLinksCache: PayLinkProduct[] = [...DEFAULT_PAY_LINKS];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const accountId = searchParams.get('accountId');

  let filtered = payLinksCache;
  if (accountId) {
    filtered = payLinksCache.filter(p => !p.accountId || p.accountId === accountId);
    if (filtered.length === 0) {
      filtered = payLinksCache; // Fallback to catalogue if account-specific not defined yet
    }
  }

  return NextResponse.json({
    success: true,
    products: filtered,
    total: filtered.length
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name, description, price, payUrl, category = 'master', accountId } = body;

    if (!name || price === undefined || !payUrl) {
      return NextResponse.json(
        { error: 'INVALID_INPUT', message: 'Name, price, and payUrl are required.' },
        { status: 400 }
      );
    }

    const newPayLink: PayLinkProduct = {
      id: `paylink_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name,
      description: description || '',
      price: Number(price),
      unitAmount: Math.round(Number(price) * 100),
      currency: 'usd',
      payUrl: payUrl.startsWith('http') ? payUrl : `https://${payUrl}`,
      category: category as PayLinkProduct['category'],
      active: true,
      createdAt: new Date().toISOString(),
      accountId: accountId || undefined
    };

    payLinksCache = [newPayLink, ...payLinksCache];

    return NextResponse.json({
      success: true,
      product: newPayLink,
      message: 'Pay link successfully created and registered on sovereign rail.'
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: 'SERVER_ERROR', message: (err as Error).message },
      { status: 500 }
    );
  }
}
