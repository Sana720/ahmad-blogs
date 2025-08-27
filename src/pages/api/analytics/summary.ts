import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import path from 'path';

const PROPERTY_ID = process.env.GA4_PROPERTY_ID;
const KEY_PATH = path.join(process.cwd(), 'secrets/ga-service-account.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!PROPERTY_ID) {
    return res.status(500).json({ error: 'GA4 property ID not set' });
  }
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: KEY_PATH,
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
