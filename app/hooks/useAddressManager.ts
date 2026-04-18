import { useState } from 'react';

export function useAddressManager(initialAddresses: Address[]) {
   const defaultAddress = initialAddresses.find((a) => a.is_default) || initialAddresses[0];
   const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
   const [selectedAddressId, setSelectedAddressId] = useState<number | null>(defaultAddress?.id || null);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [editingAddress, setEditingAddress] = useState<Address | null>(null);
   const [deletingAddress, setDeletingAddress] = useState<Address | null>(null);

   const handleAddressCreated = (newAddress: Address) => {
      setAddresses(prev => [...prev, newAddress]);
      setSelectedAddressId(newAddress.id);
   };

   const handleAddressUpdated = (updatedAddress: Address) => {
      setAddresses(prev => prev.map(a => (a.id === updatedAddress.id) ? updatedAddress : a));
   };

   const handleAddressDeleted = (deletedId: number) => {
      setAddresses(prev => prev.filter(a => a.id !== deletedId));
      if (selectedAddressId === deletedId) {
         const remaining = addresses.filter(a => a.id !== deletedId);
         setSelectedAddressId(remaining[0]?.id || null);
      }
   };

   return {
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
   };
}
