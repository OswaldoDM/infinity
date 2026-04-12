'use server';
import { createAddress, updateAddress, deleteAddress } from "@/lib/database/repositories/addresses.repository";

export async function createAddressAction(
  prevState: AddressActionState,
  formData: FormData
): Promise<AddressActionState> {
  
  const userId = Number(formData.get('userId'));
  const shortname = formData.get('shortname') as string;
  const street = formData.get('street') as string;
  const city = formData.get('city') as string;
  const state = formData.get('state') as string;
  const postalCode = formData.get('postalCode') as string;
  const phone = formData.get('phone') as string;

  try {
    const address = await createAddress(userId, shortname, street, city, state, postalCode, phone);
    return { success: true, address };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateAddressAction(
  prevState: AddressActionState,
  formData: FormData
): Promise<AddressActionState> {

  const addressId = Number(formData.get('addressId'));
  const shortname = formData.get('shortname') as string;
  const street = formData.get('street') as string;
  const city = formData.get('city') as string;
  const state = formData.get('state') as string;
  const postalCode = formData.get('postalCode') as string;
  const phone = formData.get('phone') as string;

  try {
    const address = await updateAddress(addressId, shortname, street, city, state, postalCode, phone);
    return { success: true, address };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteAddressAction(
  prevState: DeleteAddressState,
  formData: FormData
): Promise<DeleteAddressState> {

  const addressId = Number(formData.get('addressId'));

  try {
    await deleteAddress(addressId);
    return { success: true, deletedId: addressId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
