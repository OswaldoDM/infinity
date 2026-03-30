'use client';
import BackToStoreBtn from '@/app/ui/components/BackToStoreBtn';
import SmallProductImg from '@/app/ui/components/SmallProductImg';
import Button from '@/app/ui/Button';
import Link from 'next/link';
import { useCart } from '@/app/hooks/useCart';

interface Props {
   products: Product[];
}

function CartProducts({ products }: Props) {
   const { cart, fullCart, totalCart, deleteProduct, updateQuantity } = useCart(products);

   return (
      <div className={`flex justify-center h-full 2xl:pt-[100px] ${cart.length === 0 ? 'pt-[40px]' : 'pt-[80px]'}`}>
         {cart.length === 0 ? (
            <div className='flex flex-col items-center justify-center gap-6 w-full max-w-[500px] bg-white rounded-[2rem] p-10 py-16 shadow-sm border border-gray-100 mt-4 h-fit'>
               <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11M5 9H19L20 21H4L5 9Z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
               </div>
               <div className="flex flex-col gap-2 items-center">
                  <h2 className="text-2xl font-bold tracking-tight text-black">Your cart is empty</h2>
                  <p className="text-gray-500 font-inter text-sm max-w-[300px] text-center">
                     Looks like you haven't added anything to your cart yet. Explore our top products and find your next favorite item!
                  </p>
               </div>
               <Link href="/" className="w-full max-w-[200px] mt-2">
                  <Button variant="primary">Start Shopping</Button>
               </Link>
            </div>
         ) : (
            <div className='flex gap-6 h-fit'>
               <div className='flex flex-col gap-4'>
                  <div className='flex items-center gap-1'>
                     <h3>Shooping Cart</h3>
                     <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#000" d="M20 2.5H3.535L3.5 2.2075C3.42837 1.59951 3.13615 1.03894 2.67874 0.632065C2.22133 0.225186 1.63052 0.000284828 1.01833 0L0 0V1.66667H1.01833C1.22244 1.66669 1.41945 1.74163 1.57198 1.87726C1.72451 2.0129 1.82195 2.19979 1.84583 2.4025L3.16667 13.6258C3.23829 14.2338 3.53051 14.7944 3.98792 15.2013C4.44534 15.6081 5.03614 15.833 5.64833 15.8333H16.6667V14.1667H5.64833C5.44409 14.1666 5.24699 14.0916 5.09444 13.9558C4.94189 13.82 4.84452 13.6329 4.82083 13.43L4.71167 12.5H18.1967L20 2.5ZM16.8033 10.8333H4.51583L3.73167 4.16667H18.0058L16.8033 10.8333Z" />
                        <path fill="#000"d="M5.83347 20.0005C6.75395 20.0005 7.50014 19.2543 7.50014 18.3339C7.50014 17.4134 6.75395 16.6672 5.83347 16.6672C4.913 16.6672 4.16681 17.4134 4.16681 18.3339C4.16681 19.2543 4.913 20.0005 5.83347 20.0005Z" />
                        <path fill="#000"d="M14.1667 20.0005C15.0871 20.0005 15.8333 19.2543 15.8333 18.3339C15.8333 17.4134 15.0871 16.6672 14.1667 16.6672C13.2462 16.6672 12.5 17.4134 12.5 18.3339C12.5 19.2543 13.2462 20.0005 14.1667 20.0005Z" />
                     </svg>
                  </div>
                  <ul className={`flex flex-col gap-5 max-h-[320px] ${cart.length > 3 ? 'overflow-y-scroll' : ''}`}>
                     {fullCart.map(item => (
                        <li key={item.productId} className='flex items-center justify-between p-3 min-w-[390px] rounded-xl bg-white'>
                           <div className='flex gap-3'>
                              <SmallProductImg src={item.product?.image_url} alt={item.product?.name} width='w-[52px]' height='h-[60px]' classname='2xl:w-[60px]' />
                              <div className='flex flex-col gap-1'>
                                 <p className='font-semibold'>{item.product?.name}</p>
                                 <p className='font-semibold text-black_secondary'>${((item.product?.price || 0) * item.quantity)}</p>
                                 <span
                                    className='font-inter text-[10px] text-black_secondary cursor-pointer hover:text-red-600 transition-colors'
                                    onClick={() => deleteProduct(item.productId)}>
                                    Delete
                                 </span>
                              </div>
                           </div>
                           <div className='flex items-center gap-2'>
                              <div
                                 onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                 className='w-5 h-5 flex justify-center items-center border border-gray_secondary hover:border-black transition duration-200 cursor-pointer'
                              >
                                 <span className='w-2 h-[1px] bg-black'></span>
                              </div>
                              <p className='font-inter font-medium'>{item.quantity}</p>
                              <div
                                 onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                 className='w-5 h-5 flex justify-center items-center border border-gray_secondary hover:border-black transition duration-200 cursor-pointer'
                              >
                                 <span> + </span>
                              </div>
                           </div>
                        </li>
                     ))}
                  </ul>
               </div>
               <div className='flex flex-col gap-4 min-w-[260px]'>
                  <h3>Order Summary</h3>
                  <div className='flex flex-col gap-1'>
                     <label htmlFor="discount code" className='font-inter text-xs text-black_secondary'>
                        Discount code
                     </label>
                     <input
                        type="text"
                        name='discount code'
                        className='py-[6px] px-[10px] border border-gray_primary rounded-lg focus:outline-none'
                        placeholder='Code'
                     />
                  </div>
                  <p className='font-inter text-xs text-black_secondary'>Free Shipping</p>
                  <div className='flex justify-between'>
                     <p className='font-inter font-medium'>Total</p>
                     <p className='font-bold text-base'>${totalCart}</p>
                  </div>
                  <Link href="/payment"><Button disabled={cart.length === 0}>Checkout</Button></Link>
               </div>
            </div>
         )}
         {cart.length > 0 && <BackToStoreBtn classname='absolute top-[85%] right-[70%] mt-4' />}
      </div>
   );
}

export default CartProducts;