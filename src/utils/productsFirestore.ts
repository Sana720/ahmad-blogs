import { collection, getDocs, updateDoc, deleteDoc, doc, setDoc, query, where, writeBatch } from "firebase/firestore";
import { db } from "./firebase";
import { products, Product } from "./productsData";
import { Plan } from "../types/license";

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

export async function getPlansForProduct(productId: string): Promise<Plan[]> {
  try {
    const q = query(collection(db, "plans"), where("productId", "==", productId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Plan));
  } catch (err) {
    console.error("Failed to fetch plans for product", err);
    return [];
  }
}

export async function savePlansForProduct(productId: string, plans: Partial<Plan>[]) {
  try {
    const batch = writeBatch(db);
    const plansRef = collection(db, "plans");
    
    const q = query(plansRef, where("productId", "==", productId));
    const snap = await getDocs(q);
    
    // Delete existing plans for this product to replace with new state
    for (const d of snap.docs) {
      batch.delete(d.ref);
    }
    
    // Add current plans
    for (const plan of plans) {
      // Use existing id, or fallback to slug or timestamp
      const planId = plan.id || plan.slug || `plan_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
      const planDocRef = doc(plansRef, planId); 
      batch.set(planDocRef, {
        ...plan,
        productId,
        updatedAt: new Date().toISOString(),
        createdAt: plan.createdAt || new Date().toISOString()
      });
    }
    
    await batch.commit();
  } catch (err) {
    console.error("Failed to save plans for product", err);
    throw err;
  }
}
