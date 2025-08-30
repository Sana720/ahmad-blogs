export const metadata = {
  title: "Privacy Policy | Ahmed Blogs",
  description: "Read the privacy policy for Ahmed Blogs. Learn how we collect, use, and protect your personal data, and your rights as a visitor or subscriber.",
  openGraph: {
    title: "Privacy Policy | Ahmed Blogs",
    description: "Read the privacy policy for Ahmed Blogs. Learn how we collect, use, and protect your personal data, and your rights as a visitor or subscriber.",
    url: "https://ahmadblogs.com/privacy-policy",
    type: "article",
    images: [
      {
        url: "/favicon.svg",
        width: 512,
        height: 512,
        alt: "Ahmed Blogs Logo",
      },
    ],
    siteName: "Ahmed Blogs",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Ahmed Blogs",
    description: "Read the privacy policy for Ahmed Blogs. Learn how we collect, use, and protect your personal data, and your rights as a visitor or subscriber.",
    images: ["/favicon.svg"],
    creator: "@ahmadblogs"
  },
  alternates: {
    canonical: "https://ahmadblogs.com/privacy-policy"
  }
};
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto py-16 px-4 text-[#232946] bg-white">
        <h1 className="text-4xl font-extrabold mb-6">Privacy Policy</h1>
        <p className="text-lg mb-4">Effective date: 26 August 2025</p>
        <section className="prose max-w-none">
          <h2>Introduction</h2>
          <p>Welcome to ahmadblogs.com ("the Site"). Your privacy matters. This Privacy Policy explains what personal data we collect, why we collect it, and how we use and protect it. By using the Site, you agree to the collection and use of information in accordance with this policy.</p>

          <h2>Information We Collect</h2>
          <p>We collect information you provide directly (for example, when you subscribe to the newsletter or send a message via the Contact form). This may include your name and email address. We also collect technical data automatically — such as IP address, browser type, pages visited, and referring URLs — using cookies and analytics tools.</p>

          <h2>Newsletter</h2>
          <p>If you subscribe to our newsletter we will store your email address and (optionally) name to send you updates. You can unsubscribe at any time using the link in the emails or by contacting us at the address below.</p>

          <h2>Analytics and Tracking</h2>
          <p>We use analytics tools to understand how visitors use the Site (for example, pageviews, session duration, and traffic sources). This helps us improve content such as how-to guides and articles about AI. Analytics data is aggregated and does not identify individual users. If you prefer not to be tracked, you can use browser settings or opt-out tools provided by the analytics provider.</p>

          <h2>How We Use Information</h2>
          <p>We use collected information to operate, maintain, and improve the Site, to send newsletters and updates when requested, and to respond to inquiries. We may also use data for internal analytics and security purposes.</p>

          <h2>Data Sharing</h2>
          <p>We do not sell personal data. We may share data with third-party service providers who perform services on our behalf (for example, email delivery or analytics). These providers are contractually required to safeguard your information.</p>

          <h2>Cookies</h2>
          <p>Cookies are used to remember user preferences, provide basic site functionality, and collect anonymous usage metrics. You can disable cookies in your browser, but some features of the Site may not function properly.</p>

          <h2>Data Retention and Security</h2>
          <p>We retain personal data for as long as necessary to provide our services and fulfill the purposes described in this policy. We implement reasonable security measures to protect your data, but no system is perfectly secure.</p>

          <h2>Contact</h2>
          <p>If you have questions or requests regarding your personal data, contact us via the Contact page or email: privacy@ahmadblogs.com.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
