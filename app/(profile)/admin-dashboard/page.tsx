import { auth } from "@/auth";
import { redirect } from "next/navigation";

async function AdminDashboard() {
  const session = await auth();  
  if (session?.user?.role !== "admin") redirect("/");

  return (
    <div className='container mx-auto mt-5'>
      <h1 className='text-6xl font-black text-blue-600'>Admin Dashboard</h1>
    </div>
  );
}

export default AdminDashboard;
