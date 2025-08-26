import Header from '../../components/Header';
import Footer from '../../components/Footer';
export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto py-16 px-4 text-[#232946] bg-white">
      <h1 className="text-4xl font-extrabold mb-6 text-[#232946]">Contact Us</h1>
      <p className="text-lg text-[#444] mb-4">Have a question, suggestion, or just want to say hello? We'd love to hear from you!</p>
      <form className="space-y-6 mt-8 max-w-xl">
        <div>
          <label className="block text-[#232946] font-semibold mb-1">Name</label>
          <input type="text" className="w-full border border-gray-300 rounded px-4 py-2" required />
        </div>
        <div>
          <label className="block text-[#232946] font-semibold mb-1">Email</label>
          <input type="email" className="w-full border border-gray-300 rounded px-4 py-2" required />
        </div>
        <div>
          <label className="block text-[#232946] font-semibold mb-1">Message</label>
          <textarea className="w-full border border-gray-300 rounded px-4 py-2" rows={5} required></textarea>
        </div>
        <button type="submit" className="bg-[#3CB371] text-white px-6 py-2 rounded font-bold hover:bg-[#232946] transition-colors">Send Message</button>
      </form>
      </main>
      <Footer />
    </div>
  );
}
