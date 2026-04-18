'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { uploadProfileImageAction } from '@/app/actions/profile.actions';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ProfileImageUpload() {
  const { data: session, update } = useSession();
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleImageChange = async (e:InputChange) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append('image', file);

    const result = await uploadProfileImageAction(formData);

    if (result.success && result.imageUrl) {      
      await update({ image: result.imageUrl }); // Forzamos a NextAuth a actualizar el token de la sesión en el cliente
      router.refresh(); // Refrescamos Next.js
    } else {
      alert(result.error || 'Error al subir la imagen');
    }
    
    setIsUploading(false);
  };   

  return (
    <>
    <div className='flex items-center gap-4 mt-6'>
      <div className="relative w-[120px] h-[120px] 2xl:w-[140px] 2xl:h-[140px] rounded-full overflow-hidden border-4 border-black shadow-md flex items-center justify-center bg-gray-100">
        {isUploading ? (
           <div className="animate-pulse bg-gray-300 w-full h-full absolute inset-0"></div>
        ) : (
          <Image
            src={session?.user?.image || '/default-avatar.png'}
            alt="Profile Image"
            fill
            className="object-cover"
            sizes="(max-width: 1536px) 120px, 140px"
          />
        )}
      </div>
      <div className='flex flex-col gap-6'>
        <h2>{session?.user.username}</h2>
        <label className="cursor-pointer bg-gradient-to-r from-indigo-700 to-blue-800  text-white font-medium py-3 px-4 rounded-xl flex items-center gap-2 shadow-sm disabled:opacity-50">
        {isUploading ? 'Uploading...' : 'Upload new image'}
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleImageChange}
          disabled={isUploading}
        />
      </label>      
      </div>
    </div>    
    </>
  );
}
