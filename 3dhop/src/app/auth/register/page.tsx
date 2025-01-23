'use client'
import AuthForm from "@/components/authForm";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function RegisterPage() {
  const router = useRouter();
    const { data: session, status } = useSession();
  
    useEffect(() => {
      if (session) {
        router.push('/dashboard');
      }
    }, [session, router]);
  return (
    <div className="min-h-screen flex">
      {/* Sección izquierda con imagen */}
      <div className="hidden lg:block relative w-1/2">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-blue-900/30" />
      </div>

      {/* Sección derecha con formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          {/* Logo y encabezado */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">3D</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Crea tu cuenta</h1>
            <p className="text-gray-500">Comienza tu viaje en el mundo 3D</p>
          </div>

          {/* Formulario */}
          <AuthForm isLogin={false} />

          {/* Enlaces adicionales */}
          <div className="text-center space-y-4">
            <Link
              href="/auth/login"
              className="inline-block text-sm text-blue-600 hover:text-blue-500 transition-colors font-medium"
            >
              ¿Ya tienes cuenta? Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}