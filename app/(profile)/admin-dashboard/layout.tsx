import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "./components/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session?.user?.role !== "admin") redirect("/");

  return (
    <div className="flex gap-6 h-full pt-4 pb-6">
      <AdminSidebar />
      <div className="flex-1 pt-3 overflow-auto">
        {children}
      </div>
    </div>
  );
}
