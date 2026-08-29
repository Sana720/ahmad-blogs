import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FaCheckCircle, FaWhatsapp, FaArrowLeft, FaLayerGroup, FaBolt, FaShieldAlt, FaStar } from "react-icons/fa";
import { servicesData, ServiceDetail } from "../../../data/servicesContent";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import CategoryMenu from "../../../components/CategoryMenu";

export async function generateStaticParams() {
    return servicesData.map((service) => ({
        slug: service.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const service = servicesData.find((s) => s.slug === slug);

    if (!service) {
        return {
            title: "Service Not Found",
        };
    }

    const canonicalUrl = `https://www.ahmadblogs.com/services/${service.slug}`;

    return {
        title: service.seoTitle,
        description: service.seoDescription,
        keywords: service.keywords,
        openGraph: {
            title: service.seoTitle,
            description: service.seoDescription,
            url: canonicalUrl,
            type: "website",
            siteName: "Ahmad Blogs",
        },
        twitter: {
            card: "summary_large_image",
            title: service.seoTitle,
            description: service.seoDescription,
            site: "@ahmadblogs",
        },
        alternates: {
            canonical: canonicalUrl,
        },
    };
}

export default async function ServiceDetailPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const service = servicesData.find((s) => s.slug === params.slug);

    if (!service) {
        return notFound();
    }

    const canonicalUrl = `https://www.ahmadblogs.com/services/${service.slug}`;

    const schema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": service.title,
        "description": service.seoDescription,
        "provider": {
            "@type": "Organization",
            "name": "Ahmad Blogs",
            "url": "https://www.ahmadblogs.com",
            "logo": "https://www.ahmadblogs.com/favicon.svg"
        },
        "url": canonicalUrl,
        "serviceType": service.title,
        "areaServed": "Worldwide"
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": service.faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-green-100 selection:text-green-800">
            <Header categoryMenu={<CategoryMenu />} />

            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

            <main className="flex-1">
                {/* HERO SECTION - GLASSMORPHISM & GRADIENTS */}
                <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-slate-900">
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
                    {/* Glowing Orbs */}
                    <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-green-500/20 blur-[120px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-600/20 blur-[100px] rounded-full pointer-events-none" />

                    <div className="relative max-w-5xl mx-auto px-6 lg:px-8">
                        <Link href="/services" className="inline-flex items-center text-sm font-semibold text-slate-400 hover:text-green-400 mb-10 transition-colors">
                            <FaArrowLeft className="mr-2" /> Back to all services
                        </Link>
                        
                        <div className="flex flex-col md:flex-row md:items-center mb-8 gap-6">
                            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-2xl border border-white/10 shrink-0">
                                <service.icon className="w-10 h-10 text-green-400" />
                            </div>
                            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
                                {service.title}
                            </h1>
                        </div>
                        
                        <p className="text-xl md:text-2xl font-light text-slate-300 leading-relaxed mb-10 max-w-3xl">
                            {service.heroSubtitle}
                        </p>
                        
                        <div className="flex flex-wrap gap-4">
                            <a 
                                href="https://wa.me/917209362004"
                                target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center px-8 py-4 bg-green-500 hover:bg-green-400 text-slate-900 font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-500/30 hover:-translate-y-1"
                            >
                                <FaWhatsapp className="w-6 h-6 mr-3" />
                                Start Your Project
                            </a>
                        </div>
                    </div>
                </section>

                {/* CONTENT & BENEFITS SECTION */}
                <section className="py-24 px-6 lg:px-8 bg-white">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
                        {/* Left Column: Content */}
                        <div className="lg:col-span-7">
                            <div className="prose prose-lg prose-slate max-w-none">
                                {service.contentParagraphs.map((paragraph, idx) => (
                                    <p key={idx} className="text-lg leading-relaxed text-slate-700 mb-8">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>

                            {/* Tech Stack Badges */}
                            <div className="mt-12 pt-12 border-t border-slate-100">
                                <h3 className="text-2xl font-bold text-slate-900 mb-6">Technologies We Use</h3>
                                <div className="flex flex-wrap gap-3">
                                    {service.techStack.map((tech, idx) => (
                                        <span key={idx} className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-full text-sm border border-slate-200">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Key Benefits */}
                        <div className="lg:col-span-5">
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 sticky top-32">
                                <h3 className="text-2xl font-bold text-slate-900 mb-8">Key Benefits</h3>
                                <div className="space-y-8">
                                    {service.keyBenefits.map((benefit, idx) => (
                                        <div key={idx} className="flex group">
                                            <div className="mr-4 mt-1">
                                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-500 group-hover:scale-110 transition-all duration-300">
                                                    <FaCheckCircle className="w-4 h-4 text-green-600 group-hover:text-white" />
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold text-slate-900 mb-2">{benefit.title}</h4>
                                                <p className="text-slate-600 leading-relaxed text-sm">
                                                    {benefit.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* OUR PROCESS TIMELINE SECTION */}
                <section className="py-24 px-6 lg:px-8 bg-slate-900 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/10 blur-[100px] rounded-full pointer-events-none" />
                    <div className="max-w-5xl mx-auto relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Proven Process</h2>
                            <p className="text-xl text-slate-400">How we turn complex challenges into elegant solutions.</p>
                        </div>
                        
                        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-green-500/50 before:to-transparent">
                            {service.process.map((step, idx) => (
                                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    {/* Icon Marker */}
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 bg-green-500 text-slate-900 font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-xl shadow-green-500/20 z-10">
                                        {step.step}
                                    </div>
                                    {/* Content Card */}
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-slate-800 border border-slate-700 shadow-xl group-hover:border-green-500/50 transition-colors">
                                        <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                                        <p className="text-slate-400 leading-relaxed">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* WHY CHOOSE US - GLASSMORPHISM CARDS */}
                <section className="py-24 px-6 lg:px-8 bg-slate-50">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Why Choose Us?</h2>
                            <p className="text-xl text-slate-600 max-w-2xl mx-auto">We deliver unmatched quality and precision.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {service.whyChooseUs.map((reason, idx) => (
                                <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg shadow-slate-200/50 hover:-translate-y-2 hover:border-green-300 transition-all duration-300 text-center flex flex-col items-center">
                                    <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-6 text-green-600">
                                        {idx === 0 ? <FaStar className="w-8 h-8" /> : 
                                         idx === 1 ? <FaShieldAlt className="w-8 h-8" /> :
                                         idx === 2 ? <FaLayerGroup className="w-8 h-8" /> : 
                                         <FaBolt className="w-8 h-8" />}
                                    </div>
                                    <p className="font-bold text-slate-900 text-lg">{reason}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQS */}
                <section className="py-24 px-6 lg:px-8 bg-white border-t border-slate-100">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 text-center">Frequently Asked Questions</h2>
                        <div className="space-y-6">
                            {service.faqs.map((faq, idx) => (
                                <div key={idx} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                    <h3 className="text-xl font-bold text-slate-900 mb-4">{faq.question}</h3>
                                    <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                
                {/* FINAL CTA */}
                <section className="relative py-32 bg-slate-900 text-center px-6 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-green-500/20 blur-[120px] rounded-full pointer-events-none" />
                    
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Ready to upgrade your business?</h2>
                        <p className="text-xl text-slate-400 mb-10">Let's discuss how {service.title} can drive real results for your company.</p>
                        <a 
                            href="https://wa.me/917209362004"
                            target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center px-10 py-5 bg-green-500 hover:bg-green-400 text-slate-900 text-lg font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-green-500/20 hover:shadow-green-500/40 hover:-translate-y-1"
                        >
                            <FaWhatsapp className="w-6 h-6 mr-3" />
                            Start Your Project Today
                        </a>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
