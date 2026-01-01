import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
    FaLaptopCode,
    FaMobileAlt,
    FaChartLine,
    FaSearchDollar,
    FaCogs,
    FaArrowRight,
    FaCheckCircle,
    FaLayerGroup,
    FaCloud
} from "react-icons/fa";
// Assuming you have these components set up
import Header from "../../components/Header";
import CategoryMenu from "../../components/CategoryMenu";
import Footer from "../../components/Footer";

export const metadata: Metadata = {
    title: "Services | Ahmad Blogs - Enterprise Coding & Digital Solutions",
    description: "Explore our premium technical services: Enterprise ERP, Full-Stack Development, Mobile Apps, AI SEO, and Cloud Infrastructure. We build digital excellence.",
    openGraph: {
        title: "Services | Ahmad Blogs - Enterprise Coding & Digital Solutions",
        description: "Explore our premium technical services: Enterprise ERP, Full-Stack Development, Mobile Apps, AI SEO, and Cloud Infrastructure. We build digital excellence.",
        url: "https://ahmadblogs.com/services",
        type: "website",
    }
};

// Data Structure
const services = [
    {
        title: "Enterprise ERP Solutions",
        description: "Scalable architecture to unify your business operations. We build custom ERPs that integrate finance, HR, and supply chain into one cohesive ecosystem.",
        icon: FaCogs,
        features: ["Automated Workflows", "Real-time Analytics", "Secure Cloud Infrastructure"]
    },
    {
        title: "Full-Stack Web Development",
        description: "Performance-first web applications. We utilize Next.js and modern frameworks to deliver SEO-optimized, lightning-fast, and responsive digital experiences.",
        icon: FaLaptopCode,
        features: ["Server Side Rendering", "API Integration", "Progressive Web Apps"]
    },
    {
        title: "Mobile Application Development",
        description: "Native and Cross-platform solutions. We engineer intuitive mobile apps for iOS and Android that focus on retention and seamless user capability.",
        icon: FaMobileAlt,
        features: ["React Native / Flutter", "Offline Capabilities", "Biometric Security"]
    },
    {
        title: "Data-Driven Digital Marketing",
        description: "ROI-focused campaigns. We don't just run ads; we analyze user behavior to construct funnels that convert visitors into loyal customers.",
        icon: FaChartLine,
        features: ["Conversion Optimization", "Audience Segmentation", "Retargeting Strategies"]
    },
    {
        title: "AI-Powered SEO & Discovery",
        description: "Next-gen search dominance. Utilizing AI to analyze search intent and optimize content structure for maximum organic visibility and authority.",
        icon: FaSearchDollar,
        features: ["Semantic Search", "Technical Audits", "Competitor Analysis"]
    },
    {
        title: "Cloud Infrastructure & DevOps",
        description: "Resilient environments for your code. We architect secure, scalable cloud infrastructure and automated CI/CD pipelines to ensure zero downtime.",
        icon: FaCloud,
        features: ["AWS / Azure / GCP", "Automated Pipelines", "Container Orchestration"]
    },
];

