// Google Analytics integration utility

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || '';

export function pageview(url: string) {
  if (typeof window !== 'undefined' && GA_MEASUREMENT_ID) {
    (window as any).gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
}

export function event({ action, category, label, value }: { action: string; category: string; label: string; value: number }) {
  if (typeof window !== 'undefined' && GA_MEASUREMENT_ID) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}
