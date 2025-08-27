import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

const PROPERTY_ID = process.env.GA4_PROPERTY_ID;
const SERVICE_ACCOUNT_JSON = process.env.GA_SERVICE_ACCOUNT_JSON;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!PROPERTY_ID) {
    return res.status(500).json({ error: 'GA4 property ID not set' });
  }
  try {
    if (!SERVICE_ACCOUNT_JSON) {
      return res.status(500).json({ error: 'GA service account JSON not set in environment' });
    }
    const credentials = JSON.parse(SERVICE_ACCOUNT_JSON);
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
        limit: "10"
      }
    });
    res.status(200).json({ data: response.data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
