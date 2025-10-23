import dynamic from 'next/dynamic';

// Dynamically import the client-only analytics/chart component so server bundles stay small
const BlogAnalyticsClient = dynamic(() => import('./BlogAnalyticsClient'), { ssr: false });

export default function BlogAnalytics() {
  return <BlogAnalyticsClient />;
}
