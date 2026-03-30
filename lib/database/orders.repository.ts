import { pool } from "./connection";

export async function createOrder(
  userId:number, 
  totalAmount:number, 
  shippingAddressId:number | null, 
  items:Item[]): Promise<number> {
    
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Create the order
    const orderQuery = `
      INSERT INTO orders (user_id, total_amount, shipping_address_id)
      VALUES ($1, $2, $3)
      RETURNING id;
    `;
    const orderResult = await client.query(orderQuery, [
      userId,
      totalAmount,
      shippingAddressId,
    ]);
    const orderId = orderResult.rows[0].id;

    // Create order items
    for (const item of items) {
      const itemQuery = `
        INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
        VALUES ($1, $2, $3, $4);
      `;
      await client.query(itemQuery, [
        orderId,
        item.productId,
        item.quantity,
        item.priceAtPurchase,
      ]);
    }

    await client.query("COMMIT");
    return orderId;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating order:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getOrderById(orderId: number) {
  const query = `
    SELECT 
      o.id,
      o.user_id,
      o.order_date,
      o.status,
      o.total_amount,
      o.shipping_address_id,
      a.street,
      a.city,
      a.state,
      a.postal_code,
      a.country,
      a.shortname,
      a.phone as address_phone,
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
    WHERE o.id = $1
    GROUP BY o.id, a.id;
  `;
  const result = await pool.query(query, [orderId]);
  return result.rows[0] || null;
}

