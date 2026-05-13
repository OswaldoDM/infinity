import Stripe from 'stripe';
import { NextRequest } from 'next/server';
import { createOrder, getOrderByPaymentIntentId } from '@/lib/database/repositories/orders.repository';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {

  // ─── Paso 1: Leer el body como texto crudo ───────────────────
  // Es FUNDAMENTAL leer el body con .text() y NO con .json().
  // Stripe firma el body exactamente como lo envía. Si lo parseas
  // con .json() y lo re-serializas, la firma cambia y la verificación
  // falla siempre.
  const body = await request.text();

  // ─── Paso 2: Obtener el header de firma ──────────────────────
  // Stripe envía un header 'stripe-signature' en cada webhook.
  // Contiene un timestamp y una firma HMAC generada con tu
  // STRIPE_WEBHOOK_SECRET.
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return new Response('No se encontró el header stripe-signature', { status: 400 });
  }

  // ─── Paso 3: Verificar la firma con constructEvent ───────────
  // constructEvent() toma el body crudo + tu webhook secret,
  // calcula el HMAC esperado y lo compara con la firma de Stripe.
  // Si coinciden → devuelve el evento parseado.
  // Si no coinciden → lanza un error (alguien intentó falsificar el webhook).
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('⚠️ Error verificando firma del webhook:', err.message);
    return new Response(`Firma inválida: ${err.message}`, { status: 400 });
  }

  // ─── Paso 4: Manejar el evento según su tipo ────────────────
  switch (event.type) {

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;

      console.log(`✅ Pago exitoso: ${paymentIntent.id} — $${paymentIntent.amount / 100}`);

      // ─── Paso 5: Idempotencia (evitar órdenes duplicadas) ────
      // Stripe puede enviar el mismo evento más de una vez (por reintentos, 
      // problemas de red, etc.). Si no verificamos, podríamos crear la misma 
      // orden dos veces. Usamos stripe_payment_intent_id como clave de 
      // idempotencia en la tabla orders.
      const existingOrder = await getOrderByPaymentIntentId(paymentIntent.id);
      if (existingOrder) {
        console.log(`⚠️ Orden ya existe para PaymentIntent ${paymentIntent.id}, saltando...`);
        break;
      }

      // ─── Paso 6: Crear la orden en la base de datos ─────────
      // Extraer los datos del metadata que se guardaron al crear el PaymentIntent
      // en el Server Action createPaymentIntent (stripe.actions.ts).
      const { userId, addressId, cartItems } = paymentIntent.metadata;

      try {
        const parsedCartItems: fullCartItem[] = JSON.parse(cartItems);
        const parsedAddressId = addressId === 'null' ? null : Number(addressId);

        const orderId = await createOrder(
          Number(userId),
          paymentIntent.amount / 100, // Convertir de centavos a dólares
          parsedAddressId,
          parsedCartItems,
          paymentIntent.id,  // stripe_payment_intent_id para idempotencia
          'paid',            // payment_status → el webhook solo se dispara si el pago fue exitoso
        );

        console.log(`✅ Orden #${orderId} creada para el usuario ${userId}`);

      } catch (error: any) {
        console.error('❌ Error al crear la orden desde webhook:', error.message);
        // Retornar 500 para que Stripe reintente el webhook.
        // Stripe reintentará hasta por 3 días con backoff exponencial.
        return new Response('Error al procesar la orden', { status: 500 });
      }

      break;
    }

    case 'payment_intent.payment_failed': {
      const failedPaymentIntent = event.data.object;
      console.error(
        `❌ Pago fallido: ${failedPaymentIntent.id}`,
        `— Razón: ${failedPaymentIntent.last_payment_error?.message || 'desconocida'}`
      );

      // TODO: Opcionalmente, notificar al usuario o guardar el intento fallido
      // en la base de datos para analítica.

      break;
    }

    default: {
      // Eventos que no manejamos (payment_intent.created, etc.)
      // Los ignoramos silenciosamente.
      console.log(`ℹ️ Evento no manejado: ${event.type}`);
    }
  }

  // ─── Paso 7: Responder con 200 ──────────────────────────────
  // SIEMPRE responder 200 al final (excepto en errores que queremos reintentar).
  // Si respondes con un error, Stripe reintentará el webhook hasta 3 días
  // con backoff exponencial.
  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
