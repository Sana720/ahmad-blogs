import Header from '../../components/Header';
import CategoryMenu from '../../components/CategoryMenu';
import Footer from '../../components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header categoryMenu={<CategoryMenu />} />
      <main className="flex-1 max-w-3xl mx-auto py-16 px-4 text-[#232946] bg-white">
        <h1 className="text-4xl font-extrabold mb-6">About Me</h1>
        <p className="text-lg mb-4">Hey there! 👋 I’m Ahmad Sana.</p>
        <p className="text-lg mb-4">
          I graduated with a <strong>B.Tech in 2020</strong>, and that’s when my journey in tech truly began. 
          I started my career at <strong>Step to Soft</strong> as a Junior Developer, learning the ropes of building 
          and shipping software. After that, I spent 2 years at <strong>HCL Technologies</strong> as a Software Engineer, 
          where I worked on real-world projects and gained hands-on experience in the industry.
        </p>
        <p className="text-lg mb-4">
          Later, I joined <strong>Ivan Infotech</strong> as a Senior Application Developer, where I had the opportunity 
          to dive deeper into full-stack development and take on bigger challenges.
        </p>
        <p className="text-lg mb-4">
          Today, I’m a <strong>full-time freelancer</strong>, helping clients worldwide as a <strong>Full-Stack MERN Developer</strong>. 
          I love working with tools like <strong>Next.js</strong> and <strong>React Native</strong> to build apps that are modern, 
          scalable, and user-friendly.
        </p>
        <p className="text-lg mb-4">
          I started this blog to <em>share my journey, experiences, and lessons</em>—not just about coding, but also about freelancing, 
          career growth, and the exciting opportunities that come with the <strong>AI boom</strong>. I truly believe AI is opening 
          incredible new doors for everyone, and I want to explore with you how we can <strong>learn, grow, and even earn with AI</strong>.
        </p>
        <p className="text-lg mb-4">
          Thanks for stopping by—glad you’re here! 🚀
        </p>
      </main>
      <Footer />
    </div>
  );
}
