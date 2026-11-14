"use client";
import Header from '../../components/Header';
import CategoryMenu from '../../components/CategoryMenu';
import Footer from '../../components/Footer';
import { useState } from 'react';
import { db } from '../../utils/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { trackEvent } from '../../utils/analytics';

export default function ContactClient() {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        trackEvent("contact_click", { channel: "contact_form" });
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Failed to send message.');
            }

            setSuccess(true);
            setForm({ name: '', email: '', message: '' });
        } catch (err: any) {
            console.error('Contact submission error:', err);
            // Fallback: attempt direct Firestore save if API request encounters network issue
            try {
                await addDoc(collection(db, 'contacts'), {
                    ...form,
                    createdAt: serverTimestamp(),
                });
                setSuccess(true);
                setForm({ name: '', email: '', message: '' });
            } catch (fallbackErr) {
                setError(err.message || 'Failed to send message. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header categoryMenu={<CategoryMenu />} />
            <main className="flex-1 max-w-3xl mx-auto py-16 px-4 text-[#232946] bg-white">
                <h1 className="text-4xl font-extrabold mb-4 text-[#232946] tracking-tight">Contact Us</h1>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    Have a question, suggestion, or need support? Fill out the form below and we will get back to you directly via email.
                </p>

                {success && (
                    <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-emerald-900 animate-in fade-in duration-200">
                        <svg className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        <div>
                            <p className="font-bold">Thank you! Your message has been sent successfully.</p>
                            <p className="text-sm text-emerald-700 mt-0.5">We have received your note and will reply to your email shortly.</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-800 animate-in fade-in duration-200">
                        <svg className="w-5 h-5 text-red-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                <form className="space-y-5 max-w-xl bg-gray-50/50 p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-xs" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-[#232946] text-sm font-bold mb-1.5">
                            Your Name <span className="text-red-500">*</span>
                        </label>
                        <input 
                            name="name" 
                            type="text" 
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-[#3CB371] focus:ring-3 focus:ring-[#3CB371]/15 transition-all" 
                            required 
                            placeholder="John Doe"
                            value={form.name} 
                            onChange={handleChange} 
                        />
                    </div>
                    <div>
                        <label className="block text-[#232946] text-sm font-bold mb-1.5">
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        <input 
                            name="email" 
                            type="email" 
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-[#3CB371] focus:ring-3 focus:ring-[#3CB371]/15 transition-all" 
                            required 
                            placeholder="john@example.com"
                            value={form.email} 
                            onChange={handleChange} 
                        />
                    </div>
                    <div>
                        <label className="block text-[#232946] text-sm font-bold mb-1.5">
                            Message <span className="text-red-500">*</span>
                        </label>
                        <textarea 
                            name="message" 
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-[#3CB371] focus:ring-3 focus:ring-[#3CB371]/15 transition-all" 
                            rows={5} 
                            required 
                            placeholder="How can we help you?"
                            value={form.message} 
                            onChange={handleChange}
                        ></textarea>
                    </div>
                    <button 
                        type="submit" 
                        className="w-full sm:w-auto bg-[#3CB371] hover:bg-[#2e945b] active:scale-[0.98] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50" 
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Sending...</span>
                            </>
                        ) : (
                            <span>Send Message</span>
                        )}
                    </button>
                </form>
            </main>
            <Footer />
        </div>
    );
}