export default function ServicesPage() {
    return (
        // Changed selection color to green
        <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900 selection:bg-green-100 selection:text-green-800">
            <Header categoryMenu={<CategoryMenu />} />

            <main className="flex-1">

                {/* --- HERO SECTION --- */}
                <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
                    {/* Technical Grid Background - Neutral Grey for contrast */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                    {/* Green Radial Gradient Blob */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-green-50/50 blur-[100px] rounded-full pointer-events-none" />

                    <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
                        {/* Status Badge - Updated to Green */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-100 mb-8 transition-transform hover:scale-105 cursor-default">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wider text-green-700">Available for new projects</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
                            Engineering <br className="hidden md:block" />
                            {/* Gradient Text - Green to Emerald */}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-700 via-green-600 to-emerald-500">
                                Digital Excellence
                            </span>
                        </h1>

                        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
                            We leverage cutting-edge technology stacks to build robust, scalable, and secure digital products. From architecture to deployment, we handle the complexity.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            {/* Primary Button - Dark Slate (Professional) */}
                            <Link
                                href="https://wa.me/917209362004"
                                className="group inline-flex items-center justify-center px-8 py-4 text-sm font-bold text-white transition-all duration-200 bg-slate-900 rounded-lg hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                            >
                                Discuss Your Project
                                <FaArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                            {/* Secondary Button - White with Green Hover tint */}
                            <Link
                                href="/portfolio"
                                className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold text-slate-700 transition-all duration-200 bg-white border border-slate-200 rounded-lg hover:bg-green-50 hover:border-green-200 hover:text-green-700 focus:outline-none"
                            >
                                View Case Studies
                            </Link>
                        </div>
                    </div>
                </section>

                {/* --- STATISTICS STRIP --- */}
                <div className="border-y border-slate-100 bg-slate-50/50">
                    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { label: "Projects Delivered", value: "150+" },
                            { label: "Client Satisfaction", value: "99%" },
                            { label: "Years Experience", value: "5+" },
                            { label: "Support Available", value: "24/7" },
                        ].map((stat, i) => (
                            <div key={i}>
                                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                                <div className="text-sm font-medium text-slate-500 uppercase tracking-wide mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- SERVICES GRID --- */}
                <section className="py-24 px-6 lg:px-8 bg-white relative">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-16 md:flex md:items-end md:justify-between">
                            <div className="max-w-2xl">
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                                    Comprehensive Technical Services
                                </h2>
                                <p className="mt-4 text-lg text-slate-600">
                                    We don't just write code; we solve business problems. Select a domain to see how we can upgrade your infrastructure.
                                </p>
                            </div>
                            <div className="hidden md:block">
                                <FaLayerGroup className="text-slate-100 text-6xl" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services.map((service, index) => (
                                <div
                                    key={index}
                                    // Border hover changes to green
                                    className="group relative p-8 bg-white rounded-2xl border border-slate-200 hover:border-green-300 transition-all duration-300 hover:shadow-2xl hover:shadow-green-900/5 hover:-translate-y-1 overflow-hidden"
                                >
                                    {/* Green Decorative Gradient Blob on Hover */}
                                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-green-50 rounded-full transition-transform duration-500 group-hover:scale-150"></div>

                                    <div className="relative z-10">
                                        {/* Icon Box - Dark Slate default, turns Green on Hover */}
                                        <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-6 shadow-lg shadow-slate-900/20 group-hover:bg-green-600 transition-colors duration-300">
                                            <service.icon className="w-5 h-5 text-white" />
                                        </div>

                                        <h3 className="text-xl font-bold text-slate-900 mb-3">
                                            {service.title}
                                        </h3>

                                        <p className="text-slate-600 leading-relaxed text-sm mb-6">
                                            {service.description}
                                        </p>

                                        {/* Tech Features List - Checkmarks are Green */}
                                        <ul className="space-y-2 mb-6">
                                            {service.features?.map((feature, idx) => (
                                                <li key={idx} className="flex items-center text-xs font-medium text-slate-500">
                                                    <FaCheckCircle className="w-3 h-3 text-green-500 mr-2" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>

                                        {/* Link Text - Turns Green */}
                                        <div className="pt-4 border-t border-slate-100 flex items-center text-slate-900 font-semibold text-sm group-hover:text-green-600 transition-colors">
                                            Explore Solution <FaArrowRight className="ml-2 w-3 h-3 transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- CTA SECTION --- */}
                <section className="relative py-24 bg-slate-900 overflow-hidden">
                    {/* Green/Emerald Abstract Shapes */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-green-900/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6">
                            Ready to modernize your infrastructure?
                        </h2>
                        <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
                            Schedule a technical consultation. We'll analyze your current stack, identify bottlenecks, and propose a scalable roadmap.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link
                                href="https://wa.me/917209362004"
                                // Button hover state uses green tint
                                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-slate-900 bg-white rounded-lg hover:bg-green-50 transition-all duration-300 shadow-lg hover:shadow-white/10"
                            >
                                Start Conversation
                            </Link>
                        </div>
                    </div>
                </section>

            </main>
            <Footer noMargin={true} bgColor="bg-slate-900" />

        </div>
    );
}