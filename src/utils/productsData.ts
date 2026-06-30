export interface Product {
  id: string;
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  price: string;
  category: 'Extension' | 'Template' | 'SaaS';
  image: string;
  features: string[];
  techStack: string[];
  downloadUrl?: string;
  demoUrl?: string;
  purchaseUrl?: string;
  rating: number;
  reviewsCount: number;
  releaseDate: string;
  faqs: { question: string; answer: string }[];
  images?: string[];
  pricingType?: 'Free' | 'Paid' | 'Freemium';
}

export const products: Product[] = [
  {
    id: "seo-metadata-extractor",
    title: "SEO Meta Extractor Pro",
    tagline: "One-click SEO analysis and metadata extraction Chrome Extension.",
    description: "Extract page titles, meta descriptions, headings, open graph tags, schema, and page speeds in a single click.",
    longDescription: "SEO Meta Extractor Pro is a lightweight, powerful developer tool designed for SEO specialists and web developers. It inspects the active tab in your browser and instantly outputs a structured summary of crucial SEO tags, keyword density, broken links, images missing alt attributes, and schema markup. Export findings to CSV or JSON in seconds.",
    price: "$19.00",
    category: "Extension",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    features: [
      "Real-time page HTML & JSON-LD parser",
      "Broken link checker (internal and external)",
      "Headings hierarchy (H1-H6) visualizer",
      "One-click CSV/JSON export",
      "Dark mode support & customizable settings"
    ],
    techStack: ["React", "TypeScript", "TailwindCSS", "Chrome Extension Manifest V3"],
    downloadUrl: "https://chrome.google.com/webstore",
    demoUrl: "https://seo-extractor-demo.vercel.app",
    rating: 4.8,
    reviewsCount: 124,
    releaseDate: "Feb 2026",
    faqs: [
      {
        question: "Does it collect my browsing data?",
        answer: "Absolutely not. All extraction and analysis are performed locally on your device inside the extension sandbox."
      },
      {
        question: "Is it compatible with manifest V3?",
        answer: "Yes, it is fully compliant with Chrome's Manifest V3 security standards."
      }
    ]
  },
  {
    id: "premium-portfolio-template",
    title: "Vivid Developer Portfolio",
    tagline: "A ultra-fast, modern Next.js developer portfolio template.",
    description: "Showcase your work with stunning glassmorphism design, built-in MDX blog, dark mode, and seamless contact forms.",
    longDescription: "Impress recruiters and clients with a high-fidelity Next.js portfolio. Loaded with dynamic Framer Motion animations, optimized Image components, full TailwindCSS configurations, SEO-optimized tags out of the box, and a fully functional MDX-based blog section.",
    price: "$29.00",
    category: "Template",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    features: [
      "Built with Next.js 15 (App Router)",
      "Beautiful light & dark mode designs",
      "Dynamic Page Transitions with Framer Motion",
      "Responsive typography and navigation",
      "MDX-driven blog engine ready for writing"
    ],
    techStack: ["Next.js 15", "React 19", "TailwindCSS", "Framer Motion", "MDX"],
    demoUrl: "https://vivid-portfolio-demo.vercel.app",
    purchaseUrl: "https://gumroad.com",
    rating: 4.9,
    reviewsCount: 88,
    releaseDate: "Jan 2026",
    faqs: [
      {
        question: "Can I use this template for commercial client projects?",
        answer: "Yes, the single-use license allows you to build one commercial client project."
      },
      {
        question: "Is there support included?",
        answer: "Yes, you get lifetime updates and access to our developer Discord for help."
      }
    ]
  },
  {
    id: "tinycrm-solopreneurs",
    title: "TinyCRM for Solopreneurs",
    tagline: "The lightweight, offline-first CRM that runs inside your browser.",
    description: "Manage client leads, pipeline deals, follow-up reminders, and basic invoicing without bloated subscription fees.",
    longDescription: "TinyCRM provides all the essential features of a contact manager and sales funnel without the subscription bloat. Built for freelancers and indie hackers, it stores data safely on your machine using IndexedDB and exports back up to Google Sheets with simple OAuth integrations.",
    price: "$49.00",
    category: "SaaS",
    image: "https://images.unsplash.com/photo-1552581230-c01591d3999a?auto=format&fit=crop&w=800&q=80",
    features: [
      "Offline-first client database via IndexedDB",
      "Drag-and-drop Kanban deal board",
      "Automated follow-up reminders and calendar syncing",
      "Local-first PDF invoice builder",
      "Cloud backup to Google Drive / CSV exports"
    ],
    techStack: ["React 19", "Vite", "IndexedDB", "TailwindCSS", "Google Sheets API"],
    demoUrl: "https://tinycrm.demo.com",
    purchaseUrl: "https://gumroad.com",
    rating: 4.7,
    reviewsCount: 205,
    releaseDate: "Mar 2026",
    faqs: [
      {
        question: "Is there a monthly subscription fee?",
        answer: "No, TinyCRM is a one-time purchase with lifetime access and updates."
      },
      {
        question: "Can I share my workspace with teammates?",
        answer: "Currently, TinyCRM is designed as a single-user system. Workspace sharing via cloud database is on our roadmap."
      }
    ]
  }
];
