import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const isAdmin = session?.user?.role && ["owner", "manager", "staff"].includes(session.user.role);

  if (!isAdmin) {
    redirect(`/auth/login?callbackUrl=/admin`);
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">{children}</main>
    </div>
  );
}
