"use client";
"use client";
import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import AdminSidebar from "./AdminSidebar";
import Image from "next/image";
import {
  getPortfolioProjects,
  addPortfolioProject,
  updatePortfolioProject,
  deletePortfolioProject,
  getPortfolioTestimonials,
  addPortfolioTestimonial,
  updatePortfolioTestimonial,
  deletePortfolioTestimonial
} from "../../utils/portfolioFirestore";

type Project = {
  id?: string;
  type: "project";
  title: string;
  description: string;
  image: string;
  link: string;
};
type Testimonial = {
  id?: string;
  type: "testimonial";
  name: string;
  feedback: string;
  avatar: string;
  company: string;
};
type FormType = Project | Testimonial;

export default function PortfolioAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [form, setForm] = useState<FormType>({
    type: "project",
    title: "",
    description: "",
    image: "",
    link: ""
  } as Project);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  // Show all projects, no pagination
  // Show all testimonials, no slider

  // TODO: Replace with Firestore or API calls
  useEffect(() => {
    // Load from Firestore and map to ensure all fields are present
    getPortfolioProjects().then(data =>
      setProjects(
        data.map((item: any) => ({
          id: item.id,
          type: "project",
          title: item.title ?? "",
          description: item.description ?? "",
          image: item.image ?? "",
          link: item.link ?? ""
        }))
      )
    );
    getPortfolioTestimonials().then(data =>
      setTestimonials(
        data.map((item: any) => ({
          id: item.id,
          type: "testimonial",
          name: item.name ?? "",
          feedback: item.feedback ?? "",
          avatar: item.avatar ?? "",
          company: item.company ?? ""
        }))
      )
    );
  }, []);

  // Firestore CRUD
  async function saveData(type: "project" | "testimonial", data: Project[] | Testimonial[]) {
    if (type === "project") {
      setProjects(data as Project[]);
    } else {
      setTestimonials(data as Testimonial[]);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (form.type === "project") {
      if (editIdx !== null && projects[editIdx].id) {
        // Update
        await updatePortfolioProject(projects[editIdx].id, form);
      } else {
        // Add
        await addPortfolioProject(form);
      }
      const updated = await getPortfolioProjects();
      setProjects(
        updated.map((item: any) => ({
          id: item.id,
          type: "project",
          title: item.title ?? "",
          description: item.description ?? "",
          image: item.image ?? "",
          link: item.link ?? ""
        }))
      );
      setForm({ type: "project", title: "", description: "", image: "", link: "" });
    } else {
      if (editIdx !== null && testimonials[editIdx].id) {
        await updatePortfolioTestimonial(testimonials[editIdx].id, form);
      } else {
        await addPortfolioTestimonial(form);
      }
      const updated = await getPortfolioTestimonials();
      setTestimonials(
        updated.map((item: any) => ({
          id: item.id,
          type: "testimonial",
          name: item.name ?? "",
          feedback: item.feedback ?? "",
          avatar: item.avatar ?? "",
          company: item.company ?? ""
        }))
      );
      setForm({ type: "testimonial", name: "", feedback: "", avatar: "", company: "" });
    }
    setEditIdx(null);
  }

  function handleEdit(type: "project" | "testimonial", idx: number) {
    setForm(type === "project" ? projects[idx] : testimonials[idx]);
    setEditIdx(idx);
  }

  async function handleDelete(type: "project" | "testimonial", idx: number) {
    if (type === "project") {
      if (projects[idx].id) await deletePortfolioProject(projects[idx].id);
      const updated = await getPortfolioProjects();
      setProjects(
        updated.map((item: any) => ({
          id: item.id,
          type: "project",
          title: item.title ?? "",
          description: item.description ?? "",
          image: item.image ?? "",
          link: item.link ?? ""
        }))
      );
    } else {
      if (testimonials[idx].id) await deletePortfolioTestimonial(testimonials[idx].id);
      const updated = await getPortfolioTestimonials();
      setTestimonials(
        updated.map((item: any) => ({
          id: item.id,
          type: "testimonial",
          name: item.name ?? "",
          feedback: item.feedback ?? "",
          avatar: item.avatar ?? "",
          company: item.company ?? ""
        }))
      );
    }
    setEditIdx(null);
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* Sidebar - full height */}
        <div className="hidden md:block w-64 min-h-screen">
          <AdminSidebar />
        </div>
        {/* Main Content */}
  <main className="flex-1 py-8 px-12 w-full" style={{ color: '#111' }}>
          <h1 className="text-3xl font-bold mb-6">Portfolio Admin</h1>
          <form onSubmit={handleSubmit} className="space-y-4 bg-[#f7f8fa] p-4 rounded-xl mb-8" style={{ color: '#111' }}>
            <div className="flex gap-4">
              <label>
                <input
                  type="radio"
                  name="type"
                  value="project"
                  checked={form.type === "project"}
                  onChange={() =>
                    setForm({
                      type: "project",
                      title: "",
                      description: "",
                      image: "",
                      link: ""
                    })
                  }
                />
                Project
              </label>
              <label>
                <input
                  type="radio"
                  name="type"
                  value="testimonial"
                  checked={form.type === "testimonial"}
                  onChange={() =>
                    setForm({
                      type: "testimonial",
                      name: "",
                      feedback: "",
                      avatar: "",
                      company: ""
                    })
                  }
                />
                Testimonial
              </label>
            </div>
            {form.type === "project" ? (
              <>
                <input className="w-full border rounded px-3 py-2" placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
                <textarea className="w-full border rounded px-3 py-2" placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
                <input className="w-full border rounded px-3 py-2" placeholder="Image URL" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} required />
                <input className="w-full border rounded px-3 py-2" placeholder="Project Link" value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} required />
              </>
            ) : (
              <>
                <input className="w-full border rounded px-3 py-2" placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                <input className="w-full border rounded px-3 py-2" placeholder="Avatar URL" value={form.avatar} onChange={e => setForm(f => ({ ...f, avatar: e.target.value }))} required />
                <input className="w-full border rounded px-3 py-2" placeholder="Company" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} required />
                <textarea className="w-full border rounded px-3 py-2" placeholder="Feedback" value={form.feedback} onChange={e => setForm(f => ({ ...f, feedback: e.target.value }))} required />
              </>
            )}
            <button type="submit" className="bg-[#3CB371] text-white px-6 py-2 rounded font-bold">{editIdx !== null ? "Update" : "Add"} {form.type === "project" ? "Project" : "Testimonial"}</button>
          </form>
          <h2 className="text-2xl font-bold mb-4">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {projects.map((p, idx) => (
              <div key={p.id || idx} className="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
                <Image src={p.image} alt={p.title} width={320} height={180} className="rounded-lg object-cover" />
                <div className="font-bold">{p.title}</div>
                <div className="text-sm text-[#444]">{p.description}</div>
                <a href={p.link} className="text-[#3CB371] font-semibold" target="_blank" rel="noopener noreferrer">View Project →</a>
                <div className="flex gap-2 mt-2">
                  <button className="text-xs px-3 py-1 bg-[#eaf0f6] rounded" onClick={() => handleEdit("project", idx)}>Edit</button>
                  <button className="text-xs px-3 py-1 bg-red-100 text-red-600 rounded" onClick={() => handleDelete("project", idx)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
          <h2 className="text-2xl font-bold mb-4">Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {testimonials.map((t, idx) => (
              <div key={t.id || idx} className="bg-white rounded-xl shadow p-4 flex gap-2 items-center">
                <Image src={t.avatar} alt={t.name} width={64} height={64} className="rounded-full object-cover border-2 border-[#3CB371]" />
                <div>
                  <div className="font-bold">{t.name} <span className="text-xs text-[#888]">({t.company})</span></div>
                  <div className="text-sm text-[#444]">"{t.feedback}"</div>
                  <div className="flex gap-2 mt-2">
                    <button className="text-xs px-3 py-1 bg-[#eaf0f6] rounded" onClick={() => handleEdit("testimonial", idx)}>Edit</button>
                    <button className="text-xs px-3 py-1 bg-red-100 text-red-600 rounded" onClick={() => handleDelete("testimonial", idx)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
