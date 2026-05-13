import Stripe from 'stripe';

// Inicializar el SDK de Stripe con la clave secreta.
// Este archivo solo se usa en el servidor (Server Actions / API Routes).
// Nunca importar este archivo desde un componente cliente.

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default stripe;

/* 
   La confirmación del pago se maneja a través del webhook en:
   app/api/webhooks/stripe/route.ts
  
   Flujo completo:
   1. La Server Action createPaymentIntent crea el PaymentIntent y devuelve 
      el clientSecret al frontend.
   2. El frontend muestra el formulario de pago con Stripe Elements.
   3. El usuario completa el pago → Stripe procesa el cobro.
   4. Stripe envía un evento payment_intent.succeeded al webhook.
   5. El webhook verifica idempotencia, extrae userId/addressId/cartItems del metadata,
      y crea la orden en la base de datos con el stripe_payment_intent_id y payment_status='paid'
*/