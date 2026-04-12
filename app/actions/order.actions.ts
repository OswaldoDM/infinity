'use server';

import { createOrder } from "@/lib/database/repositories/orders.repository";

export async function createOrderAction(
  userId: number,
  totalAmount: number,
  shippingAddressId: number | null,
  fullCartItems: fullCartItem[]
) {
  try {
    const orderId = await createOrder(userId, totalAmount, shippingAddressId, fullCartItems);
    return { success: true, orderId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
