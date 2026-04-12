'use client'
import { useActionState, useEffect } from "react"
import Button from "@/app/ui/Button"
import { deleteAddressAction } from "@/app/actions/address.actions"

interface Props {
   isOpen: boolean
   closeModal: () => void
   address: Address
   onAddressDeleted: (addressId: number) => void
}

const initialState: DeleteAddressState = { success: false }

function DeleteAddressModal({ isOpen, closeModal, address, onAddressDeleted }: Props) {
   const [state, formAction, isPending] = useActionState(deleteAddressAction, initialState)

   useEffect(() => {
      if (state.success && state.deletedId) {
         onAddressDeleted(state.deletedId)
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
            className="bg-[#f5f5f5] rounded-xl p-6 w-full max-w-[400px] mx-4"
            onClick={(e) => e.stopPropagation()}
         >
            <div className="flex justify-between items-center mb-5">
               <h3>Delete Address</h3>
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

            <p className="font-inter text-sm text-black_secondary mb-2">
               Are you sure you want to delete <span className="font-semibold text-black">{address.shortname}</span>?
            </p>
            <p className="font-inter text-xs text-black_secondary mb-6">
               {address.street}, {address.city}, {address.state} {address.postal_code}
            </p>

            {state.error && (
               <p className="text-red-500 text-xs font-inter mb-3">{state.error}</p>
            )}

            <form action={formAction}>
               <input type="hidden" name="addressId" value={address.id} />
               <div className="flex gap-2">
                  <Button type="button" onClick={closeModal} variant="secondary" className="border border-black_secondary">Cancel</Button>
                  <Button type="submit" disabled={isPending} variant="primary" className="!bg-red-500">
                     {isPending ? 'Deleting...' : 'Delete'}
                  </Button>
               </div>
            </form>
         </div>
      </div>
   )
}

export default DeleteAddressModal
