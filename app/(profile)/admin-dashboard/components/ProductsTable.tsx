"use client";

import { useState } from "react";
import Image from "next/image";
import { createProductAction, updateProductAction, deleteProductAction } from "@/app/actions/admin.actions";
import Button from "@/app/ui/Button";

interface Props {
  products: Product[];
  categories: Category[];
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  stock_quantity: string;
  category_id: string;
  image_url: string;
};

const emptyForm: ProductFormData = {
  name: "",
  description: "",
  price: "",
  stock_quantity: "",
  category_id: "",
  image_url: "",
};

export default function ProductsTable({ products, categories }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const openCreate = () => {
    setEditingProduct(null);
    setDeletingProduct(null);
    setFormData(emptyForm);
    setError("");
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setDeletingProduct(null);
    setFormData({
      name: product.name,
      description: product.description,
      price: String(product.price),
      stock_quantity: String(product.stock_quantity),
      category_id: String(product.category_id),
      image_url: product.image_url,
    });
    setError("");
    setShowModal(true);
  };

  const openDelete = (product: Product) => {
    setDeletingProduct(product);
    setEditingProduct(null);
    setError("");
    setShowModal(true);
  };

  const handleChange = (e: InputChange) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData();
    Object.entries(formData).forEach(([key, value]) => fd.append(key, value));

    let result;
    if (editingProduct) {
      result = await updateProductAction(editingProduct.id, fd);
    } else {
      result = await createProductAction(undefined, fd);
    }

    if (result.success) {
      setShowModal(false);
    } else {
      setError(result.error || "Something went wrong");
    }
    setLoading(false);
  }; 

  const confirmDelete = async () => {
    if (!deletingProduct) return;
    setLoading(true);
    setError("");
    const result = await deleteProductAction(deletingProduct.id);
    if (!result.success) {
      setError(result.error || "Failed to delete product");
    } else {
      setShowModal(false);
      setDeletingProduct(null);
    }
    setLoading(false);
  };  

  return (
    <>
      {/* ADD PRODUCT BUTTON */}
      <div className="flex justify-end mb-2">
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-xl font-medium text-sm hover:bg-gray-800 transition duration-200 active:scale-[0.98]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Product
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[480px] 2xl:max-h-[560px]">
          <table className="w-full font-inter">
            <thead>
              <tr className="text-left text-xs text-gray_secondary border-b border-gray-100">
                <th className="px-5 py-3 font-medium">Image</th>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Stock</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody >
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-contain"
                        sizes="40px"
                      />
                    </div>
                  </td>
                  <td className="px-5 py-3 font-medium max-w-[200px] truncate">{product.name}</td>
                  <td className="px-5 py-3 text-gray_secondary capitalize">{product.category_name || "—"}</td>
                  <td className="px-5 py-3 font-semibold">${Number(product.price).toFixed(2)}</td>
                  <td className="px-5 py-3">
                    <span className={`py-1 px-2.5 rounded-full text-xs font-semibold ${
                      product.stock_quantity <= 5
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}>
                      {product.stock_quantity}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(product)}
                        className="p-1.5 rounded-lg text-gray_secondary hover:text-black hover:bg-gray-100 transition duration-200"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => openDelete(product)}
                        className="p-1.5 rounded-lg text-gray_secondary hover:text-red-600 hover:bg-red-50 transition duration-200"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          {deletingProduct ? (
            <div className="bg-[#f5f5f5] rounded-xl p-6 w-full max-w-[400px] mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-semibold tracking-tight">Delete Product</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 rounded-lg hover:bg-gray-200 transition"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <p className="font-inter text-sm text-black_secondary mb-6">
                Are you sure you want to delete <span className="font-semibold text-black">{deletingProduct.name}</span>?
              </p>

              {error && (
                <p className="text-red-500 text-xs font-inter mb-3">{error}</p>
              )}

              <div className="flex gap-2">
                <Button type="button" onClick={() => setShowModal(false)} variant="secondary" className="border border-black_secondary">Cancel</Button>
                <Button type="button" onClick={confirmDelete} disabled={loading} variant="primary" className="bg-red-500">
                  {loading ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 w-full max-w-[480px] mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold tracking-tight">
                {editingProduct ? "Edit Product" : "New Product"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-gray-100 transition"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {error && (
              <p className="text-red-600 text-sm font-inter mb-3">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 font-inter">
              <input
                name="name"
                placeholder="Product name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full py-2.5 px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors placeholder:text-gray_secondary text-sm"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                className="w-full py-2.5 px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors placeholder:text-gray_secondary text-sm resize-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full py-2.5 px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors placeholder:text-gray_secondary text-sm"
                />
                <input
                  name="stock_quantity"
                  type="number"
                  placeholder="Stock quantity"
                  value={formData.stock_quantity}
                  onChange={handleChange}
                  required
                  className="w-full py-2.5 px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors placeholder:text-gray_secondary text-sm"
                />
              </div>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
                className="w-full py-2.5 px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <input
                name="image_url"
                placeholder="Image URL"
                value={formData.image_url}
                onChange={handleChange}
                required
                className="w-full py-2.5 px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors placeholder:text-gray_secondary text-sm"
              />
              <Button type="submit" disabled={loading} className="mt-2">
                {loading ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
              </Button>
            </form>
            </div>
          )}
        </div>
      )}
    </>
  );
}
