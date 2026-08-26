import admin from 'firebase-admin';

// Initialize firebase-admin using a service account JSON stored in env var
if (!admin.apps.length) {
  const sa = process.env.FIREBASE_SERVICE_ACCOUNT || process.env.GA_SERVICE_ACCOUNT_JSON;
  if (!sa) {
    // do not throw here to allow local dev without admin SDK; endpoints that require admin will check
    console.warn('FIREBASE_SERVICE_ACCOUNT not set - admin SDK will not be initialized');
  } else {
    try {
      let cred;
      try {
        // Try parsing directly (works if .env uses single quotes and preserves literal \n)
        cred = JSON.parse(sa);
      } catch (e) {
        // Fallback: Next.js parses \n inside double quotes as actual newlines.
        // We need to escape them back to \\n so JSON.parse is valid.
        const cleanSa = sa.replace(/\n/g, '\\n');
        cred = JSON.parse(cleanSa);
      }
      admin.initializeApp({ credential: admin.credential.cert(cred) });
    } catch (err: any) {
      console.error('Failed to parse Firebase Service Account:', err);
      // Let's store the error so we can read it in the route
      (admin as any)._initError = err.message;
    }
  }
}

export default admin;
