import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

const API_KEY = process.env.GOOGLE_API_KEY;
const PROPERTY_ID = process.env.GA4_PROPERTY_ID;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!API_KEY) {
    return res.status(500).json({ error: 'Google API key not set' });
  }
  try {
    const analyticsData = google.analyticsdata({ version: 'v1beta', auth: API_KEY });
    const response = await analyticsData.properties.runReport({
      property: `properties/${PROPERTY_ID}`,
      requestBody: {
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        metrics: [{ name: 'activeUsers' }],
      },
    });
    const visitors = response.data?.rows?.[0]?.metricValues?.[0]?.value || '0';
    res.status(200).json({ visitors });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
