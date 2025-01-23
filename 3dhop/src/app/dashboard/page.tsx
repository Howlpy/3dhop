// app/dashboard/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {signOut} from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Bienvenido, {session.user?.email}!</h1>
      <p className="mt-4">Aquí podrás gestionar tus pedidos de impresión 3D.</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}