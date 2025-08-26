import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto py-16 px-4 text-[#232946] bg-white">
        <h1 className="text-4xl font-extrabold mb-6">About Us</h1>
        <p className="text-lg mb-4">Welcome to Ahmad Blogs! We are passionate about sharing knowledge, stories, and inspiration with the world. Our mission is to create a platform where readers can discover insightful articles, creative ideas, and helpful resources on a variety of topics.</p>
        <p className="text-lg mb-4">Whether you're here to learn, explore, or connect, we hope you find something valuable. Thank you for being part of our community!</p>
      </main>
      <Footer />
    </div>
  );
}
