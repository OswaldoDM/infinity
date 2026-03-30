import { getOrderById } from "@/lib/database/orders.repository";
import Button from "@/app/ui/Button";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailsPage({ params }: Props) {
  const resolvedParams = await params;
  const orderId = Number(resolvedParams.id);

  if (isNaN(orderId)) {
    notFound();
  }

  const order = await getOrderById(orderId);

  if (!order) {
    notFound();
  }

  return (
    <div className="flex flex-col h-full items-center overflow-auto px-4">

      {/* SUCCESS HEADER */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-200">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 13L9 17L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Thank you for your purchase!</h1>
        <p className="text-black_secondary font-inter text-center max-w-[400px]">
          We've received your order and are getting it ready to be shipped.
          You will receive an email confirmation shortly.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-[800px] justify-center">

        {/* ORDER DETAILS PANEL */}
        <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit max-w-[400px]">
          <h2 className="text-xl tracking-tight font-semibold mb-4 border-b pb-4">Order Summary</h2>

          <div className="space-y-4 font-inter text-sm">
            <div className="flex justify-between">
              <span className="text-black_secondary">Order Number</span>
              <span className="font-semibold">#{order.id.toString().padStart(6, '0')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black_secondary">Date</span>
              <span className="font-medium">
                {new Date(order.order_date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-black_secondary">Status</span>
              <span className="bg-yellow-100 text-yellow-800 py-1 px-3 rounded-full text-xs font-semibold capitalize">
                {order.status}
              </span>
            </div>

            <div className="pt-4 border-t border-gray-100 mt-4">
              <p className="text-black_secondary mb-2">Shipping Address</p>
              {order.shipping_address_id ? (
                <div>
                  <p className="font-semibold">{order.shortname}</p>
                  <p className="text-gray-600">{order.street}, {order.city}</p>
                  <p className="text-gray-600">{order.state} {order.postal_code}, {order.country}</p>
                  {order.address_phone && <p className="text-gray-500 mt-1">{order.address_phone}</p>}
                </div>
              ) : (
                <p className="text-gray-500 italic">No specific shipping address provided.</p>
              )}
            </div>
          </div>
          <Link href="/">
            <Button className="mt-4" variant="primary">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
