"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getPortfolioProjects, getPortfolioTestimonials } from "../../utils/portfolioFirestore";

export default function PortfolioPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [projectPage, setProjectPage] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const projectsPerPage = 3;
  const testimonialsPerSlide = 3;

  useEffect(() => {
    getPortfolioProjects().then(setProjects);
    getPortfolioTestimonials().then(setTestimonials);
  }, []);

  const paginatedProjects = projects.slice(projectPage * projectsPerPage, (projectPage + 1) * projectsPerPage);
  const testimonialSlides = [];
  for (let i = 0; i < testimonials.length; i += testimonialsPerSlide) {
    testimonialSlides.push(testimonials.slice(i, i + testimonialsPerSlide));
  }

  useEffect(() => {
    if (testimonialSlides.length <= 1) return;
    const interval = setInterval(() => {
      setTestimonialIndex(i => (i + 1) % testimonialSlides.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [testimonialSlides.length]);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-extrabold text-center mb-10 text-[#232946]">My Portfolio</h1>
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-[#3CB371]">Projects</h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {paginatedProjects.map((project: any, idx: number) => (
              <div key={project.id || idx} className="rounded-xl overflow-hidden shadow bg-white">
                {project.image && (
                  <div className="relative w-full aspect-[16/9] sm:aspect-[4/3] md:aspect-[16/7] max-w-full">
                    <Image
                      src={project.image || project.imageUrl}
                      alt={project.title}
                      fill
                      className="object-cover rounded-md w-full h-auto max-w-full"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={false}
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-extrabold mb-2 hover:text-[#3CB371] text-[#222]">{project.title}</h3>
                  <p className="text-[#444] text-sm font-normal line-clamp-2">{project.description}</p>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-[#3CB371] font-semibold mt-2 block">View Project →</a>
                </div>
              </div>
            ))}
          </div>
          {/* Numbered pagination buttons */}
          <div className="flex justify-center items-center gap-2 mt-12">
            {Array.from({ length: Math.ceil(projects.length / projectsPerPage) }, (_, i) => (
              <button
                key={i}
                className={`px-3 py-1 rounded border ${projectPage === i ? 'bg-[#3CB371] text-white' : 'bg-white text-[#222]'}`}
                onClick={() => setProjectPage(i)}
                disabled={projectPage === i}
              >{i + 1}</button>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-6 text-[#3CB371]">Client Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialSlides.length > 0 && testimonialSlides[testimonialIndex].map((t: any, idx: number) => (
              <div key={t.id || idx} className="bg-[#f7f8fa] rounded-xl shadow p-6 flex gap-4 items-center">
                <Image
                  src={t.avatar || t.avatarUrl}
                  alt={t.name}
                  width={64}
                  height={64}
                  className="rounded-full object-cover border-2 border-[#3CB371]"
                />
                <div>
                  <p className="text-[#232946] font-medium mb-2">"{t.feedback}"</p>
                  <div className="text-[#3CB371] font-bold">{t.name}</div>
                  <div className="text-[#888] text-sm">{t.company}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
