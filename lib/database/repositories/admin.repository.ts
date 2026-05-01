import { pool } from "../connection";

// ===================== DASHBOARD STATS =====================

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  lowStockProducts: number;
  recentOrders: Order[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const client = await pool.connect();

  try {
    // Ejecutar todas las queries en paralelo para mayor eficiencia
    const [revenueResult, ordersResult, usersResult, productsResult, lowStockResult, recentResult] =
      await Promise.all([
        client.query(`SELECT COALESCE(SUM(total_amount), 0) as total FROM orders`),
        client.query(`SELECT COUNT(*) as total FROM orders`),
        client.query(`SELECT COUNT(*) as total FROM users`),
        client.query(`SELECT COUNT(*) as total FROM products`),
        client.query(`SELECT COUNT(*) as total FROM products WHERE stock_quantity <= 5`),
        client.query(`
          SELECT o.id, o.user_id, o.order_date, o.status, o.total_amount, 
                 u.username
          FROM orders o
          LEFT JOIN users u ON o.user_id = u.id
          ORDER BY o.order_date DESC
          LIMIT 5
        `),
      ]);

    return {
      totalRevenue: Number(revenueResult.rows[0].total),
      totalOrders: Number(ordersResult.rows[0].total),
      totalUsers: Number(usersResult.rows[0].total),
      totalProducts: Number(productsResult.rows[0].total),
      lowStockProducts: Number(lowStockResult.rows[0].total),
      recentOrders: recentResult.rows,
    };
  } finally {
    client.release();
  }
}

// ===================== ORDERS =====================

export async function getAllOrders(): Promise<Order[]> {
  const query = `
    SELECT 
      o.id, o.user_id, o.order_date, o.status, o.total_amount, o.shipping_address_id,
      a.street, a.city, a.state, a.postal_code, a.country, a.shortname, a.phone as address_phone,
      u.username,
      json_agg(
        json_build_object(
          'id', oi.id,
          'product_id', oi.product_id,
          'quantity', oi.quantity,
          'price_at_purchase', oi.price_at_purchase,
          'product_name', p.name,
          'product_image', p.image_url
        )
      ) as items
    FROM orders o
    LEFT JOIN addresses a ON o.shipping_address_id = a.id
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    LEFT JOIN users u ON o.user_id = u.id
    GROUP BY o.id, a.id, u.username
    ORDER BY o.order_date DESC;
  `;
  const result = await pool.query(query);
  return result.rows;
}

export async function updateOrderStatus(
  orderId: number,
  status: string
): Promise<Order | null> {
  const query = `
    UPDATE orders 
    SET status = $1 
    WHERE id = $2 
    RETURNING *;
  `;
  const result = await pool.query(query, [status, orderId]);
  return result.rows[0] || null;
}

// ===================== PRODUCTS =====================

export async function createProduct(data: {
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category_id: number;
  image_url: string;
}): Promise<Product> {
  const query = `
    INSERT INTO products (name, description, price, stock_quantity, category_id, image_url)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const result = await pool.query(query, [
    data.name,
    data.description,
    data.price,
    data.stock_quantity,
    data.category_id,
    data.image_url,
  ]);
  return result.rows[0];
}

export async function updateProduct(
  id: number,
  data: {
    name: string;
    description: string;
    price: number;
    stock_quantity: number;
    category_id: number;
    image_url: string;
  }
): Promise<Product | null> {
  const query = `
    UPDATE products 
    SET name = $1, description = $2, price = $3, stock_quantity = $4, 
        category_id = $5, image_url = $6, updated_at = NOW()
    WHERE id = $7
    RETURNING *;
  `;
  const result = await pool.query(query, [
    data.name,
    data.description,
    data.price,
    data.stock_quantity,
    data.category_id,
    data.image_url,
    id,
  ]);
  return result.rows[0] || null;
}

export async function deleteProduct(id: number): Promise<boolean> {
  const result = await pool.query("DELETE FROM products WHERE id = $1", [id]);
  return (result.rowCount ?? 0) > 0;
}

// ===================== USERS =====================

interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: "user" | "admin";
  image_url?: string;
  created_at: Date;
  first_name?: string;
  last_name?: string;
  order_count: number;
}

export async function getAllUsers(): Promise<AdminUser[]> {
  const query = `
    SELECT 
      u.id, u.username, u.email, u.role, u.image_url, u.created_at, 
      u.first_name, u.last_name,
      COUNT(o.id)::int as order_count
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    GROUP BY u.id
    ORDER BY u.created_at DESC;
  `;
  const result = await pool.query(query);
  return result.rows;
}
