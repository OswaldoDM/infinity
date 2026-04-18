import { useAddressManager } from "@/app/hooks/useAddressManager";
import AddressFormModal from "@/app/(shop)/payment/components/AddressFormModal";
import DeleteAddressModal from "@/app/(shop)/payment/components/DeleteAddressModal";
import { useSession } from "next-auth/react";

function ProfileAddresses({ userAddresses }: { userAddresses: Address[] }) {
   const { data: session } = useSession();
   const userId = session?.user?.id as string;

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

   return (
      <div className="flex flex-col gap-4">
         {addresses.length === 0 ? (
            <div className="flex items-center justify-center py-10 bg-white rounded-xl">
               <p className="text-gray-500 font-medium">Add new address</p>
            </div>
         ) : (
            addresses.map((address) => (
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
                        <p className="font-inter text-xs 2xl:text-sm text-black_secondary min-w-[340px] max-w-[340px] 2xl:min-w-[400px] 2xl:max-w-[400px]">
                           {address.street},  {address.city}, {address.state} {address.postal_code}
                        </p>
                        <p className="text-xs">{address.phone}</p>
                     </div>
                     <div className="flex items-center justify-center gap-2 ml-5">
                        <svg onClick={() => setEditingAddress(address)} className="cursor-pointer" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <path fill="black" fillRule="evenodd" clipRule="evenodd" d="M8.64457 4.4433C9.67017 6.04664 11.0414 7.40892 12.6631 8.42474L5.77347 15.3154C5.34841 15.7404 5.13516 15.953 4.87406 16.0927C4.61311 16.2323 4.31846 16.2913 3.72953 16.4091L0.65238 17.0244C0.31977 17.0909 0.153238 17.1238 0.0586304 17.0292C-0.03566 16.9346 -0.00289749 16.7685 0.0635132 16.4365L0.679724 13.3593C0.797615 12.7699 0.856396 12.4749 0.99613 12.2138C1.13587 11.9528 1.34848 11.7404 1.77347 11.3154L8.64457 4.4433ZM13.0284 0.207945C13.5879 -0.0693263 14.2452 -0.0693037 14.8047 0.207945C15.0988 0.353681 15.3718 0.626562 15.917 1.17181C16.4621 1.71684 16.7352 1.98912 16.8809 2.28314C17.1581 2.84262 17.1581 3.5 16.8809 4.05951C16.7352 4.3536 16.4623 4.62656 15.917 5.17181L14.1202 6.96771C12.4476 6.01636 11.0624 4.63997 10.0987 2.9892L11.917 1.17181C12.4621 0.626778 12.7344 0.353724 13.0284 0.207945Z" />
                        </svg>
                        <svg onClick={() => setDeletingAddress(address)} className="cursor-pointer" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <path d="M18 6L6 18" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                           <path d="M6 6L18 18" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                     </div>
                  </div>
               </div>
            ))
         )}
         <div className="flex justify-center bg-white rounded-xl py-2" onClick={() => setIsModalOpen(true)}>
            <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center cursor-pointer">
               <span className="text-white text-lg">+</span>
            </div>
         </div>         

         {userId && (
            <AddressFormModal
               isOpen={isModalOpen}
               closeModal={() => setIsModalOpen(false)}
               userId={userId}
               onSuccess={handleAddressCreated}
            />
         )}
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
      </div>
   )
}

export default ProfileAddresses