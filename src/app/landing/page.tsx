
"use client";
import Link from "next/link";
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-[#2d2346] via-[#3CB371]/30 to-[#f7f8fa] overflow-hidden">
      {/* Modern hero background shapes */}
      <div className="absolute inset-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute left-0 top-0 w-2/3 h-2/3 bg-gradient-to-br from-[#f7e6ff]/60 via-[#3CB371]/10 to-[#232946]/40 rounded-full blur-[120px]" />
        <div className="absolute right-0 bottom-0 w-1/2 h-1/2 bg-gradient-to-tr from-[#232946]/40 via-[#3CB371]/10 to-[#f7e6ff]/30 rounded-full blur-[100px]" />
      </div>
      <main className="flex-1 w-full mx-auto px-2 md:px-0">
        {/* Hero Section - Dribbble Inspired */}
        <section className="max-w-5xl mx-auto py-20 flex flex-col md:flex-row items-center justify-between gap-8 relative" style={{perspective:'1200px'}}>
          <div className="w-full md:w-1/2 text-left z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-xl" style={{textShadow:'0 8px 32px #23294680, 0 1px 0 #fff'}}>Build Websites, Apps & Your Coding Skills<br /><span className="text-[#f7e6ff]">with Ahmad</span></h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8 font-medium" style={{textShadow:'0 2px 12px #23294660'}}>Professional developer & coding mentor helping businesses and students succeed.</p>
            <div className="flex gap-4">
              <Link href="#contact" className="bg-[#3CB371] hover:bg-[#2e8b57] text-white px-7 py-3 rounded-full font-bold text-lg shadow-xl transition" style={{boxShadow:'0 8px 32px #3CB37180'}}>Hire Me</Link>
              <Link href="#lessons" className="bg-white hover:bg-[#f7e6ff] text-[#232946] px-7 py-3 rounded-full font-bold text-lg shadow-xl transition border border-[#232946]/10" style={{boxShadow:'0 8px 32px #f7e6ff80'}}>Learn Coding</Link>
            </div>
          </div>
          {/* 3D Orbiting avatars and stats */}
          <div className="w-full md:w-1/2 flex items-center justify-center relative h-[340px]" style={{transformStyle:'preserve-3d'}}>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] rounded-full border-2 border-[#f7e6ff]/30" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] rounded-full border-2 border-[#3CB371]/20" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] rounded-full border-2 border-[#232946]/20" />
            {/* Center stat with 3D effect */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center" style={{transform:'translateZ(40px)'}}>
              <div className="text-3xl md:text-4xl font-bold text-white" style={{textShadow:'0 4px 24px #3CB37180'}}>100+ Projects</div>
              <div className="text-lg text-[#f7e6ff]">Delivered</div>
            </div>
            {/* 3D Orbiting avatars (animated) */}
              <div className="absolute animate-[float_4s_ease-in-out_infinite]" style={{top:'10%',left:'70%',width:48,height:48,borderRadius:'50%',boxShadow:'0 8px 32px #23294680',transform:'translateZ(60px) rotateY(20deg)'}}>
                <Image src="/icon1.png" alt="Client" width={48} height={48} className="rounded-full" />
              </div>
              <div className="absolute animate-[float_5s_ease-in-out_infinite]" style={{top:'80%',left:'80%',width:44,height:44,borderRadius:'50%',boxShadow:'0 8px 32px #3CB37180',transform:'translateZ(40px) rotateY(-20deg)'}}>
                <Image src="/icon0.svg" alt="Student" width={44} height={44} className="rounded-full" />
              </div>
              <div className="absolute animate-[float_6s_ease-in-out_infinite]" style={{top:'20%',left:'10%',width:40,height:40,borderRadius:'50%',boxShadow:'0 8px 32px #f7e6ff80',transform:'translateZ(30px) rotateX(20deg)'}}>
                <Image src="/globe.svg" alt="Project" width={40} height={40} className="rounded-full" />
              </div>
                <div className="absolute animate-[float_4s_ease-in-out_infinite]" style={{top:'calc(50% + 60px)',left:'calc(50% - 130px)',width:40,height:40,borderRadius:'50%',boxShadow:'0 8px 32px #23294680',transform:'translate(-50%,-50%) translateZ(50px)'}}>
                  <Image src="/vercel.svg" alt="Portfolio" width={40} height={40} className="rounded-full" />
                </div>
                <div className="absolute animate-[float_5s_ease-in-out_infinite]" style={{top:'calc(50% - 10px)',left:'calc(50% + 130px)',width:44,height:44,borderRadius:'50%',boxShadow:'0 8px 32px #3CB37180',transform:'translate(-50%,-50%) translateZ(20px)'}}>
                  <Image src="/icon1.png" alt="Mentor" width={44} height={44} className="rounded-full" />
                </div>
                <div className="absolute animate-[float_6s_ease-in-out_infinite]" style={{top:'calc(50% + 130px)',left:'calc(50% - 40px)',width:40,height:40,borderRadius:'50%',boxShadow:'0 8px 32px #f7e6ff80',transform:'translate(-50%,-50%) translateZ(30px)'}}>
                  <Image src="/icon0.svg" alt="Client" width={40} height={40} className="rounded-full" />
                </div>
            <style>{`
              @keyframes float {
                0% { transform: translateY(0) scale(1) }
                50% { transform: translateY(-16px) scale(1.08) }
                100% { transform: translateY(0) scale(1) }
              }
            `}</style>
          </div>
        </section>

        {/* Key Benefits */}
        <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 py-16 relative">
          <div className="absolute right-0 top-1/2 w-32 h-32 bg-gradient-to-br from-[#3CB371]/30 to-[#232946]/30 rounded-full blur-2xl -z-10" style={{filter:'blur(40px)',opacity:0.5}} />
          <div className="bg-gradient-to-br from-[#232946] via-[#3CB371]/20 to-[#232946]/80 rounded-3xl shadow-2xl p-10 border border-[#3CB371]/20">
            <h2 className="text-2xl font-bold text-white mb-4 drop-shadow">For Clients</h2>
            <ul className="space-y-3 text-white/90 text-lg font-medium">
              <li className="flex items-center gap-2"><span className="text-[#3CB371]">🚀</span> Fast & Secure Development</li>
              <li className="flex items-center gap-2"><span className="text-[#3CB371]">💸</span> Affordable Pricing</li>
              <li className="flex items-center gap-2"><span className="text-[#3CB371]">📱</span> Mobile-Friendly & Scalable</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-[#232946] via-[#3CB371]/20 to-[#232946]/80 rounded-3xl shadow-2xl p-10 border border-[#3CB371]/20">
            <h2 className="text-2xl font-bold text-white mb-4 drop-shadow">For Students</h2>
            <ul className="space-y-3 text-white/90 text-lg font-medium">
              <li className="flex items-center gap-2"><span className="text-[#f7e6ff]">🛠️</span> Learn by Building Real Projects</li>
              <li className="flex items-center gap-2"><span className="text-[#f7e6ff]">🤝</span> 1-on-1 Mentorship</li>
              <li className="flex items-center gap-2"><span className="text-[#f7e6ff]">📈</span> Beginner to Advanced Guidance</li>
            </ul>
          </div>
        </section>

        {/* About Me */}
        <section className="max-w-3xl mx-auto py-16 text-center relative">
          <div className="absolute left-0 top-0 w-24 h-24 bg-gradient-to-br from-[#3CB371]/30 to-[#232946]/30 rounded-full blur-2xl -z-10" style={{filter:'blur(30px)',opacity:0.4}} />
          <div className="bg-gradient-to-br from-[#232946] via-[#3CB371]/20 to-[#232946]/80 rounded-3xl shadow-2xl p-10 border border-[#3CB371]/20">
            <h2 className="text-2xl font-bold text-white mb-2 drop-shadow">About Ahmad</h2>
            <p className="text-white/90 mb-4 font-medium">Professional developer with 7+ years experience in web & app projects, and teaching coding. Portfolio includes business sites, apps, and a popular coding blog. Passionate about helping others succeed.</p>
            <div className="flex flex-wrap justify-center gap-4 mb-2">
              <Link href="/portfolio" className="text-[#3CB371] font-semibold hover:underline">Portfolio</Link>
              <Link href="https://github.com/Sana720" target="_blank" className="text-[#f7e6ff] font-semibold hover:underline">GitHub</Link>
              <Link href="/" className="text-[#f7e6ff] font-semibold hover:underline">Blog</Link>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="max-w-5xl mx-auto py-16 relative">
          <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-32 h-32 bg-gradient-to-br from-[#3CB371]/30 to-[#232946]/30 rounded-full blur-2xl -z-10" style={{filter:'blur(30px)',opacity:0.4}} />
          <h2 className="text-2xl font-bold text-white mb-8 text-center drop-shadow">Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-[#232946] via-[#3CB371]/20 to-[#232946]/80 rounded-3xl shadow-2xl p-10 border border-[#3CB371]/20">
              <h3 className="font-bold text-lg mb-2 text-[#3CB371]">Website Development</h3>
              <p className="text-white/90">Modern, fast, and secure websites for businesses and individuals.</p>
            </div>
            <div className="bg-gradient-to-br from-[#232946] via-[#3CB371]/20 to-[#232946]/80 rounded-3xl shadow-2xl p-10 border border-[#3CB371]/20">
              <h3 className="font-bold text-lg mb-2 text-[#3CB371]">Mobile App Development</h3>
              <p className="text-white/90">Cross-platform mobile apps tailored to your needs.</p>
            </div>
            <div className="bg-gradient-to-br from-[#232946] via-[#3CB371]/20 to-[#232946]/80 rounded-3xl shadow-2xl p-10 border border-[#3CB371]/20">
              <h3 className="font-bold text-lg mb-2 text-[#3CB371]">E-commerce Solutions</h3>
              <p className="text-white/90">Online stores, payment integration, and scalable solutions.</p>
            </div>
            <div className="bg-gradient-to-br from-[#232946] via-[#3CB371]/20 to-[#232946]/80 rounded-3xl shadow-2xl p-10 border border-[#3CB371]/20">
              <h3 className="font-bold text-lg mb-2 text-[#3CB371]">Custom Applications</h3>
              <p className="text-white/90">Unique software built for your business goals.</p>
            </div>
          </div>
        </section>

        {/* Coding Lessons Section */}
        <section id="lessons" className="max-w-5xl mx-auto py-16 relative">
          <div className="absolute right-0 bottom-0 w-24 h-24 bg-gradient-to-br from-[#3CB371]/30 to-[#232946]/30 rounded-full blur-2xl -z-10" style={{filter:'blur(30px)',opacity:0.4}} />
          <h2 className="text-2xl font-bold text-white mb-8 text-center drop-shadow">Learn to Code the Practical Way</h2>
          <p className="text-white/90 mb-8 text-center font-medium">From zero to building full apps — I teach coding step by step.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
            <div className="bg-gradient-to-br from-[#232946] via-[#3CB371]/20 to-[#232946]/80 rounded-3xl shadow-2xl p-10 border border-[#3CB371]/20 text-center">
              <h3 className="font-bold text-lg mb-2 text-[#f7e6ff]">Personalized Roadmap</h3>
              <p className="text-white/90">Custom learning plan for your goals.</p>
            </div>
            <div className="bg-gradient-to-br from-[#232946] via-[#3CB371]/20 to-[#232946]/80 rounded-3xl shadow-2xl p-10 border border-[#3CB371]/20 text-center">
              <h3 className="font-bold text-lg mb-2 text-[#f7e6ff]">Project-based Learning</h3>
              <p className="text-white/90">Build real apps as you learn.</p>
            </div>
            <div className="bg-gradient-to-br from-[#232946] via-[#3CB371]/20 to-[#232946]/80 rounded-3xl shadow-2xl p-10 border border-[#3CB371]/20 text-center">
              <h3 className="font-bold text-lg mb-2 text-[#f7e6ff]">Flexible Schedule</h3>
              <p className="text-white/90">Learn at your own pace, anytime.</p>
            </div>
          </div>
          <div className="text-center">
            <Link href="#contact" className="bg-[#3CB371] hover:bg-[#2e8b57] text-white px-8 py-3 rounded-full font-bold text-lg shadow-xl transition">Start Learning Today</Link>
          </div>
        </section>

        {/* Portfolio / Showcase */}
        <section className="max-w-5xl mx-auto py-16 relative">
          <div className="absolute left-0 bottom-0 w-24 h-24 bg-gradient-to-br from-[#3CB371]/30 to-[#232946]/30 rounded-full blur-2xl -z-10" style={{filter:'blur(30px)',opacity:0.4}} />
          <h2 className="text-2xl font-bold text-white mb-8 text-center drop-shadow">Portfolio & Showcase</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {/* Placeholder thumbnails */}
            <div className="bg-gradient-to-br from-[#3CB371]/30 to-[#232946]/30 rounded-2xl h-28 flex items-center justify-center text-white font-bold shadow-xl border border-[#3CB371]/20">Project 1</div>
            <div className="bg-gradient-to-br from-[#232946]/30 to-[#3CB371]/30 rounded-2xl h-28 flex items-center justify-center text-white font-bold shadow-xl border border-[#3CB371]/20">Project 2</div>
            <div className="bg-gradient-to-br from-[#3CB371]/30 to-[#232946]/30 rounded-2xl h-28 flex items-center justify-center text-white font-bold shadow-xl border border-[#3CB371]/20">Project 3</div>
            <div className="bg-gradient-to-br from-[#232946]/30 to-[#3CB371]/30 rounded-2xl h-28 flex items-center justify-center text-white font-bold shadow-xl border border-[#3CB371]/20">Project 4</div>
          </div>
          <div className="text-center">
            <Link href="/portfolio" className="text-[#3CB371] font-semibold hover:underline">See More Projects</Link>
            <span className="mx-2">|</span>
            <Link href="https://github.com/Sana720" target="_blank" className="text-[#f7e6ff] font-semibold hover:underline">GitHub</Link>
            <span className="mx-2">|</span>
            <Link href="/" className="text-[#f7e6ff] font-semibold hover:underline">Blog</Link>
          </div>
        </section>

        {/* Testimonials / Success Stories */}
        <section className="max-w-5xl mx-auto py-16 relative">
          <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-[#3CB371]/30 to-[#232946]/30 rounded-full blur-2xl -z-10" style={{filter:'blur(30px)',opacity:0.4}} />
          <h2 className="text-2xl font-bold text-white mb-8 text-center drop-shadow">Testimonials & Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-[#232946] via-[#3CB371]/20 to-[#232946]/80 rounded-3xl shadow-2xl p-10 border border-[#3CB371]/20">
              <p className="text-white italic mb-2">“Ahmad built our business site in record time!”</p>
              <span className="text-[#3CB371]">— Client</span>
            </div>
            <div className="bg-gradient-to-br from-[#232946] via-[#3CB371]/20 to-[#232946]/80 rounded-3xl shadow-2xl p-10 border border-[#3CB371]/20">
              <p className="text-white italic mb-2">“I landed my first internship after his coding lessons.”</p>
              <span className="text-[#f7e6ff]">— Student</span>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-5xl mx-auto py-16 text-center relative">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-24 h-24 bg-gradient-to-br from-[#3CB371]/30 to-[#232946]/30 rounded-full blur-2xl -z-10" style={{filter:'blur(30px)',opacity:0.4}} />
          <h2 className="text-2xl font-bold text-white mb-8 drop-shadow">Let’s Build Something Amazing — or Start Your Coding Journey</h2>
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-4">
            <Link href="#contact" className="bg-[#3CB371] hover:bg-[#2e8b57] text-white px-8 py-3 rounded-full font-bold text-lg shadow-xl transition">Hire Me</Link>
            <Link href="#contact" className="bg-white hover:bg-[#f7e6ff] text-[#232946] px-8 py-3 rounded-full font-bold text-lg shadow-xl transition border border-[#232946]/10">Book a Lesson</Link>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="max-w-2xl mx-auto py-16 relative">
          <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-[#3CB371]/30 to-[#232946]/30 rounded-full blur-2xl -z-10" style={{filter:'blur(30px)',opacity:0.4}} />
          <div className="bg-gradient-to-br from-[#232946] via-[#3CB371]/20 to-[#232946]/80 rounded-3xl shadow-2xl p-10 space-y-6 border border-[#3CB371]/20">
            <h2 className="text-2xl font-bold text-white mb-4 text-center drop-shadow">Contact Ahmad</h2>
            <form className="space-y-4">
              <input type="text" placeholder="Name" className="w-full px-4 py-2 border rounded-full text-white placeholder:text-[#f7e6ff] bg-[#232946]/60 border-[#3CB371]/30" required />
              <input type="email" placeholder="Email" className="w-full px-4 py-2 border rounded-full text-white placeholder:text-[#f7e6ff] bg-[#232946]/60 border-[#3CB371]/30" required />
              <select className="w-full px-4 py-2 border rounded-full text-white bg-[#232946]/60 border-[#3CB371]/30" required>
                <option value="">Service Interested In</option>
                <option value="development">Development</option>
                <option value="lessons">Coding Lessons</option>
              </select>
              <button type="submit" className="bg-[#3CB371] text-white px-6 py-2 rounded-full font-bold w-full shadow-xl">Send Message</button>
            </form>
            <div className="mt-6 text-center text-white">
              <a href="https://wa.me/919876543210" target="_blank" className="text-[#3CB371] font-semibold hover:underline">WhatsApp</a>
              <span className="mx-2">|</span>
              <a href="tel:+919876543210" className="text-[#f7e6ff] font-semibold hover:underline">Phone</a>
              <span className="mx-2">|</span>
              <a href="mailto:ahmad@example.com" className="text-[#f7e6ff] font-semibold hover:underline">Email</a>
            </div>
          </div>
        </section>
      </main>
  {/* Footer removed for ad-focused layout */}
    </div>
  );
}
