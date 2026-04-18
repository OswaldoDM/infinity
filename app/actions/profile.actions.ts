'use server';
import { uploadImage } from '@/lib/cloudinary';
import { updateUserImage } from '@/lib/database/repositories/auth.repository';
import { auth } from '@/auth';

export async function uploadProfileImageAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'No autorizado' };
  }

  const file = formData.get('image') as File;
  if (!file || file.size === 0) {
    return { success: false, error: 'No se subió ninguna imagen' };
  }

  try {
    // 1. Subir a Cloudinary (en una carpeta específica)
    const result = await uploadImage(file, 'next-ecomm-profiles');
    const imageUrl = result.secure_url;

    // 2. Actualizar en la base de datos
    await updateUserImage(parseInt(session.user.id, 10), imageUrl);
    
    // Devolvemos la URL para que el cliente actualice la sesión
    return { success: true, imageUrl: imageUrl };
  } catch (error) {
    console.error('Error al subir imagen:', error);
    return { success: false, error: 'Hubo un error al procesar la imagen' };
  }
}
