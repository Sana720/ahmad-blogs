import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto py-16 px-4 text-[#232946] bg-white">
        <h1 className="text-4xl font-extrabold mb-6">Terms & Conditions</h1>
        <p className="text-lg mb-4">Effective date: 26 August 2025</p>
        <section className="prose max-w-none">
          <h2>Introduction</h2>
          <p>These Terms and Conditions govern your use of ahmadblogs.com ("the Site"). By accessing or using the Site you agree to be bound by these Terms.</p>

          <h2>Content and Use</h2>
          <p>The Site publishes blog content including how-to guides and articles about AI. Content is intended for informational purposes. You may view and share links to content, but reproduction or commercial use requires permission.</p>

          <h2>User Accounts and Newsletter</h2>
          <p>When you subscribe to our newsletter, you provide your email and consent to receive communications. You can unsubscribe at any time. If you create any account or submit content via the site, you are responsible for maintaining the confidentiality of your information.</p>

          <h2>User Conduct and Content</h2>
          <p>Users must not publish unlawful, defamatory, or infringing content. We reserve the right to remove content that violates these Terms. We may suspend or terminate access for users who breach these Terms.</p>

          <h2>Analytics, Tracking and Data Collection</h2>
          <p>We use analytics tools and cookies to measure traffic and usage to improve the Site. We may collect technical information (e.g., IP addresses, browser type, pages visited). Aggregated analytics data helps us understand trends and improve articles and features.</p>

          <h2>Intellectual Property</h2>
          <p>All content on the Site (text, images, logos) is the property of the Site or its licensors and is protected by copyright. Unauthorized use is prohibited.</p>

          <h2>Disclaimers and Limitation of Liability</h2>
          <p>Content is provided "as is" without warranties. The Site is not liable for indirect or consequential damages arising from use of the Site.</p>

          <h2>Changes to Terms</h2>
          <p>We may update these Terms from time to time. Changes will be posted on this page with an updated effective date.</p>

          <h2>Contact</h2>
          <p>Questions about these Terms should be directed via the Contact page or email: legal@ahmadblogs.com.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
