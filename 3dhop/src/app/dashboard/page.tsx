// app/dashboard/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import DashboardClient from '@/components/pages/dashboard';

export default async function DashboardPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/auth/register');
  }

  return <DashboardClient />;
}