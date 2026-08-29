import { IconType } from "react-icons";
import { FaCogs, FaLaptopCode, FaMobileAlt, FaChartLine, FaSearchDollar, FaCloud } from "react-icons/fa";

export interface FAQ {
    question: string;
    answer: string;
}

export interface ProcessStep {
    step: string;
    title: string;
    description: string;
}

export interface ServiceDetail {
    slug: string;
    title: string;
    shortDescription: string;
    icon: IconType;
    features: string[];
    // SEO Fields
    seoTitle: string;
    seoDescription: string;
    keywords: string[];
    // Content Sections
    heroSubtitle: string;
    contentParagraphs: string[];
    keyBenefits: { title: string; description: string }[];
    faqs: FAQ[];
    // New Extended Content Sections
    process: ProcessStep[];
    whyChooseUs: string[];
    techStack: string[];
}

export const servicesData: ServiceDetail[] = [
    {
        slug: "enterprise-erp-solutions",
        title: "Enterprise ERP Solutions",
        shortDescription: "Scalable architecture to unify your business operations. We build custom ERPs that integrate finance, HR, and supply chain into one cohesive ecosystem.",
        icon: FaCogs,
        features: ["Automated Workflows", "Real-time Analytics", "Secure Cloud Infrastructure"],
        seoTitle: "Custom Enterprise ERP Solutions | Modernize Your Business Operations",
        seoDescription: "Transform your business with custom Enterprise Resource Planning (ERP) solutions. We build highly scalable, secure, and integrated systems for modern enterprises.",
        keywords: ["Custom ERP development", "Enterprise resource planning", "Cloud ERP solutions", "Business process automation", "ERP integration", "Scalable ERP architecture"],
        heroSubtitle: "Unify Your Business Operations with Custom Software",
        contentParagraphs: [
            "In today's fast-paced digital economy, relying on disconnected spreadsheets and legacy systems is a recipe for inefficiency. Our Custom Enterprise ERP Solutions are designed to centralize your operations, giving you a single source of truth across finance, human resources, supply chain, and customer relationship management.",
            "We don't believe in one-size-fits-all software. Instead, we architect scalable, cloud-native ERP ecosystems tailored specifically to your unique business logic. By automating redundant workflows and providing real-time analytics dashboards, we empower your executive team to make data-driven decisions instantly.",
            "Security and compliance are built into the core of our ERP systems. Leveraging the latest encryption standards and role-based access control (RBAC), we ensure your proprietary data remains protected while remaining accessible to authorized personnel from anywhere in the world."
        ],
        keyBenefits: [
            { title: "Centralized Data", description: "Eliminate data silos by integrating all departmental data into one secure, unified database." },
            { title: "Workflow Automation", description: "Reduce manual data entry and human error by automating repetitive business processes." },
            { title: "Real-time Reporting", description: "Generate dynamic financial and operational reports in seconds, not days." }
        ],
        process: [
            { step: "01", title: "Discovery & Analysis", description: "We map out your current business processes and identify operational bottlenecks." },
            { step: "02", title: "Architecture & Design", description: "We design a highly scalable database schema and intuitive user interface." },
            { step: "03", title: "Agile Development", description: "We build your custom ERP in iterative sprints, providing regular updates and feedback loops." },
            { step: "04", title: "Deployment & Training", description: "We securely deploy the system to the cloud and provide comprehensive training for your team." }
        ],
        whyChooseUs: [
            "100% Custom Built for Your Unique Workflows",
            "Enterprise-Grade Data Security (AES-256)",
            "Seamless Integration with Existing Third-Party Tools",
            "No Vendor Lock-in or Per-User Licensing Fees"
        ],
        techStack: ["Node.js", "PostgreSQL", "Next.js", "GraphQL", "Redis", "Docker"],
        faqs: [
            { question: "How long does a custom ERP take to build?", answer: "A typical custom ERP MVP (Minimum Viable Product) takes between 3 to 6 months to develop, depending on the complexity of your business processes and required integrations." },
            { question: "Can the new ERP integrate with our existing software?", answer: "Absolutely. We build robust REST and GraphQL APIs to ensure your new ERP seamlessly communicates with any third-party tools (like payment gateways, CRM, or marketing software) you currently use." },
            { question: "Is the data secure?", answer: "Yes, we implement enterprise-grade security protocols including AES-256 encryption, multi-factor authentication, and automated daily backups on secure cloud infrastructure." }
        ]
    },
    {
        slug: "full-stack-web-development",
        title: "Full-Stack Web Development",
        shortDescription: "Performance-first web applications. We utilize Next.js and modern frameworks to deliver SEO-optimized, lightning-fast, and responsive digital experiences.",
        icon: FaLaptopCode,
        features: ["Server Side Rendering", "API Integration", "Progressive Web Apps"],
        seoTitle: "Expert Full-Stack Web Development Services | React & Next.js",
        seoDescription: "Hire top-tier full-stack developers to build lightning-fast, SEO-optimized web applications using React, Next.js, and Node.js. High conversion, scalable solutions.",
        keywords: ["Full-stack web development", "Next.js development company", "React developers", "Custom web applications", "SEO optimized web design", "Progressive web apps"],
        heroSubtitle: "Lightning-Fast Web Applications That Convert",
        contentParagraphs: [
            "Your website is the digital storefront of your business. If it's slow, unresponsive, or difficult to navigate, you are losing customers. Our Full-Stack Web Development services focus on building performance-first applications that load instantly and provide a flawless user experience across all devices.",
            "We specialize in modern JavaScript frameworks, primarily React and Next.js. By utilizing Server-Side Rendering (SSR) and Static Site Generation (SSG), we guarantee that your web application not only delivers a native-app-like experience but also ranks phenomenally well on Google.",
            "From architecting resilient backend databases with Node.js and PostgreSQL to crafting pixel-perfect frontend interfaces, we handle the entire development lifecycle. Our code is clean, heavily tested, and built to scale effortlessly as your traffic grows."
        ],
        keyBenefits: [
            { title: "Lightning Fast Speeds", description: "Achieve 90+ Core Web Vitals scores to improve both user experience and Google search rankings." },
            { title: "SEO Optimized", description: "Built from the ground up with semantic HTML, automated sitemaps, and dynamic structured data." },
            { title: "Highly Scalable", description: "Serverless architectures ensure your application stays online during massive traffic spikes without manual intervention." }
        ],
        process: [
            { step: "01", title: "UI/UX Prototyping", description: "We create high-fidelity Figma prototypes to visualize the final product." },
            { step: "02", title: "Frontend Development", description: "We translate the designs into pixel-perfect, responsive React components." },
            { step: "03", title: "Backend Architecture", description: "We build secure APIs and databases to handle complex business logic." },
            { step: "04", title: "QA & Launch", description: "Rigorous testing across all devices and browsers before pushing to production." }
        ],
        whyChooseUs: [
            "Experts in the Modern T3 Stack (Next.js, Tailwind, tRPC)",
            "Mobile-First Responsive Design Approach",
            "Obsessive Focus on Core Web Vitals and Page Speed",
            "Automated CI/CD Pipelines for Zero-Downtime Deployments"
        ],
        techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Prisma", "Vercel"],
        faqs: [
            { question: "What technologies do you use?", answer: "We primarily use the modern T3 stack: Next.js (React) for the frontend, Node.js/TypeScript for the backend, and PostgreSQL or Firebase for the database." },
            { question: "Do you provide maintenance after launch?", answer: "Yes! We offer ongoing maintenance and retainer packages to keep your software updated, secure, and running smoothly." },
            { question: "Will my website be mobile-friendly?", answer: "100%. Every application we build uses a mobile-first responsive design approach, ensuring it looks perfect on smartphones, tablets, and desktops." }
        ]
    },
    {
        slug: "mobile-application-development",
        title: "Mobile Application Development",
        shortDescription: "Native and Cross-platform solutions. We engineer intuitive mobile apps for iOS and Android that focus on retention and seamless user capability.",
        icon: FaMobileAlt,
        features: ["React Native / Flutter", "Offline Capabilities", "Biometric Security"],
        seoTitle: "Custom Mobile App Development | iOS & Android Solutions",
        seoDescription: "Develop high-performance, native and cross-platform mobile applications for iOS and Android. We specialize in React Native and Flutter development.",
        keywords: ["Mobile app development", "iOS app development", "Android app development", "React Native developers", "Cross-platform mobile apps", "App UI/UX design"],
        heroSubtitle: "Engage Users with World-Class Mobile Experiences",
        contentParagraphs: [
            "With mobile traffic dominating the internet, having a powerful, intuitive mobile app is no longer a luxury—it's a necessity. We engineer robust mobile applications for both iOS and Android platforms, designed to captivate your users and skyrocket your retention rates.",
            "We leverage industry-leading cross-platform frameworks like React Native and Flutter. This allows us to write the codebase once and deploy it to both the Apple App Store and Google Play Store simultaneously. The result? You save up to 40% on development costs and time-to-market without sacrificing native-like performance.",
            "Our development process goes beyond just coding. We focus heavily on mobile UI/UX design, ensuring every swipe, tap, and transition feels fluid. We also integrate advanced features like push notifications, offline functionality, geolocation, and biometric security."
        ],
        keyBenefits: [
            { title: "Cross-Platform Efficiency", description: "Launch on iOS and Android simultaneously using a single, easily maintainable codebase." },
            { title: "Offline Capabilities", description: "Keep your users engaged even when they lose internet connection with robust local caching." },
            { title: "App Store Optimization (ASO)", description: "We help you format your app listings to rank higher and get more organic downloads." }
        ],
        process: [
            { step: "01", title: "Wireframing", description: "Mapping out the user journey and core app navigation flows." },
            { step: "02", title: "App Development", description: "Writing clean, cross-platform code using React Native or Flutter." },
            { step: "03", title: "Native Integrations", description: "Implementing native device features like cameras, GPS, and biometrics." },
            { step: "04", title: "App Store Publishing", description: "Handling all the compliance and submission requirements for Apple and Google." }
        ],
        whyChooseUs: [
            "40% Faster Time-to-Market with Cross-Platform Codebases",
            "Stunning Native-like Animations (60FPS)",
            "End-to-End App Store Submission Assistance",
            "Robust Offline Synchronization Capabilities"
        ],
        techStack: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase", "App Store Connect"],
        faqs: [
            { question: "Should I build a native or cross-platform app?", answer: "For 95% of businesses, cross-platform (React Native/Flutter) is the best choice because it drastically reduces cost and development time while offering near-native performance." },
            { question: "Will you help me publish the app to the App Store?", answer: "Yes, we handle the entire submission process for both the Apple App Store and Google Play Store, ensuring all compliance guidelines are met." },
            { question: "Can the app integrate with my existing website?", answer: "Absolutely. We can connect your mobile app to the same backend database and APIs that power your website, ensuring data is perfectly synced in real-time." }
        ]
    },
    {
        slug: "digital-marketing",
        title: "Data-Driven Digital Marketing",
        shortDescription: "ROI-focused campaigns. We don't just run ads; we analyze user behavior to construct funnels that convert visitors into loyal customers.",
        icon: FaChartLine,
        features: ["Conversion Optimization", "Audience Segmentation", "Retargeting Strategies"],
        seoTitle: "Data-Driven Digital Marketing & Lead Generation Services",
        seoDescription: "Maximize your ROI with our data-driven digital marketing services. We specialize in PPC, conversion rate optimization, and advanced retargeting funnels.",
        keywords: ["Digital marketing agency", "Conversion rate optimization", "PPC management", "Data-driven marketing", "Sales funnel optimization", "Lead generation services"],
        heroSubtitle: "Turn Traffic into Revenue with Precision Marketing",
        contentParagraphs: [
            "Traffic is worthless if it doesn't convert. Traditional marketing agencies focus on vanity metrics like 'impressions' and 'clicks'. We focus on the only metric that matters: Return on Investment (ROI). Our Data-Driven Digital Marketing services are engineered to build high-converting sales funnels.",
            "We take an analytical approach to marketing. By implementing advanced tracking pixels and utilizing tools like Google Analytics 4 and Hotjar, we study exactly how users interact with your brand. We then use this data to aggressively A/B test ad copy, landing pages, and email sequences.",
            "Our expertise spans across Google Ads (Search & Display), Meta Ads (Facebook & Instagram), and automated email marketing. We deploy hyper-targeted audience segmentation and aggressive retargeting campaigns to ensure no potential customer slips through the cracks."
        ],
        keyBenefits: [
            { title: "Maximized ROI", description: "Stop wasting money on ineffective ads. We continuously optimize campaigns to lower your Cost Per Acquisition (CPA)." },
            { title: "Advanced Tracking", description: "Know exactly where every dollar goes with comprehensive attribution modeling and pixel tracking." },
            { title: "Automated Nurturing", description: "Convert cold leads into buyers over time with automated email and SMS drip campaigns." }
        ],
        process: [
            { step: "01", title: "Audience Research", description: "Identifying your ideal customer profiles and where they spend their time online." },
            { step: "02", title: "Funnel Creation", description: "Building high-converting landing pages and lead capture forms." },
            { step: "03", title: "Campaign Launch", description: "Deploying targeted ads across Google, Meta, and LinkedIn." },
            { step: "04", title: "Optimization", description: "Continuous A/B testing of creatives and copy to lower customer acquisition costs." }
        ],
        whyChooseUs: [
            "Focus strictly on Revenue and ROI, not Vanity Metrics",
            "Advanced Multi-Touch Attribution Modeling",
            "In-House Copywriters and Landing Page Designers",
            "Transparent Weekly Performance Reporting"
        ],
        techStack: ["Google Ads", "Meta Ads Manager", "Google Analytics 4", "Hotjar", "Mailchimp", "Zapier"],
        faqs: [
            { question: "Which platform is best for my business?", answer: "It depends on your product. B2B businesses usually perform best on Google Search and LinkedIn, while B2C visual products excel on Meta (Facebook/Instagram) and TikTok." },
            { question: "How soon will I see results?", answer: "While PPC campaigns can generate leads within the first 48 hours, it typically takes 2-4 weeks of data collection and A/B testing to fully optimize the funnel for maximum ROI." },
            { question: "Do you design the ad creatives and landing pages?", answer: "Yes, our team handles everything end-to-end: copywriting, graphic design, landing page development, and campaign management." }
        ]
    },
    {
        slug: "ai-seo-services",
        title: "AI-Powered SEO & Discovery",
        shortDescription: "Next-gen search dominance. Utilizing AI to analyze search intent and optimize content structure for maximum organic visibility and authority.",
        icon: FaSearchDollar,
        features: ["Semantic Search", "Technical Audits", "Competitor Analysis"],
        seoTitle: "AI-Powered SEO Services | Dominate Google Search Rankings",
        seoDescription: "Future-proof your organic traffic with AI-powered SEO. We combine technical audits, programmatic SEO, and semantic content optimization to rank you #1.",
        keywords: ["AI SEO services", "Technical SEO audit", "Programmatic SEO", "Semantic search optimization", "Search engine optimization company", "Organic traffic growth"],
        heroSubtitle: "Dominate Search Results with Next-Gen SEO Strategies",
        contentParagraphs: [
            "The days of keyword stuffing and spammy backlinks are over. Google's algorithm is now an incredibly advanced AI that understands context, semantics, and user intent. To rank at the top, you need an SEO strategy that speaks directly to this AI. That's where our AI-Powered SEO Services come in.",
            "We utilize advanced machine learning tools to conduct deep competitor analysis and identify semantic content gaps in your industry. By structuring your website's data with precise JSON-LD Schema markup, we spoon-feed Google exactly what it needs to award you highly coveted Rich Snippets and featured spots.",
            "Our approach is highly technical. We fix the underlying foundation of your website—optimizing Core Web Vitals, fixing crawl errors, and ensuring lightning-fast load times. We then deploy Programmatic SEO strategies to automatically generate hundreds of highly-targeted, valuable landing pages at scale."
        ],
        keyBenefits: [
            { title: "Technical Perfection", description: "We audit and fix site architecture, crawlability, and speed issues that are secretly tanking your rankings." },
            { title: "Programmatic Scale", description: "Dominate long-tail keywords by generating hundreds of optimized, unique pages targeting specific locales or use-cases." },
            { title: "Semantic Authority", description: "Build topical authority clusters that signal to Google you are the ultimate expert in your niche." }
        ],
        process: [
            { step: "01", title: "Technical Audit", description: "Fixing crawl errors, broken links, and Core Web Vitals speed metrics." },
            { step: "02", title: "Keyword Research", description: "Using AI to identify high-volume, low-competition semantic keywords." },
            { step: "03", title: "Content Strategy", description: "Creating topical clusters and generating highly optimized landing pages." },
            { step: "04", title: "Authority Building", description: "Acquiring high-quality, white-hat backlinks from authoritative domains." }
        ],
        whyChooseUs: [
            "AI-Driven Semantic Topic Modeling",
            "White-Hat Technical and Programmatic SEO Strategies",
            "Guaranteed Core Web Vitals Improvements",
            "Transparent Rank Tracking and Traffic Reporting"
        ],
        techStack: ["Ahrefs", "Semrush", "Google Search Console", "Screaming Frog", "SurferSEO", "JSON-LD"],
        faqs: [
            { question: "How long does SEO take to work?", answer: "SEO is a long-term investment. While technical fixes can show improvements in weeks, building topical authority and ranking for competitive keywords generally takes 3 to 6 months of consistent effort." },
            { question: "Do you build backlinks?", answer: "Yes, but only high-quality, white-hat links. We focus on digital PR, guest posting on authoritative industry blogs, and creating 'linkable asset' content that naturally attracts inbound links." },
            { question: "What is Programmatic SEO?", answer: "It's a strategy where we use a database to dynamically generate hundreds of high-quality landing pages at once (e.g., 'Best Plumber in [City]'). It's the strategy companies like Zillow and Yelp use to get millions of visitors." }
        ]
    },
    {
        slug: "cloud-infrastructure",
        title: "Cloud Infrastructure & DevOps",
        shortDescription: "Resilient environments for your code. We architect secure, scalable cloud infrastructure and automated CI/CD pipelines to ensure zero downtime.",
        icon: FaCloud,
        features: ["AWS / Azure / GCP", "Automated Pipelines", "Container Orchestration"],
        seoTitle: "Cloud Infrastructure & DevOps Consulting Services",
        seoDescription: "Secure, scalable, and highly available cloud infrastructure. We provide expert DevOps consulting, CI/CD automation, and cloud migration for AWS and GCP.",
        keywords: ["Cloud infrastructure setup", "DevOps consulting services", "AWS cloud migration", "CI/CD pipeline automation", "Kubernetes orchestration", "Cloud security audits"],
        heroSubtitle: "Bulletproof Infrastructure for Scaling Businesses",
        contentParagraphs: [
            "If your application goes down, your business loses money and reputation. Our Cloud Infrastructure & DevOps services ensure your software operates in a highly available, secure, and infinitely scalable environment, capable of handling sudden viral traffic spikes without breaking a sweat.",
            "We are experts in architecting solutions on Amazon Web Services (AWS), Google Cloud Platform (GCP), and Vercel. We move your monolithic applications into modern, containerized microservices using Docker and Kubernetes. This drastically reduces your server costs while improving application resilience.",
            "Development speed is critical. We build robust Continuous Integration and Continuous Deployment (CI/CD) pipelines. This means your developers can safely push new features to production multiple times a day with automated testing, zero downtime, and instant rollback capabilities."
        ],
        keyBenefits: [
            { title: "Zero Downtime Deployments", description: "Push updates to your live application at any time of day without interrupting your active users." },
            { title: "Auto-Scaling", description: "Your servers automatically duplicate themselves during traffic spikes and scale down during quiet hours to save money." },
            { title: "Disaster Recovery", description: "Automated multi-region database backups ensure you never lose data, even in the event of a catastrophic server failure." }
        ],
        process: [
            { step: "01", title: "Infrastructure Audit", description: "Reviewing your current server setup for security vulnerabilities and cost inefficiencies." },
            { step: "02", title: "Architecture Design", description: "Designing a scalable, containerized microservices architecture." },
            { step: "03", title: "CI/CD Setup", description: "Automating your deployment pipeline using GitHub Actions or Jenkins." },
            { step: "04", title: "Monitoring & Alerts", description: "Setting up Datadog or Prometheus to instantly alert you of any system anomalies." }
        ],
        whyChooseUs: [
            "Certified AWS and GCP Cloud Architects",
            "Infrastructure as Code (Terraform) Methodologies",
            "Expertise in Kubernetes and Docker Containerization",
            "24/7 Monitoring and Emergency Support Availability"
        ],
        techStack: ["AWS", "Google Cloud", "Kubernetes", "Docker", "Terraform", "GitHub Actions"],
        faqs: [
            { question: "Which cloud provider should we use?", answer: "It depends on your stack. We highly recommend Vercel for Next.js frontends, and AWS or Google Cloud Platform (GCP) for heavy backend processing and database hosting." },
            { question: "Can you help migrate our existing app to the cloud?", answer: "Yes. We offer seamless cloud migration services, moving your data and applications from on-premise servers or outdated hosts to modern cloud architecture with minimal downtime." },
            { question: "What is CI/CD?", answer: "Continuous Integration/Continuous Deployment is an automated process where every code change made by your developers is automatically tested for bugs and deployed to your live server, eliminating manual deployment errors." }
        ]
    }
];
