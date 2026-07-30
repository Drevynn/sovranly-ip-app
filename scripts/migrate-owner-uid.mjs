#!/usr/bin/env node
/**
 * Sovranly IP — ownerUid migration
 *
 * Backfills `ownerUid` on existing Firestore documents in `assets` and
 * `agreements` so the new ownership rules and API checks work.
 *
 * Usage:
 *   # Dry-run (default) — report only
 *   node scripts/migrate-owner-uid.mjs
 *
 *   # Apply changes
 *   node scripts/migrate-owner-uid.mjs --apply
 *
 *   # Assign a specific UID to docs that have no ownerUid
 *   DEFAULT_OWNER_UID=firebaseUidHere node scripts/migrate-owner-uid.mjs --apply
 *
 * Auth (pick one):
 *   - GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccount.json
 *   - FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}'
 *   - Or Application Default Credentials (gcloud auth application-default login)
 *
 * Optional:
 *   FIREBASE_PROJECT_ID=your-project-id
 *   (falls back to NEXT_PUBLIC_FIREBASE_PROJECT_ID or "sovranlyip")
 */

import { readFileSync, existsSync } from 'fs';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const require = createRequire(import.meta.url);
const admin = require('firebase-admin');

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const APPLY = process.argv.includes('--apply');
const COLLECTIONS = ['assets', 'agreements'];
const DEFAULT_OWNER_UID = process.env.DEFAULT_OWNER_UID || '';
const BATCH_SIZE = 400; // Firestore batch limit is 500

function resolveProjectId() {
  if (process.env.FIREBASE_PROJECT_ID) return process.env.FIREBASE_PROJECT_ID;
  if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    return process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  }
  // Try local config files
  for (const name of ['firebase-applet-config.json', 'firebase-applet-config.example.json']) {
    const p = join(root, name);
    if (existsSync(p)) {
      try {
        const j = JSON.parse(readFileSync(p, 'utf8'));
        if (j.projectId) return j.projectId;
      } catch {
        /* ignore */
      }
    }
  }
  return 'sovranlyip';
}

function initAdmin() {
  if (admin.apps.length) return admin.app();

  const projectId = resolveProjectId();
  let credential;

  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    credential = admin.credential.cert(sa);
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    credential = admin.credential.applicationDefault();
  } else {
    // ADC or project-only (works in GCP with default SA)
    try {
      credential = admin.credential.applicationDefault();
    } catch {
      credential = undefined;
    }
  }

  const opts = { projectId };
  if (credential) opts.credential = credential;

  admin.initializeApp(opts);
  console.log(`Initialized firebase-admin for project: ${projectId}`);
  return admin.app();
}

// ---------------------------------------------------------------------------
// Migration logic
// ---------------------------------------------------------------------------

async function migrateCollection(db, name) {
  console.log(`\n── Collection: ${name} ──`);
  const snap = await db.collection(name).get();
  console.log(`  Total documents: ${snap.size}`);

  const missing = [];
  const alreadySet = [];

  snap.docs.forEach((doc) => {
    const data = doc.data();
    if (data.ownerUid && typeof data.ownerUid === 'string' && data.ownerUid.length > 0) {
      alreadySet.push(doc.id);
    } else {
      missing.push({ id: doc.id, data });
    }
  });

  console.log(`  Already have ownerUid: ${alreadySet.length}`);
  console.log(`  Missing ownerUid:      ${missing.length}`);

  if (missing.length === 0) {
    console.log('  Nothing to migrate.');
    return { updated: 0, skipped: 0, already: alreadySet.length };
  }

  // Sample IDs for visibility
  const sample = missing.slice(0, 5).map((m) => m.id);
  console.log(`  Sample missing IDs: ${sample.join(', ')}${missing.length > 5 ? '…' : ''}`);

  if (!APPLY) {
    console.log('  [dry-run] No writes. Pass --apply to update.');
    if (!DEFAULT_OWNER_UID) {
      console.log(
        '  Note: set DEFAULT_OWNER_UID=<firebaseUid> to assign a fallback owner on apply.'
      );
    }
    return { updated: 0, skipped: missing.length, already: alreadySet.length };
  }

  if (!DEFAULT_OWNER_UID) {
    console.warn(
      '  WARNING: DEFAULT_OWNER_UID is not set. Documents without ownerUid will be SKIPPED.'
    );
    console.warn(
      '  Re-run with DEFAULT_OWNER_UID=<uid> --apply to assign a fallback owner.'
    );
    return { updated: 0, skipped: missing.length, already: alreadySet.length };
  }

  let updated = 0;
  let batch = db.batch();
  let opsInBatch = 0;

  for (const item of missing) {
    const ref = db.collection(name).doc(item.id);
    batch.update(ref, {
      ownerUid: DEFAULT_OWNER_UID,
      ownerUidMigratedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    opsInBatch++;
    updated++;

    if (opsInBatch >= BATCH_SIZE) {
      await batch.commit();
      console.log(`  Committed batch (${updated} so far)…`);
      batch = db.batch();
      opsInBatch = 0;
    }
  }

  if (opsInBatch > 0) {
    await batch.commit();
  }

  console.log(`  Updated: ${updated}`);
  return { updated, skipped: 0, already: alreadySet.length };
}

async function main() {
  console.log('Sovranly IP — ownerUid migration');
  console.log(`Mode: ${APPLY ? 'APPLY (writes enabled)' : 'DRY-RUN (no writes)'}`);
  if (DEFAULT_OWNER_UID) {
    console.log(`DEFAULT_OWNER_UID: ${DEFAULT_OWNER_UID}`);
  } else {
    console.log('DEFAULT_OWNER_UID: (not set)');
  }

  initAdmin();
  const db = admin.firestore();

  const totals = { updated: 0, skipped: 0, already: 0 };

  for (const name of COLLECTIONS) {
    const result = await migrateCollection(db, name);
    totals.updated += result.updated;
    totals.skipped += result.skipped;
    totals.already += result.already;
  }

  console.log('\n══ Summary ══');
  console.log(`  Already owned: ${totals.already}`);
  console.log(`  Updated:       ${totals.updated}`);
  console.log(`  Skipped:       ${totals.skipped}`);
  if (!APPLY) {
    console.log('\nRe-run with --apply (and DEFAULT_OWNER_UID if needed) to write changes.');
  } else if (totals.updated > 0) {
    console.log('\nMigration complete. Deployed rules will now enforce ownership on these docs.');
  }
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
