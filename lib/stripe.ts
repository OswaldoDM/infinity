import Stripe from 'stripe';

// Inicializar el SDK de Stripe con la clave secreta.
// Este archivo solo se usa en el servidor (Server Actions / API Routes).
// Nunca importar este archivo desde un componente cliente.

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default stripe;
