"use client";
import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "../../utils/firebase";

export default function CouponCrud() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [code, setCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);
  const [editing, setEditing] = useState<any|null>(null);

  async function fetchCoupons() {
    const snap = await getDocs(collection(db, "coupons"));
    setCoupons(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  useEffect(() => { fetchCoupons(); }, []);

  async function handleCreate(e: any) {
    e.preventDefault();
    if (!code.trim() || discountPercentage <= 0) return;
    
    await addDoc(collection(db, "coupons"), { 
      code: code.trim().toUpperCase(), 
      discountPercentage, 
      isActive,
      createdAt: Timestamp.now()
    });
    resetForm();
    fetchCoupons();
  }

  async function handleUpdate(e: any) {
    e.preventDefault();
    if (!editing) return;
    if (!code.trim() || discountPercentage <= 0) return;
    
    await updateDoc(doc(db, "coupons", editing.id), { 
      code: code.trim().toUpperCase(), 
      discountPercentage, 
      isActive,
      updatedAt: Timestamp.now()
    });
    resetForm();
    fetchCoupons();
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this coupon?")) {
      await deleteDoc(doc(db, "coupons", id));
      fetchCoupons();
    }
  }

  function handleEdit(coupon: any) {
    setEditing(coupon);
    setCode(coupon.code);
    setDiscountPercentage(coupon.discountPercentage);
    setIsActive(coupon.isActive);
  }

  function resetForm() {
    setEditing(null);
    setCode("");
    setDiscountPercentage(0);
    setIsActive(true);
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#232946] mb-4">Coupons</h2>
      
      <form onSubmit={editing ? handleUpdate : handleCreate} className="mb-8 bg-white p-6 rounded shadow max-w-2xl">
        <h3 className="text-lg font-semibold mb-4 text-[#232946]">{editing ? "Edit Coupon" : "Create New Coupon"}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
            <input 
              value={code} 
              onChange={e => setCode(e.target.value)} 
              className="w-full border rounded px-3 py-2 text-[#232946] uppercase" 
              placeholder="e.g. PRO20" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage (%)</label>
            <input 
              type="number"
              min="1"
              max="100"
              value={discountPercentage || ''} 
              onChange={e => setDiscountPercentage(Number(e.target.value))} 
              className="w-full border rounded px-3 py-2 text-[#232946]" 
              placeholder="e.g. 20" 
              required 
            />
          </div>
        </div>
        
        <div className="mb-4 flex items-center">
          <input 
            type="checkbox" 
            id="isActive"
            checked={isActive} 
            onChange={e => setIsActive(e.target.checked)} 
            className="w-4 h-4 text-[#3CB371] border-gray-300 rounded focus:ring-[#3CB371]" 
          />
          <label htmlFor="isActive" className="ml-2 block text-sm font-medium text-gray-700">
            Active (allow users to redeem)
          </label>
        </div>

        <div className="flex gap-2">
          <button type="submit" className="bg-[#3CB371] hover:bg-[#329960] text-white px-4 py-2 rounded font-bold transition-colors">
            {editing ? "Update Coupon" : "Add Coupon"}
          </button>
          {editing && (
            <button type="button" onClick={resetForm} className="bg-gray-300 hover:bg-gray-400 text-[#232946] px-4 py-2 rounded font-bold transition-colors">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-left text-sm text-[#232946] min-w-max">
          <thead className="bg-[#f7f8fa] text-xs uppercase text-gray-500 font-semibold border-b border-gray-200">
            <tr>
              <th className="px-6 py-3">Code</th>
              <th className="px-6 py-3">Discount</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {coupons.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No coupons found.</td>
              </tr>
            ) : (
              coupons.map(coupon => (
                <tr key={coupon.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono font-medium">{coupon.code}</td>
                  <td className="px-6 py-4">{coupon.discountPercentage}%</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-3">
                    <button onClick={() => handleEdit(coupon)} className="font-medium text-blue-600 hover:text-blue-800">Edit</button>
                    <button onClick={() => handleDelete(coupon.id)} className="font-medium text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
