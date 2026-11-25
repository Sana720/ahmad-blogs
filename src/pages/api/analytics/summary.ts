import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

const PROPERTY_ID = process.env.GA4_PROPERTY_ID;
const SERVICE_ACCOUNT_JSON = process.env.GA_SERVICE_ACCOUNT_JSON;

async function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: any;
  const timeoutPromise = new Promise<T>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
  });
  try {
    const res = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!PROPERTY_ID) {
    return res.status(200).json({
      ok: false,
      error: 'GA4_PROPERTY_ID is not configured in environment variables.',
      help: 'Add GA4_PROPERTY_ID to your environment variables.'
    });
  }

  if (!SERVICE_ACCOUNT_JSON) {
    return res.status(200).json({
      ok: false,
      error: 'GA_SERVICE_ACCOUNT_JSON is not configured in environment variables.',
      help: 'Add GA_SERVICE_ACCOUNT_JSON to your environment variables.'
    });
  }

  try {
    let credentials: any;
    try {
      credentials = JSON.parse(SERVICE_ACCOUNT_JSON);
    } catch {
      credentials = JSON.parse(SERVICE_ACCOUNT_JSON.replace(/\n/g, '\\n'));
    }

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    });

    const analyticsData = google.analyticsdata({ version: 'v1beta', auth });
    const property = `properties/${PROPERTY_ID}`;

    let reportData: any = null;
    let source: '30days' | 'realtime' = '30days';

    // 1. Try standard 30-day runReport with a 4s timeout
    try {
      const response = await withTimeout(
        analyticsData.properties.runReport({
          property,
          requestBody: {
            dateRanges: [{ startDate: '28daysAgo', endDate: 'yesterday' }],
            metrics: [
              { name: 'activeUsers' },
              { name: 'sessions' },
              { name: 'bounceRate' },
              { name: 'averageSessionDuration' },
              { name: 'screenPageViews' }
            ],
            dimensions: [
              { name: 'country' },
              { name: 'deviceCategory' },
              { name: 'pagePath' },
              { name: 'sessionSourceMedium' }
            ],
            metricAggregations: ['TOTAL'],
            limit: "10"
          }
        }),
        4000,
        'GA4 standard runReport'
      );
      reportData = response.data;
      source = '30days';
    } catch (standardErr: any) {
      // For newly added properties or during Google's daily batch processing, runReport can timeout/502
      console.warn('GA4 standard runReport fallback to realtime:', standardErr.message);

      // 2. Fallback to runRealtimeReport (instantaneous, works for fresh properties)
      const realtimeResponse = await withTimeout(
        analyticsData.properties.runRealtimeReport({
          property,
          requestBody: {
            metrics: [
              { name: 'activeUsers' },
              { name: 'screenPageViews' }
            ],
            dimensions: [
              { name: 'country' },
              { name: 'deviceCategory' },
              { name: 'unifiedScreenName' }
            ],
            metricAggregations: ['TOTAL'],
            limit: "10"
          }
        }),
        4000,
        'GA4 realtime report'
      );
      reportData = realtimeResponse.data;
      source = 'realtime';
    }

    return res.status(200).json({
      ok: true,
      source,
      data: reportData,
      serviceAccount: credentials.client_email || 'configured'
    });
  } catch (error: any) {
    console.error('GA4 analytics/summary error:', error);
    const msg = error.message || 'Error communicating with Google Analytics';
    const isPermission = msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('access') || msg.toLowerCase().includes('not found') || msg.toLowerCase().includes('caller does not have');

    return res.status(200).json({
      ok: false,
      error: msg,
      help: isPermission
        ? `Grant 'Viewer' permission to your Service Account email in Google Analytics Admin > Property Access Management for Property ID: ${PROPERTY_ID}.`
        : 'Google Analytics 4 takes 24-48 hours after creation to finalize its first batch reports.'
    });
  }
}
