"use server";

import { auth } from "@/auth";
import {
  updateOrderStatus,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/database/repositories/admin.repository";
import { revalidatePath } from "next/cache";

// Función helper para verificar que el usuario es admin
async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session;
}

// ===================== ORDERS =====================

export async function updateOrderStatusAction(
  orderId: number,
  status: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
    await updateOrderStatus(orderId, status);
    revalidatePath("/admin-dashboard/orders");
    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: "Failed to update order status" };
  }
}

// ===================== PRODUCTS =====================

export async function createProductAction(
  _prevState: { success: boolean; error?: string } | undefined,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const stock_quantity = Number(formData.get("stock_quantity"));
    const category_id = Number(formData.get("category_id"));
    const image_url = formData.get("image_url") as string;

    if (!name || !description || !price || !category_id || !image_url) {
      return { success: false, error: "All fields are required" };
    }

    await createProduct({ name, description, price, stock_quantity, category_id, image_url });
    revalidatePath("/admin-dashboard/products");
    return { success: true };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: "Failed to create product" };
  }
}

export async function updateProductAction(
  productId: number,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const stock_quantity = Number(formData.get("stock_quantity"));
    const category_id = Number(formData.get("category_id"));
    const image_url = formData.get("image_url") as string;

    if (!name || !description || !price || !category_id || !image_url) {
      return { success: false, error: "All fields are required" };
    }

    await updateProduct(productId, { name, description, price, stock_quantity, category_id, image_url });
    revalidatePath("/admin-dashboard/products");
    return { success: true };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: "Failed to update product" };
  }
}

export async function deleteProductAction(
  productId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
    const deleted = await deleteProduct(productId);
    if (!deleted) {
      return { success: false, error: "Product not found" };
    }
    revalidatePath("/admin-dashboard/products");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}
