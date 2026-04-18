import { pool } from "../connection";

export async function createOrder(
  userId:number, 
  totalAmount:number, 
  shippingAddressId:number | null, 
  items:fullCartItem[]): Promise<number> {

  // Atomicidad y el uso de Transacciones
  // La atomicidad es la propiedad de una transacción que garantiza que todas las operaciones 
  // dentro de la transacción se completen con éxito o ninguna se complete.  
    
  // 1. Obtenemos un cliente dedicado de la piscina (pool). 
  // Esto es obligatorio para transacciones, ya que todas las consultas (BEGIN, INSERTs, COMMIT)
  // deben realizarse sobre la *misma* conexión.
  const client = await pool.connect();

  try {
    // 2. Iniciamos la transacción. 
    // A partir de aquí, nada es permanente hasta que ejecutemos "COMMIT".
    await client.query("BEGIN");

    // 3. Primer paso: Insertar la orden para generar un ID.
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

    // 4. Segundo paso: Insertar cada producto de la orden en order_items usando el ID de la orden.
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

    // 5. Finalizamos: Si todo salió bien, hacemos "COMMIT" para guardar los cambios permanentemente.
    await client.query("COMMIT");
    return orderId;
  } catch (error) {
    // 6. Emergencia: Si CUALQUIER paso de arriba falla, "ROLLBACK" deshace todo lo que se hizo 
    // en esta transacción (por ejemplo, si se creó la orden pero fallaron los items, se borra la orden).
    await client.query("ROLLBACK");
    console.error("Error creating order:", error);
    throw error;
  } finally {
    // 7. Liberamos la conexión: Es VITAL devolver el cliente al pool para que otros lo usen.
    client.release();
  }
}

/****

Como funciona el BASE_ORDER_QUERY ?

1. Traemos toda la información básica de las tablas orders y addresses

2. Una orden podria tener multiples productos, por eso necesitamos crear
   un array de objetos con todos los productos y su data. Para esto usamos
   funciones de PostgreSQL. Usamos json_agg() para crear el arreglo y
   json_build_object() para crear cada objeto con las propiedades que le 
   indiquemos.

3. Luego hay que conectar las tablas. Empezamos tomando la tabla principal
   orders y la llamamos o.

   LEFT JOIN addresses a   ->  Une la order con la address cuando o.shipping_address_id = a.id
   LEFT JOIN order_items oi ->  Une la order con los order_items cuando o.id = oi.order_id

   LEFT JOIN products p -> Toma los order_items encontrados y los cruza con la tabla products para 
   obtener el nombre del producto y su imagen, ya que esa data no esta en la tabla order_items.

   GROUP BY o.id, a.id -> Agrupa los resultados por orden y address para que json_agg 
   funcione correctamente. le estás diciendo a la base de datos: "Agrupa y fusiona las filas que 
   tengan la misma order y la misma address.

****/

const BASE_ORDER_QUERY = `
  SELECT 
    o.id, o.user_id, o.order_date, o.status, o.total_amount, o.shipping_address_id,
    a.street, a.city, a.state, a.postal_code, a.country, a.shortname, a.phone as address_phone,
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
`;

export async function getOrderById(orderId: number): Promise<Order | null> {
  const query = BASE_ORDER_QUERY + `
    WHERE o.id = $1
    GROUP BY o.id, a.id;
  `;
  const result = await pool.query(query, [orderId]);
  return result.rows[0] || null;
}

export async function getOrderByUserID(userId: number): Promise<Order[]> {
  const query = BASE_ORDER_QUERY + `
    WHERE o.user_id = $1
    GROUP BY o.id, a.id
    ORDER BY o.order_date DESC;
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
}


/**

Porque necesitamos la id que tiene cada producto en la tabla order_items
en el objeto items? 

Para devoluciones, quejas o cancelaciones parciales

Imagina que en un futuro quieres agregar un botón al lado de 
cada producto de la orden que diga "Devolver este artículo" o 
"Levantar reporte".

Si el usuario hace clic ahí, ¿qué le envías al backend?

Si le envías solo el order.id y el product_id, el backend tendría 
que buscar "el artículo en la orden X que coincida con el producto Y".

Si le envías directamente el oi.id, el backend sabe exactamente y sin 
margen de error cuál fila en tu tabla order_items debe actualizar.

json_build_object(
        'id', oi.id, -> ESTA DE ACA        
      )

**/
