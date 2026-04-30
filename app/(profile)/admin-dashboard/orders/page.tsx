import { getAllOrders } from "@/lib/database/repositories/admin.repository";
import OrderStatusSelect from "../components/OrderStatusSelect";

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

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
        <h2 className="tracking-tight">Orders</h2>
        <p className="text-gray_secondary font-inter mt-1">{orders.length} total orders</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full font-inter">
            <thead>
              <tr className="text-left text-xs text-gray_secondary border-b border-gray-100">
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Items</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: any) => (
                <tr key={order.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-3.5 font-semibold">#{order.id.toString().padStart(6, "0")}</td>
                  <td className="px-5 py-3.5">{order.username || "—"}</td>
                  <td className="px-5 py-3.5 text-gray_secondary">
                    {new Date(order.order_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3.5">{order.items?.length || 0}</td>
                  <td className="px-5 py-3.5 font-semibold">${Number(order.total_amount).toFixed(2)}</td>
                  <td className="px-5 py-3.5">
                    <OrderStatusSelect
                      orderId={order.id}
                      currentStatus={order.status}
                      statusColors={statusColors}
                    />
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
