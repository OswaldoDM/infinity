'use client';
import Image from 'next/image';
import { useState } from 'react';

interface Props {
   src: string;
   alt: string;
}

function ProductImage({ src, alt }: Props) {
   const [loaded, setLoaded] = useState(false);   

   return (
      <div className="relative">         
         {!loaded && (            
            <div className='absolute top-[30%] left-[40%]'>
               <div className='animate-spin rounded-full h-32 w-32 border-b-4 border-gray-900'></div>
            </div>
         )}
            <Image
               src={src}
               alt={alt}
               width={500}
               height={440}
               className={`object-contain w-auto max-w-[500px] min-h-[440px] max-h-[440px] 2xl:min-h-[500px] 2xl:max-h-[500px] transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
               onLoad={() => setLoaded(true)}
               priority
            />        
      </div>
   );
}

export default ProductImage;
