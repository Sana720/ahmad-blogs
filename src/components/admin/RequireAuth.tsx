"use client";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { app } from "../../utils/firebase";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/admin/login");
      } else {
        setUser(user);
        setLoading(false);
      }
    });
    return () => unsub();
  }, [router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-[#3CB371] text-xl">Checking authentication...</div>;
  }

  return <>{children}</>;
}
