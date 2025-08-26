"use client";
import { useEffect } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { app } from "../../../utils/firebase";

export default function AdminLogin() {
  const router = useRouter();
  useEffect(() => {
    const auth = getAuth(app);
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/admin");
      }
    });
    return () => unsub();
  }, [router]);

  async function handleLogin() {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#232946]">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6 text-[#232946]">Admin Login</h1>
        <button
          onClick={handleLogin}
          className="bg-[#3CB371] text-white px-6 py-2 rounded font-bold w-full"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
