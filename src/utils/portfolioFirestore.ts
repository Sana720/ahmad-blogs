import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

export async function getPortfolioProjects() {
  const snap = await getDocs(collection(db, "portfolio_projects"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export interface PortfolioProject {
    // Add your fields here, for example:
    title: string;
    description: string;
    imageUrl?: string;
    [key: string]: any;
}

export interface PortfolioTestimonial {
  name: string;
  feedback: string;
  avatarUrl?: string;
  [key: string]: any;
}

export async function addPortfolioProject(data: PortfolioProject): Promise<ReturnType<typeof addDoc>> {
    return await addDoc(collection(db, "portfolio_projects"), data);
}

export async function updatePortfolioProject(id: string, data: PortfolioProject) {
  return await updateDoc(doc(db, "portfolio_projects", id), data);
}

export async function deletePortfolioProject(id: string) {
  return await deleteDoc(doc(db, "portfolio_projects", id));
}

export async function getPortfolioTestimonials() {
  const snap = await getDocs(collection(db, "portfolio_testimonials"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addPortfolioTestimonial(data: PortfolioTestimonial) {
  return await addDoc(collection(db, "portfolio_testimonials"), data);
}

export async function updatePortfolioTestimonial(id: string, data: PortfolioTestimonial) {
  return await updateDoc(doc(db, "portfolio_testimonials", id), data);
}

export async function deletePortfolioTestimonial(id: string) {
  return await deleteDoc(doc(db, "portfolio_testimonials", id));
}
