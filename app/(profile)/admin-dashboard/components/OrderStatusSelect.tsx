"use client";
import { useState } from "react";
import { updateOrderStatusAction } from "@/app/actions/admin.actions";

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

interface Props {
  orderId: number;
  currentStatus: string;
  statusColors: Record<string, string>;
}

export default function OrderStatusSelect({ orderId, currentStatus, statusColors }: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: InputChange) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setLoading(true);

    const result = await updateOrderStatusAction(orderId, newStatus);
    if (!result.success) {
      setStatus(currentStatus); // Revert on failure
    }
    setLoading(false);
  };

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={loading}
      className={`py-1 px-2 rounded-full text-xs font-semibold capitalize cursor-pointer border-0 outline-none
        ${statusColors[status] || "bg-gray-100 text-gray-800"} 
        ${loading ? "opacity-50" : ""}`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}
