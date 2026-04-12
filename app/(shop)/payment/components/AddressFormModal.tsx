'use client'
import { useActionState, useEffect } from "react"
import Input from "@/app/ui/Input"
import Button from "@/app/ui/Button"
import { createAddressAction, updateAddressAction } from "@/app/actions/address.actions"

interface Props {
   isOpen: boolean
   closeModal: () => void
   onSuccess: (address: Address) => void
   userId?: string
   address?: Address
}

const initialState: AddressActionState = { success: false }

function AddressFormModal({ isOpen, closeModal, onSuccess, userId, address }: Props) {
   const isEditing = !!address
   const action = (isEditing) ? updateAddressAction : createAddressAction
   const [state, formAction, isPending] = useActionState(action, initialState)

   useEffect(() => {
      if (state.success && state.address) {
         onSuccess(state.address)
         closeModal()
      }
   }, [state])

   if (!isOpen) return null

   return (
      <div 
         className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
         onClick={closeModal}
      >
         <div 
            className="bg-[#f5f5f5] rounded-xl p-6 w-full max-w-[440px] mx-4"
            onClick={(e) => e.stopPropagation()}
         >
            <div className="flex justify-between items-center mb-5">
               <h3>{isEditing ? 'Edit Address' : 'New Address'}</h3>
               <div 
                  className="w-6 h-6 flex items-center justify-center cursor-pointer"
                  onClick={closeModal}
               >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M18 6L6 18" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
                     <path d="M6 6L18 18" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
               </div>
            </div>

            <form action={formAction} className="flex flex-col gap-3">
               {isEditing 
                  ? <input type="hidden" name="addressId" value={address.id} />
                  : <input type="hidden" name="userId" value={userId} />
               }
               <div>
                  <p className="font-inter text-[10px] text-black_secondary mb-1">Name</p>
                  <Input name="shortname" defaultValue={address?.shortname} placeholder="Home, Office..." required />
               </div>
               <div>
                  <p className="font-inter text-[10px] text-black_secondary mb-1">Street</p>
                  <Input name="street" defaultValue={address?.street} placeholder="123 Main St" required />
               </div>
               <div className="flex gap-2">
                  <div className="w-1/2">
                     <p className="font-inter text-[10px] text-black_secondary mb-1">City</p>
                     <Input name="city" defaultValue={address?.city} placeholder="New York" required />
                  </div>
                  <div className="w-1/2">
                     <p className="font-inter text-[10px] text-black_secondary mb-1">State</p>
                     <Input name="state" defaultValue={address?.state} placeholder="NY" required />
                  </div>
               </div>
               <div className="flex gap-2">
                  <div className="w-1/2">
                     <p className="font-inter text-[10px] text-black_secondary mb-1">Postal Code</p>
                     <Input name="postalCode" defaultValue={address?.postal_code} placeholder="10001" required />
                  </div>
                  <div className="w-1/2">
                     <p className="font-inter text-[10px] text-black_secondary mb-1">Phone</p>
                     <Input name="phone" defaultValue={address?.phone} placeholder="+1 555 123 4567" required />
                  </div>
               </div>

               {state.error && (
                  <p className="text-red-500 text-xs font-inter">{state.error}</p>
               )}

               <div className="flex gap-2 mt-4">
                  <Button type="button" onClick={closeModal} variant="secondary" className="border border-black_secondary">
                     Cancel
                  </Button>
                  <Button type="submit" disabled={isPending} variant="primary">
                     {isPending ? 'Saving...' : 'Save'}
                  </Button>
               </div>
            </form>
         </div>
      </div>
   )
}

export default AddressFormModal
