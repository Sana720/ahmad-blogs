"use client";
import Header from '../../components/Header';
import CategoryMenu from '../../components/CategoryMenu';
import Footer from '../../components/Footer';
import { useState } from 'react';
import { db } from '../../utils/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      await addDoc(collection(db, 'contacts'), {
        ...form,
        createdAt: serverTimestamp(),
      });
      setSuccess(true);
      setForm({ name: '', email: '', message: '' });
    } catch (err: any) {
      setError('Failed to send message. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
  <Header categoryMenu={<CategoryMenu />} />
      <main className="flex-1 max-w-3xl mx-auto py-16 px-4 text-[#232946] bg-white">
        <h1 className="text-4xl font-extrabold mb-6 text-[#232946]">Contact Us</h1>
        <p className="text-lg text-[#444] mb-4">Have a question, suggestion, or just want to say hello? We'd love to hear from you!</p>
        <form className="space-y-6 mt-8 max-w-xl" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[#232946] font-semibold mb-1">Name</label>
            <input name="name" type="text" className="w-full border border-gray-300 rounded px-4 py-2" required value={form.name} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-[#232946] font-semibold mb-1">Email</label>
            <input name="email" type="email" className="w-full border border-gray-300 rounded px-4 py-2" required value={form.email} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-[#232946] font-semibold mb-1">Message</label>
            <textarea name="message" className="w-full border border-gray-300 rounded px-4 py-2" rows={5} required value={form.message} onChange={handleChange}></textarea>
          </div>
          <button type="submit" className="bg-[#3CB371] text-white px-6 py-2 rounded font-bold hover:bg-[#232946] transition-colors" disabled={loading}>{loading ? 'Sending...' : 'Send Message'}</button>
        </form>
        {success && <div className="mt-4 text-green-600 font-semibold">Message sent successfully!</div>}
        {error && <div className="mt-4 text-red-600 font-semibold">{error}</div>}
      </main>
      <Footer />
    </div>
  );
}
