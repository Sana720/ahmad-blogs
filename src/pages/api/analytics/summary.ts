import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

const PROPERTY_ID = process.env.GA4_PROPERTY_ID;
const SERVICE_ACCOUNT_JSON = process.env.GA_SERVICE_ACCOUNT_JSON;

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
    const response = await analyticsData.properties.runReport({
      property: `properties/${PROPERTY_ID}`,
      requestBody: {
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
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
    });

    return res.status(200).json({
      ok: true,
      data: response.data,
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
        : 'Check your Google Cloud & GA4 setup.'
    });
  }
}
