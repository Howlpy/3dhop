"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { hash } from "bcryptjs"; // Opcional para hashing
import { LockClosedIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
export default function AuthForm({ isLogin }: { isLogin: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading,setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // Lógica de login
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        alert("Credenciales incorrectas");
      } else {
        router.push("/dashboard");
      }
    } else {
      // Lógica de registro (¡hashea la contraseña en producción!)
      try {
        const hashedPassword = await hash(password, 12);
        console.log(hashedPassword)
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password: hashedPassword }),
        });
        console.log(res.body)
        if (res.ok) {
          router.push("/auth/login");
        } else {
          alert("Error al registrar el usuario");
        }
      } catch (error) {
        alert("Error interno del servidor");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Correo electrónico
        </label>
        <div className="relative">
          <EnvelopeIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 bg-white"
            placeholder="nombre@ejemplo.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contraseña
        </label>
        <div className="relative">
          <LockClosedIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 bg-white"
            placeholder="••••••••"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-75"
      >
        {isLoading ? (
          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
        ) : (
          <span>{isLogin ? "Iniciar sesión" : "Registrarse"}</span>
        )}
      </button>
    </form>
  );
}