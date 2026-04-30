import { getDashboardStats } from "@/lib/database/repositories/admin.repository";

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      label: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      ),
    },
    {
      label: "Registered Users",
      value: stats.totalUsers,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
        </svg>
      ),
    },
    {
      label: "Products",
      value: stats.totalProducts,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        </svg>
      ),
    },
  ];

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="tracking-tight">Dashboard</h2>
        <p className="text-gray_secondary font-inter mt-1">Overview of your store</p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-5 border border-gray-100 flex items-center gap-4"
          >
            <div className="w-11 h-11 bg-gray-100 rounded-lg flex items-center justify-center text-black shrink-0">
              {stat.icon}
            </div>
            <div>
              <p className="text-gray_secondary font-inter text-xs">{stat.label}</p>
              <p className="text-xl font-bold tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* LOW STOCK ALERT */}
      {stats.lowStockProducts > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <p className="font-inter text-yellow-800">
            <span className="font-semibold">{stats.lowStockProducts} product{stats.lowStockProducts > 1 ? "s" : ""}</span> with low stock (≤ 5 units)
          </p>
        </div>
      )}

      {/* RECENT ORDERS */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-lg font-semibold tracking-tight">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full font-inter">
            <thead>
              <tr className="text-left text-xs text-gray_secondary border-b border-gray-100">
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order: any) => (
                <tr key={order.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-3.5 font-semibold">#{order.id.toString().padStart(6, "0")}</td>
                  <td className="px-5 py-3.5">{order.username}</td>
                  <td className="px-5 py-3.5 text-gray_secondary">
                    {new Date(order.order_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3.5 font-semibold">${Number(order.total_amount).toFixed(2)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`py-1 px-3 rounded-full text-xs font-semibold capitalize ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}>
                      {order.status}
                    </span>
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
