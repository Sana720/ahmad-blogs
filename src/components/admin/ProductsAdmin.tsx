"use client";
import React, { useEffect, useState } from "react";
import {
  getFirestoreProducts,
  addFirestoreProduct,
  updateFirestoreProduct,
  deleteFirestoreProduct
} from "../../utils/productsFirestore";
import { Product } from "../../utils/productsData";
import RequireAuth from "./RequireAuth";

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<'Extension' | 'Template' | 'SaaS'>("Extension");
  const [pricingType, setPricingType] = useState<'Free' | 'Paid' | 'Freemium'>("Free");
  const [image, setImage] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [features, setFeatures] = useState("");
  const [techStack, setTechStack] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [purchaseUrl, setPurchaseUrl] = useState("");
  const [rating, setRating] = useState("4.8");
  const [reviewsCount, setReviewsCount] = useState("10");
  const [releaseDate, setReleaseDate] = useState("");
  
  // FAQs State
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([
    { question: "", answer: "" }
  ]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const newImages = [...images];
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "ahmad-blogs");
        
        const res = await fetch("https://api.cloudinary.com/v1_1/dmklge3gp/image/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.secure_url) {
          newImages.push(data.secure_url);
        }
      }
      setImages(newImages);
      if (!image && newImages.length > 0) {
        setImage(newImages[0]);
      }
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      alert("Failed to upload image(s).");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, idx) => idx !== index);
    setImages(newImages);
    if (images[index] === image) {
      setImage(newImages.length > 0 ? newImages[0] : "");
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getFirestoreProducts();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products from firestore:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setId("");
    setTitle("");
    setTagline("");
    setDescription("");
    setLongDescription("");
    setPrice("");
    setCategory("Extension");
    setPricingType("Free");
    setImage("");
    setImages([]);
    setFeatures("");
    setTechStack("");
    setDownloadUrl("");
    setDemoUrl("");
    setPurchaseUrl("");
    setRating("4.8");
    setReviewsCount("10");
    setReleaseDate("");
    setFaqs([{ question: "", answer: "" }]);
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setId(product.id);
    setTitle(product.title || "");
    setTagline(product.tagline || "");
    setDescription(product.description || "");
    setLongDescription(product.longDescription || "");
    setPrice(product.price || "");
    setCategory(product.category || "Extension");
    setPricingType(product.pricingType || "Free");
    setImage(product.image || "");
    setImages(product.images || (product.image ? [product.image] : []));
    setFeatures(product.features ? product.features.join("\n") : "");
    setTechStack(product.techStack ? product.techStack.join("\n") : "");
    setDownloadUrl(product.downloadUrl || "");
    setDemoUrl(product.demoUrl || "");
    setPurchaseUrl(product.purchaseUrl || "");
    setRating(product.rating ? String(product.rating) : "4.8");
    setReviewsCount(product.reviewsCount ? String(product.reviewsCount) : "10");
    setReleaseDate(product.releaseDate || "");
    setFaqs(product.faqs && product.faqs.length > 0 ? product.faqs : [{ question: "", answer: "" }]);
  };

  const handleFaqChange = (index: number, field: "question" | "answer", value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
  };

  const addFaqField = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const removeFaqField = (index: number) => {
    const newFaqs = faqs.filter((_, idx) => idx !== index);
    setFaqs(newFaqs.length > 0 ? newFaqs : [{ question: "", answer: "" }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !title || !description || !price) {
      alert("Please fill in all required fields (ID, Title, Description, Price)");
      return;
    }

    const cleanFaqs = faqs.filter(faq => faq.question.trim() && faq.answer.trim());

    const productData = {
      title,
      tagline,
      description,
      longDescription,
      price,
      category,
      pricingType,
      image: image || (images.length > 0 ? images[0] : "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"),
      images,
      features: features.split("\n").map(f => f.trim()).filter(Boolean),
      techStack: techStack.split("\n").map(t => t.trim()).filter(Boolean),
      downloadUrl,
      demoUrl,
      purchaseUrl,
      rating: parseFloat(rating) || 4.5,
      reviewsCount: parseInt(reviewsCount) || 10,
      releaseDate: releaseDate || new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      faqs: cleanFaqs
    };

    try {
      if (editingId) {
        await updateFirestoreProduct(editingId, productData);
        alert("Product updated successfully!");
      } else {
        // Double check uniqueness of id
        const exists = products.some(p => p.id === id);
        if (exists) {
          alert(`Product with ID "${id}" already exists. Please choose a unique ID.`);
          return;
        }
        await addFirestoreProduct(id, productData);
        alert("Product added successfully!");
      }
      resetForm();
      loadProducts();
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Failed to save product. Please try again.");
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm(`Are you sure you want to delete the product "${productId}"?`)) {
      return;
    }
    try {
      await deleteFirestoreProduct(productId);
      alert("Product deleted successfully!");
      loadProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product.");
    }
  };

  return (
    <RequireAuth>
      <div className="p-1 md:p-6 bg-white min-h-screen">
        <h1 className="text-3xl font-extrabold text-[#232946] mb-8">Products Management</h1>

        {/* Product form panel */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mb-12">
          <h2 className="text-xl font-bold text-[#232946] mb-6">
            {editingId ? "Edit Digital Product" : "Add New Digital Product"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Product Slug/ID */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Product ID / Slug (Required) *
                </label>
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, "-"))}
                  placeholder="e.g. tinycrm-pro"
                  disabled={!!editingId}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-[#232946] disabled:bg-gray-200"
                  required
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Title (Required) *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. TinyCRM for Solopreneurs"
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-[#232946]"
                  required
                />
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Tagline (Required)
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. The lightweight, offline-first CRM"
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-[#232946]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-[#232946] bg-white"
                >
                  <option value="Extension">Extension</option>
                  <option value="Template">Template</option>
                  <option value="SaaS">SaaS</option>
                </select>
              </div>

              {/* Pricing Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Pricing Model
                </label>
                <select
                  value={pricingType}
                  onChange={(e) => setPricingType(e.target.value as any)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-[#232946] bg-white"
                >
                  <option value="Free">Free</option>
                  <option value="Paid">Paid</option>
                  <option value="Freemium">Freemium</option>
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Price (Required) *
                </label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. $29.00 or Free"
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-[#232946]"
                  required
                />
              </div>

              {/* Images Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Upload Product Images (Recommended: 1200x750px, 16:10 or 16:9 ratio)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full border border-gray-200 rounded-lg p-2 text-sm text-[#232946] bg-white"
                />
                {uploading && <div className="text-xs text-[#3CB371] font-bold mt-1 animate-pulse">Uploading to Cloudinary...</div>}
              </div>
            </div>

            {/* Image Gallery Preview & Primary Image Selection */}
            {images.length > 0 && (
              <div className="bg-white border border-gray-150 rounded-xl p-4 mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Uploaded Images Gallery (Select radio button for primary/thumbnail image)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                  {images.map((img, idx) => {
                    const isPrimary = image === img;
                    return (
                      <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 p-1.5 flex flex-col items-center bg-gray-50">
                        <div className="relative w-full aspect-[16/10] rounded overflow-hidden">
                          <img src={img} alt={`Preview ${idx}`} className="object-cover w-full h-full" />
                        </div>
                        <div className="flex items-center justify-between w-full mt-2 px-1 gap-2">
                          <label className="flex items-center gap-1 text-xs font-semibold cursor-pointer">
                            <input
                              type="radio"
                              name="primary-image"
                              checked={isPrimary}
                              onChange={() => setImage(img)}
                              className="accent-[#3CB371]"
                            />
                            Cover
                          </label>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="text-red-500 hover:text-red-700 text-xs font-bold"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Short Description (Listing card snippet)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A brief overview..."
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-[#232946]"
                required
              />
            </div>

            {/* Long description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Long Description (Detail page markdown content)
              </label>
              <textarea
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                placeholder="Write detailed specifications here..."
                rows={5}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-[#232946] font-mono"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Features */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Key Features (One feature per line)
                </label>
                <textarea
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  rows={4}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-[#232946] font-mono"
                />
              </div>

              {/* Tech Stack */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Tech Stack (One technology per line)
                </label>
                <textarea
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  placeholder="Next.js&#10;TailwindCSS&#10;TypeScript"
                  rows={4}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-[#232946] font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Download URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Download Link (Extensions)
                </label>
                <input
                  type="text"
                  value={downloadUrl}
                  onChange={(e) => setDownloadUrl(e.target.value)}
                  placeholder="https://chrome.google.com/..."
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-[#232946]"
                />
              </div>

              {/* Demo URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Live Demo Link (Templates / SaaS)
                </label>
                <input
                  type="text"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  placeholder="https://demo.myproduct.com"
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-[#232946]"
                />
              </div>

              {/* Purchase URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Purchase Link (Gumroad / Lemon Squeezy)
                </label>
                <input
                  type="text"
                  value={purchaseUrl}
                  onChange={(e) => setPurchaseUrl(e.target.value)}
                  placeholder="https://gumroad.com/..."
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-[#232946]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Initial Rating (e.g. 4.8)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-[#232946]"
                />
              </div>

              {/* Reviews Count */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Reviews Count (e.g. 120)
                </label>
                <input
                  type="number"
                  value={reviewsCount}
                  onChange={(e) => setReviewsCount(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-[#232946]"
                />
              </div>

              {/* Release Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Release Date (e.g. Jan 2026)
                </label>
                <input
                  type="text"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  placeholder="Jan 2026"
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-[#232946]"
                />
              </div>
            </div>

            {/* FAQs management */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-[#232946]">Product Q&As (FAQs)</h3>
                <button
                  type="button"
                  onClick={addFaqField}
                  className="px-3 py-1 bg-[#3CB371] hover:bg-[#2e945b] text-white text-xs font-bold rounded-md"
                >
                  + Add FAQ
                </button>
              </div>
              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3 relative">
                    <button
                      type="button"
                      onClick={() => removeFaqField(idx)}
                      className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-xs font-bold"
                    >
                      Delete
                    </button>
                    <div className="w-[90%]">
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Question</label>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => handleFaqChange(idx, "question", e.target.value)}
                        placeholder="e.g. Is support included?"
                        className="w-full border border-gray-200 rounded-lg p-2 text-xs text-[#232946]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Answer</label>
                      <textarea
                        value={faq.answer}
                        onChange={(e) => handleFaqChange(idx, "answer", e.target.value)}
                        placeholder="e.g. Yes, support is included..."
                        rows={2}
                        className="w-full border border-gray-200 rounded-lg p-2 text-xs text-[#232946]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#3CB371] hover:bg-[#2e945b] text-white text-sm font-bold rounded-lg transition-colors cursor-pointer"
              >
                {editingId ? "Update Product" : "Save Product"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-bold rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Product listing table */}
        <h2 className="text-xl font-bold text-[#232946] mb-6">Existing Digital Products</h2>
        {loading ? (
          <p className="text-gray-500 text-sm">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500 text-sm">No products found in Firestore.</p>
        ) : (
          <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 font-semibold">
                  <th className="p-4">Image</th>
                  <th className="p-4">Title & ID</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-100">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-extrabold text-[#232946]">{product.title}</div>
                      <div className="text-xs text-gray-400 font-mono mt-0.5">{product.id}</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-block bg-[#eaf0f6] text-[#3CB371] text-xs font-bold px-2 py-0.5 rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-[#232946]">{product.price}</td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="px-3 py-1.5 border border-gray-200 hover:border-[#3CB371] hover:text-[#3CB371] rounded-lg text-xs font-bold transition-all cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-3 py-1.5 border border-red-100 hover:border-red-500 hover:bg-red-50 hover:text-red-500 text-red-400 rounded-lg text-xs font-bold transition-all cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </RequireAuth>
  );
}
