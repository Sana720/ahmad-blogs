import admin from 'firebase-admin';

// Initialize firebase-admin using a service account JSON stored in env var
if (!admin.apps.length) {
  const sa = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!sa) {
    // do not throw here to allow local dev without admin SDK; endpoints that require admin will check
    console.warn('FIREBASE_SERVICE_ACCOUNT not set - admin SDK will not be initialized');
  } else {
    try {
      const cred = JSON.parse(sa);
      admin.initializeApp({ credential: admin.credential.cert(cred) });
    } catch (err) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT:', err);
    }
  }
}

export default admin;
