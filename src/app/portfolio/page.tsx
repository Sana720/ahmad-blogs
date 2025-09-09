// ...existing code...

import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getPortfolioProjects, getPortfolioTestimonials } from "../../utils/portfolioFirestore";

export default async function PortfolioPage() {
  const projects = await getPortfolioProjects();
  const testimonials = await getPortfolioTestimonials();

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-extrabold text-center mb-10 text-[#232946]">My Portfolio</h1>
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-[#3CB371]">Projects</h2>
          <div
            className={`grid gap-8 ${projects.length === 1 ? 'place-items-center' : 'grid-cols-1 md:grid-cols-2'}`}
          >
            {projects.map((project: any, idx: number) => (
              <a
                key={idx}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-[#f7f8fa] rounded-xl shadow hover:shadow-lg transition-shadow p-8 min-w-[320px] max-w-[400px] w-full min-h-[420px] flex flex-col justify-between group"
              >
                <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden mb-4 bg-[#eaf0f6]">
                  <Image
                    src={project.image || project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 420px"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-[#232946] group-hover:text-[#3CB371]">{project.title}</h3>
                <p className="text-[#444] mb-4 text-base">{project.description}</p>
                <span className="text-[#3CB371] font-semibold mt-auto">View Project →</span>
              </a>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-6 text-[#3CB371]">Client Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t: any, idx: number) => (
              <div key={idx} className="bg-[#f7f8fa] rounded-xl shadow p-6 flex gap-4 items-center">
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
