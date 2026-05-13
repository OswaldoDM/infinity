'use client';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import Button from '@/app/ui/Button';

interface Props {
  onSuccess: (paymentIntentId: string) => void;
  onBack: () => void;
}

/*
 - Formulario de pago con Stripe Elements.
  
 - Usa el componente <PaymentElement /> que es un formulario pre-construido
   por Stripe que acepta tarjetas de crédito, débito, y otros métodos de pago
   según la configuración de automatic_payment_methods en el PaymentIntent.
  
 - Este componente DEBE estar envuelto en un <Elements> provider que le 
   pase el clientSecret del PaymentIntent.
 */

function PaymentForm({ onSuccess, onBack }: Props) {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isElementReady, setIsElementReady] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const handleSubmit = async (e: FormSubmit) => {
    e.preventDefault();

    // stripe y elements se cargan de forma asíncrona, podrían no estar listos aún
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setPaymentError('');

    /* 
     - confirmPayment() envía los datos de la tarjeta directamente a Stripe
       (nunca pasan por nuestro servidor). 
     - Stripe procesa el cobro y devuelve el resultado. 
     - Si el pago es exitoso, Stripe dispara el webhook 
       payment_intent.succeeded, que es donde se crea la orden en la DB.
    */
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required', // Solo redirige si el método de pago lo requiere (ej: 3D Secure)
      // Si necesitas redirigir siempre, usa: confirmParams: { return_url: 'https://tu-dominio.com/orders' }
    });

    if (error) {
      // Errores comunes:
      // - card_declined: tarjeta rechazada
      // - insufficient_funds: fondos insuficientes
      // - incorrect_cvc: CVV incorrecto
      // - expired_card: tarjeta expirada
      setPaymentError(error.message || 'An error occurred while processing your payment.');
      setIsProcessing(false);
    } else if (paymentIntent) {
      // El pago fue exitoso. Pasamos el paymentIntent.id al componente padre
      // para que pueda hacer polling y buscar la orden creada por el webhook.
      onSuccess(paymentIntent.id);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      
      {!isElementReady && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full w-8 h-8 border-b-4 border-gray-900"></div>
        </div>
      )}

      {/* PaymentElement renderiza el formulario completo de Stripe.
          onReady se dispara cuando el formulario termina de cargar. */}
      <div className={isElementReady ? '' : 'hidden'}>
        <PaymentElement onReady={() => setIsElementReady(true)} />
      </div>

      {isElementReady && (
        <>
          {paymentError && (
            <p className="text-red-500 text-xs mt-3 font-inter">{paymentError}</p>
          )}

          <div className="flex gap-2 mt-5">
            <span className="w-1/2">
              <Button
                type="button"
                disabled={isProcessing}
                onClick={onBack}
                variant="secondary"
              >
                Back
              </Button>
            </span>
            <span className="w-1/2">
              <Button
                type="submit"
                disabled={isProcessing || !stripe || !elements}
                variant="primary"
              >
                {isProcessing ? 'Processing...' : 'Pay'}
              </Button>
            </span>
          </div>
        </>
      )}
    </form>
  );
}

export default PaymentForm;
