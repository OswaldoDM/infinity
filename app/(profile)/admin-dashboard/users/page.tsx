import { getAllUsers } from "@/lib/database/repositories/admin.repository";
import Image from "next/image";

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="tracking-tight">Users</h2>
        <p className="text-gray_secondary font-inter mt-1">{users.length} registered users</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full font-inter">
            <thead>
              <tr className="text-left text-xs text-gray_secondary border-b border-gray-100">
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Orders</th>
                <th className="px-5 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 shrink-0">
                        <Image
                          src={user.image_url || "/default-avatar.png"}
                          alt={user.username}
                          fill
                          className="object-cover"
                          sizes="32px"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{user.username}</p>
                        {(user.first_name || user.last_name) && (
                          <p className="text-xs text-gray_secondary">
                            {user.first_name} {user.last_name}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray_secondary">{user.email}</td>
                  <td className="px-5 py-3.5">
                    <span className={`py-1 px-3 rounded-full text-xs font-semibold capitalize ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-medium">{user.order_count}</td>
                  <td className="px-5 py-3.5 text-gray_secondary">
                    {new Date(user.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
