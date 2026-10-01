import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { verifyAuthToken } from '@/lib/auth-server';

const DEFAULT_PREFERENCES = {
  doNotSellOrShare: true, // Always true on Sovranly IP
  aiTrainingOptIn: false, // Default opt-out for creator asset protection
  retentionWindowDays: 30, // Ephemeral log retention
  marketingConsent: false,
  telemetryAllowed: false,
  oracleTelemetrySync: true, // For verifiable streaming counts
  thirdPartySync: false,
  updatedAt: new Date().toISOString(),
};

export async function GET(request: Request) {
  try {
    const user = await verifyAuthToken(request.headers.get('Authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const doc = await db.collection('compliance_preferences').doc(user.uid).get();
      if (doc.exists) {
        return NextResponse.json({ ...DEFAULT_PREFERENCES, ...doc.data() });
      }
    } catch (e) {
      console.warn('Preferences lookup notice:', e);
    }

    return NextResponse.json(DEFAULT_PREFERENCES);
  } catch (error) {
    console.error('Error fetching compliance preferences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await verifyAuthToken(request.headers.get('Authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const updatedPreferences = {
      ...DEFAULT_PREFERENCES,
      ...body,
      // Enforce zero-harvesting architecture: doNotSellOrShare is always true
      doNotSellOrShare: true,
      userId: user.uid,
      userEmail: user.email || null,
      updatedAt: new Date().toISOString(),
    };

    await db
      .collection('compliance_preferences')
      .doc(user.uid)
      .set(updatedPreferences, { merge: true });

    return NextResponse.json({
      success: true,
      message: 'Compliance and privacy preferences saved successfully.',
      preferences: updatedPreferences,
    });
  } catch (error) {
    console.error('Error saving compliance preferences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
