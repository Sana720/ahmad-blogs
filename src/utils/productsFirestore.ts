import { collection, getDocs, updateDoc, deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { products, Product } from "./productsData";

export async function getFirestoreProducts(): Promise<Product[]> {
  try {
    const snap = await getDocs(collection(db, "products"));
    if (snap.empty) {
      // Try to populate collection with default products using static ids as document ids
      try {
        const promises = products.map(async (product) => {
          await setDoc(doc(db, "products", product.id), product);
        });
        await Promise.all(promises);
        
        const newSnap = await getDocs(collection(db, "products"));
        return newSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
      } catch (_writeErr) {
        // If write fails (e.g. during build / unauthenticated), return static fallback data
        console.warn("Firestore write denied during auto-initialization, returning static mock data");
        return products;
      }
    }
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
  } catch (_readErr) {
    console.warn("Firestore read failed, returning static mock data");
    return products;
  }
}

export async function getFirestoreProductById(id: string): Promise<Product | null> {
  try {
    const snap = await getDocs(collection(db, "products"));
    const found = snap.docs.find(d => d.id === id);
    if (!found) {
      // Fallback to static products
      return products.find(p => p.id === id) || null;
    }
    return { id: found.id, ...found.data() } as Product;
  } catch (_err) {
    console.warn("Firestore read by id failed, returning static mock data");
    return products.find(p => p.id === id) || null;
  }
}

export async function addFirestoreProduct(id: string, data: Omit<Product, "id">) {
  return await setDoc(doc(db, "products", id), { ...data, id });
}

export async function updateFirestoreProduct(id: string, data: Omit<Product, "id">) {
  return await updateDoc(doc(db, "products", id), { ...data });
}

export async function deleteFirestoreProduct(id: string) {
  return await deleteDoc(doc(db, "products", id));
}
