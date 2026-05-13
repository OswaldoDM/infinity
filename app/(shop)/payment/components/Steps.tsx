'use client'
import { useCart } from "@/app/hooks/useCart";
import { useAddressManager } from "@/app/hooks/useAddressManager";
import { useState } from "react"
import Button from "@/app/ui/Button";
import SmallProductImg from "@/app/ui/components/SmallProductImg";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AddressFormModal from "./AddressFormModal";
import DeleteAddressModal from "./DeleteAddressModal";
import PaymentForm from "./PaymentForm";
import { createPaymentIntent, getOrderIdByPaymentIntent } from "@/app/actions/stripe.actions";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Image from "next/image";

// Cargar Stripe fuera del componente para evitar re-crearlo en cada render.
// loadStripe() solo hace la carga una vez y cachea el resultado.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Props {
   products: Product[];
   userAddresses: Address[];  
   userId: string;
}

function Steps({products, userAddresses, userId}: Props) {   
   const {
      addresses,
      selectedAddressId,
      setSelectedAddressId,
      isModalOpen,
      setIsModalOpen,
      editingAddress,
      setEditingAddress,
      deletingAddress,
      setDeletingAddress,
      handleAddressCreated,
      handleAddressUpdated,
      handleAddressDeleted
   } = useAddressManager(userAddresses);

   const [currentStep, setCurrentStep] = useState(1);
   const [paymentError, setPaymentError] = useState('');
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [isGoingToPayment, setIsGoingToPayment] = useState(false);
   const [clientSecret, setClientSecret] = useState<string | null>(null);
   const router = useRouter();   
   
   const { fullCart, totalCart, clearCart } = useCart(products);
   
   const finalAddress = addresses.find(address => address.id === selectedAddressId);


   // Crear PaymentIntent en Stripe al avanzar al paso de pago.
   // El clientSecret se usa para inicializar Stripe Elements en el frontend.
   const handleGoToPayment = async () => {
      setPaymentError('');
      setIsGoingToPayment(true);

      const fullCartItems = fullCart.map(item => ({
         productId: item.product!.id,
         quantity: item.quantity,
         priceAtPurchase: item.product!.price
      }));
      
      const result = await createPaymentIntent(
         totalCart,
         Number(userId),
         selectedAddressId,
         fullCartItems
      );

      if (result.success && result.clientSecret) {
         setClientSecret(result.clientSecret);
         setCurrentStep(2);
      } else {
         setPaymentError(result.error || 'Failed to initialize payment.');
      }
      
      setIsGoingToPayment(false);
   };

   // Cuando el pago es exitoso, hacer polling hasta que el webhook cree la orden.
   // Luego redirigir a la página de esa orden específica.
   const handlePaymentSuccess = async (paymentIntentId: string) => {
      setIsSubmitting(true);
      clearCart();

      // Polling: intentar cada 1.5 segundos, máximo 10 intentos (15 segundos).
      // El webhook normalmente crea la orden en menos de 2 segundos.
      const MAX_ATTEMPTS = 10;
      const INTERVAL_MS = 1500;

      for (let i = 0; i < MAX_ATTEMPTS; i++) {
         /*
         Esta promesa es una pausa de 1.5 segundos entre cada intento. 
         Sin ella, el loop haría las 10 consultas a la base de datos de 
         inmediato, antes de que el webhook tenga tiempo de crear la orden.
         */
         await new Promise(resolve => setTimeout(resolve, INTERVAL_MS));

         const result = await getOrderIdByPaymentIntent(paymentIntentId);
         if (result.success && result.orderId) {
            router.push(`/orders/${result.orderId}`);
            return;
         }
      }

      // Fallback: si después de 15 segundos no se encuentra la orden,
      // redirigir a la home page.
      // TODO: mostrar un mensaje de error al usuario en vez de redirigirlo.
      router.push('/');
   };


   return (
   <>
      <div className="flex justify-center gap-[74px] h-fit w-full">
         <div className={`flex gap-2 ${currentStep === 1 ? 'opacity-100' : 'opacity-30 transition-all duration-300'}`}>
            <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
               <svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill="white" d="M5.69526 0C4.94502 0.000307971 4.20222 0.148784 3.50951 0.436906C2.81679 0.725028 2.1878 1.14712 1.65864 1.67896C1.12948 2.2108 0.710561 2.84191 0.425937 3.53607C0.141312 4.23023 -0.00341517 4.97376 6.11705e-05 5.724C6.11705e-05 9.6792 4.08006 13.3056 5.33526 14.2656C5.44063 14.3526 5.57301 14.4002 5.70966 14.4002C5.84631 14.4002 5.97869 14.3526 6.08406 14.2656C7.34166 13.2768 11.3881 9.6792 11.3881 5.724C11.3915 4.97397 11.2469 4.23063 10.9624 3.53662C10.6779 2.84262 10.2592 2.21162 9.73033 1.67981C9.20142 1.148 8.57271 0.72586 7.88028 0.437596C7.18784 0.149333 6.4453 0.000623828 5.69526 0ZM5.69526 8.0904C5.22059 8.0904 4.75657 7.94964 4.36189 7.68593C3.96721 7.42221 3.6596 7.04738 3.47795 6.60884C3.2963 6.1703 3.24877 5.68774 3.34138 5.22218C3.43398 4.75663 3.66256 4.32899 3.9982 3.99334C4.33385 3.6577 4.76149 3.42912 5.22704 3.33652C5.6926 3.24391 6.17516 3.29144 6.6137 3.47309C7.05224 3.65474 7.42707 3.96235 7.69079 4.35703C7.9545 4.75171 8.09526 5.21573 8.09526 5.6904C8.09526 6.32692 7.8424 6.93737 7.39232 7.38746C6.94223 7.83754 6.33178 8.0904 5.69526 8.0904Z" />
               </svg>
            </div>
            <div className="font-inter font-medium">
               <p>Step 1</p>
               <p className="text-lg">Address</p>
            </div>
         </div>

         <div className={`flex gap-2 ${currentStep > 1 ? 'opacity-100' : 'opacity-30'} transition-all duration-300`}>
            <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
               <svg width="12" height="18" viewBox="0 0 12 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill="white" d="M11.2229 7.98007C11.0473 7.84184 9.49689 6.13449 8.61893 5.33873C8.61519 5.33499 8.61519 5.33499 8.61519 5.33126V1.65504C8.61519 0.743462 7.87173 0 6.96015 0H1.53923C0.691158 0 0 0.694894 0 1.53923V10.1619C0 11.0735 0.743462 11.8169 1.65504 11.8169H3.23163H3.63138C3.69863 11.8169 3.75467 11.7572 3.7472 11.6899L3.66127 10.9577C3.6538 10.8979 3.60523 10.8568 3.54545 10.8568H3.39975H3.31009C3.24658 10.8568 3.19427 10.8045 3.19427 10.741V0.945205C3.19427 0.881694 3.24658 0.82939 3.31009 0.82939H6.97136C7.34122 0.82939 7.64384 1.132 7.64384 1.50187V9.50436V10.2927C7.64384 10.5467 7.46824 10.7634 7.23288 10.8306C7.22914 10.8306 7.22914 10.8306 7.2254 10.8306C6.82565 10.6139 6.35492 9.68742 6.28394 9.54172C6.27646 9.53051 6.27273 9.51557 6.27273 9.50436C6.24658 9.26899 5.98132 6.99004 4.76712 6.99004C4.7335 6.99004 4.69988 6.99004 4.66625 6.99377C4.66625 6.99377 3.69489 7.07596 4.49813 9.84433C4.49813 9.8518 4.50187 9.85554 4.50187 9.86301L4.85679 12.9303C4.85679 12.934 4.85679 12.9377 4.86052 12.9452C4.89041 13.061 5.2939 14.6264 6.33624 15.736C6.35492 15.7584 6.36613 15.7846 6.36613 15.8144V16.0797C6.36613 16.0872 6.36239 16.0909 6.35492 16.0909H6.26152C6.03362 16.0909 5.84682 16.2777 5.84682 16.5056V17.5853C5.84682 17.8132 6.03362 18 6.26152 18H10.6588C10.8867 18 11.0735 17.8132 11.0735 17.5853V16.5131C11.0735 16.2852 10.8867 16.0984 10.6588 16.0984C10.6513 16.0984 10.6476 16.0946 10.6476 16.0872C10.7933 14.7347 11.3163 10.1096 11.5965 9.7472C11.604 9.73599 11.6115 9.72478 11.6152 9.70984C11.6638 9.54172 11.9066 8.51432 11.2229 7.98007ZM1.72976 10.7484C1.72976 10.8082 1.6812 10.8531 1.62516 10.8531C1.25903 10.8531 0.960149 10.5542 0.960149 10.188V1.4944C0.960149 1.12827 1.25903 0.82939 1.62516 0.82939C1.68493 0.82939 1.72976 0.877958 1.72976 0.933997V10.7484Z" />
               </svg>
            </div>
            <div className="font-inter font-medium">
               <p>Step 2</p>
               <p className="text-lg">Payment</p>
            </div>
         </div>
      </div>

      {/* SELECT ADDRESS */}
      <div className={`mt-12 2xl:mt-16 transition-all duration-300 ${currentStep === 1 ? 'flex flex-col items-center opacity-100' : 'hidden opacity-0'}`}>
         <h3 className="mb-4">Select Address</h3>
         <div className="flex flex-col gap-4">
            {addresses.map((address) => (
               <div key={address.id} className="bg-white rounded-xl p-4">
                  <div className="flex gap-2">
                     <input
                        type="radio"
                        name="selectedAddress"
                        onChange={() => setSelectedAddressId(address.id)}
                        checked={selectedAddressId === address.id}
                        className="appearance-none w-5 h-5 rounded-full border-2 border-[#7A7A7A] 
                        cursor-pointer transition-all duration-200 checked:bg-black checked:border-black 
                        checked:ring-4 checked:ring-inset checked:ring-white"                       
                     />
                     <div className="flex flex-col gap-1">
                        <p className="font-semibold tracking-tight">{address.shortname}</p>
                        <p className="font-inter text-xs 2xl:text-sm text-black_secondary min-w-[300px] max-w-[300px] 2xl:min-w-[350px] 2xl:max-w-[350px]">
                           {address.street},  {address.city}, {address.state} {address.postal_code}
                        </p>
                        <p className="text-xs">{address.phone}</p>                        
                     </div>
                     <div className="flex items-center justify-center gap-2 ml-5">
                        <svg onClick={() => setEditingAddress(address)} className="cursor-pointer" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <path fill="black" fillRule="evenodd" clipRule="evenodd" d="M8.64457 4.4433C9.67017 6.04664 11.0414 7.40892 12.6631 8.42474L5.77347 15.3154C5.34841 15.7404 5.13516 15.953 4.87406 16.0927C4.61311 16.2323 4.31846 16.2913 3.72953 16.4091L0.65238 17.0244C0.31977 17.0909 0.153238 17.1238 0.0586304 17.0292C-0.03566 16.9346 -0.00289749 16.7685 0.0635132 16.4365L0.679724 13.3593C0.797615 12.7699 0.856396 12.4749 0.99613 12.2138C1.13587 11.9528 1.34848 11.7404 1.77347 11.3154L8.64457 4.4433ZM13.0284 0.207945C13.5879 -0.0693263 14.2452 -0.0693037 14.8047 0.207945C15.0988 0.353681 15.3718 0.626562 15.917 1.17181C16.4621 1.71684 16.7352 1.98912 16.8809 2.28314C17.1581 2.84262 17.1581 3.5 16.8809 4.05951C16.7352 4.3536 16.4623 4.62656 15.917 5.17181L14.1202 6.96771C12.4476 6.01636 11.0624 4.63997 10.0987 2.9892L11.917 1.17181C12.4621 0.626778 12.7344 0.353724 13.0284 0.207945Z"/>
                        </svg>
                        <svg onClick={() => setDeletingAddress(address)} className="cursor-pointer" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <path d="M18 6L6 18" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
                           <path d="M6 6L18 18" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                     </div>
                  </div>
               </div>
            ))}
            <div className="flex justify-center bg-white rounded-xl py-2" onClick={() => setIsModalOpen(true)}>
               <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center cursor-pointer">
                  <span className="text-white text-lg">+</span>
               </div>
            </div>
            <div className="flex justify-center mt-4">
               <div className="flex gap-2 w-full min-w-[438px] max-w-[438px] 2xl:min-w-[480px]">                             
                  <Link href="/cart" className="w-full">
                     <Button variant="secondary">Back</Button>
                  </Link>            
                  <Button 
                     disabled={!selectedAddressId || isGoingToPayment} 
                     onClick={handleGoToPayment} 
                     variant="primary"
                  >
                     {isGoingToPayment ? (
                        <div className="animate-spin rounded-full w-5 h-5 border-b-4 border-white"></div>
                     ) : "Next"}
                  </Button>
               </div>
            </div>
            {paymentError ? (
               <p className="text-red-500 text-xs mt-2 font-inter text-center">{paymentError}</p>
            ):null}            
         </div>                  
      </div>

      {isSubmitting ? (
         <div className='flex justify-center items-center h-[80%]'>
            <div className='animate-spin rounded-full h-32 w-32 border-b-4 border-gray-900'></div>      
         </div>
         ) : (
         <div className={`mt-12 2xl:mt-16  ${currentStep === 2 ? 'flex flex-col-reverse lg:flex-row justify-center items-start gap-8 lg:gap-12 opacity-100' : 'hidden opacity-0'}`}>                       
            
            {/* PAYMENT */}
            <div className="w-full lg:w-1/2 max-w-md">               
               <h3 className="mb-4 text-xl font-bold tracking-tight">Payment Details</h3>               
               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">                  
                  {clientSecret && (
                     <Elements stripe={stripePromise} options={{
                        clientSecret,
                        appearance: {
                           theme: 'stripe',
                           variables: {
                              colorPrimary: '#000000',
                              borderRadius: '8px',
                              fontFamily: 'Inter, system-ui, sans-serif',
                              colorBackground: '#ffffff',
                              colorText: '#1f2937',
                           },
                        },
                     }}>
                        <PaymentForm 
                           onSuccess={handlePaymentSuccess}
                           onBack={() => setCurrentStep(1)}
                        />
                     </Elements>
                  )}
               </div>
            </div>            

            {/* SUMMARY */}
            <div className="w-full lg:w-1/2 max-w-md">
               <h3 className="mb-4 text-xl font-bold tracking-tight">Order Summary</h3>
               <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8'>
                  <div className={`max-h-[280px] mb-6 ${fullCart.length > 3 ? 'overflow-y-auto pr-2 custom-scrollbar' : ''}`}>
                     {fullCart.map((item) => (
                     <div key={item.product?.id} className={`flex items-start gap-4 mb-5`}>
                        <div className="bg-gray-50 rounded-lg p-2 shrink-0 border border-gray-100">
                           <SmallProductImg 
                              src={item.product?.image_url} 
                              alt={item.product?.name} 
                              width='w-[60px]' 
                              height='h-[60px]' 
                              sizes="60px"
                           />
                        </div>
                        <div className="flex-1 pt-1">
                           <p className="font-semibold text-sm line-clamp-2">{item.product?.name}</p>
                           <p className="text-xs text-gray-500 mt-1 font-inter">Qty: {item.quantity}</p>
                        </div>                     
                        <p className="font-bold text-sm pt-1">${((item.product?.price || 0) * item.quantity)}</p>                     
                     </div>
                     ))}
                  </div>
                  
                  <div className="pt-5 border-t border-gray-100 font-inter mb-4">
                     <p className="font-semibold text-black mb-1 text-sm">Shipping Address</p>                  
                     <p className="text-sm text-gray-500 leading-relaxed">{finalAddress?.street}, {finalAddress?.city}, {finalAddress?.state} {finalAddress?.postal_code}</p>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100 font-inter mb-6">
                     <div className="flex justify-between items-center text-sm mb-3">
                        <p className="text-gray-500">Subtotal</p>
                        <p className="font-semibold">${totalCart}</p>
                     </div>
                     <div className="flex justify-between items-center text-sm mb-2">
                        <p className="text-gray-500">Shipping</p>
                        <p className="font-semibold text-emerald-600">Free</p>
                     </div>
                  </div>
                  
                  <div className="pt-5 border-t border-gray-200 font-inter font-black flex justify-between items-center">
                     <p className="text-lg">Total</p>
                     <p className="text-xl">${totalCart}</p>
                  </div>
               </div>            
            </div>         
      </div>
      )}                  
      <AddressFormModal
         isOpen={isModalOpen}
         closeModal={() => setIsModalOpen(false)}
         userId={userId}
         onSuccess={handleAddressCreated}
      />
      {editingAddress && (
         <AddressFormModal
            isOpen={!!editingAddress}
            closeModal={() => setEditingAddress(null)}
            address={editingAddress}
            onSuccess={handleAddressUpdated}
         />
      )}
      {deletingAddress && (
         <DeleteAddressModal
            isOpen={!!deletingAddress}
            closeModal={() => setDeletingAddress(null)}
            address={deletingAddress}
            onAddressDeleted={handleAddressDeleted}
         />
      )}
   </>
   )
}

export default Steps