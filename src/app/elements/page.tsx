import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function ElementsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto py-16 px-4 text-[#232946] bg-white">
        <h1 className="text-4xl font-extrabold mb-6">Elements</h1>
        <p className="text-lg mb-4">This page showcases UI elements used across the site (typography, buttons, cards).</p>
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Buttons</h2>
            <div className="flex gap-4 mt-2">
              <button className="bg-[#3CB371] text-white px-4 py-2 rounded">Primary</button>
              <button className="border border-gray-300 px-4 py-2 rounded">Secondary</button>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <div className="p-4 bg-white rounded shadow">Card</div>
              <div className="p-4 bg-white rounded shadow">Card</div>
              <div className="p-4 bg-white rounded shadow">Card</div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
