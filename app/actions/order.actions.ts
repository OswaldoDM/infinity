'use server';

import { createOrder as createOrderRepo } from "@/lib/database/orders.repository";

export async function createOrderAction(
  userId: number,
  totalAmount: number,
  shippingAddressId: number | null,
  items: Item[]
) {
  try {
    const orderId = await createOrderRepo(userId, totalAmount, shippingAddressId, items);
    return { success: true, orderId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
