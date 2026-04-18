'use client';
import { useState } from "react";
import Image from "next/image";

interface Props {
   src?: string;
   alt?: string;
   width: string;
   height: string;
   classname?: string;
   sizes?: string;
}

function SmallProductImg({ src, alt, width, height, classname, sizes }: Props) {
   const [isLoading, setIsLoading] = useState(true);

   return (
      <div className={`relative ${width} ${height} ${classname}`}>
         {isLoading && (
            <div className={`flex justify-center items-center`}>
               <div className={`animate-spin rounded-full border-b-4 border-gray-900 h-20 w-20`}></div>
            </div>
         )}
         <Image
            src={src || ''}
            alt={alt || ''}
            className={`object-contain ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            fill
            sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
            onLoad={() => setIsLoading(false)}
         />
      </div>
      
   )
}

export default SmallProductImg;
