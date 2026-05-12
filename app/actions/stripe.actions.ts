'use server';
import stripe from '@/lib/stripe';

/*
 - Crea un PaymentIntent en Stripe con el monto total de la orden.
  
 - El PaymentIntent es el objeto central de Stripe para manejar pagos.

 - Se crea en el servidor para nunca exponer la STRIPE_SECRET_KEY al cliente.
  
 - Obtiene y retorna el clientSecret que el frontend necesita para confirmar
    el pago usando Stripe Elements.
 */
export async function createPaymentIntent(
  amount: number,
  userId: number,
  addressId: number | null,
  cartItems: fullCartItem[]
) {
  try {
    // Stripe maneja montos en centavos (ej: $25.00 = 2500)
    const amountInCents = Math.round(amount * 100);

    // Crear PaymentIntent en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      
      // Metadata: datos que se adjuntan al PaymentIntent para usarlos 
      // después (ej: en el webhook al crear la orden en la base de datos).
      // Todos los valores deben ser strings.
      metadata: {
        userId: String(userId),
        addressId: String(addressId),
        cartItems: JSON.stringify(cartItems),
      },

      // automatic_payment_methods permite aceptar múltiples métodos de pago
      // automáticamente (tarjetas, Apple Pay, Google Pay, etc.)
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error: any) {
    console.error('Error creating PaymentIntent:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}




