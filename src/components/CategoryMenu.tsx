"use client";
import { useEffect, useMemo, useState, useContext } from "react";
import LoaderContext from "../utils/LoaderContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useRouter } from "next/navigation";

export default function CategoryMenu() {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      const snap = await getDocs(collection(db, "categories"));
      setCategories(
        snap.docs
          .map((d) => (d.data() as { name?: string }).name)
          .filter(Boolean) as string[]
      );
    }
    fetchCategories();
  }, []);

  const items = useMemo(() => ["All", ...categories], [categories]);
  const router = useRouter();
  const { setLoading } = useContext(LoaderContext);

  return (
    <div className="relative">
      {/* Dropdown Panel */}
      <div className="absolute left-0 top-full mt-2 z-50 bg-white shadow-xl rounded-2xl p-4 
                      min-w-[280px] sm:min-w-[360px] lg:max-w-[600px]">
        <div
          role="menu"
          className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-2"
        >
          {items.map((cat, idx) => {
            const isAll = cat === "All";
            return (
              <button
                key={`${cat}-${idx}`}
                type="button"
                role="menuitem"
                onClick={() => {
                  setLoading(true);
                  if (isAll) router.push("/");
                  else router.push(`/category/${encodeURIComponent(cat)}`);
                }}
                className={`px-3 py-2 rounded-md text-sm text-left w-full
                            transition-colors
                            text-[#232946] hover:bg-[#f5f9fc] hover:text-[#3CB371]`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
