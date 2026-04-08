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
   return (
      <div className={`relative ${width} ${height} ${classname}`}>
         <Image
            src={src || ''}
            alt={alt || ''}
            className="object-contain"
            fill
            sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
         />
      </div>
   )
}

export default SmallProductImg;