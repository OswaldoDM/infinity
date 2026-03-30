import Image from "next/image";

interface Props {
   src?: string;
   alt?: string;
   width: string;
   height: string;
   classname?: string;
}

function SmallProductImg({ src, alt, width, height, classname }: Props) {
   return (
      <div className={`relative ${width} ${height} ${classname}`}>
         <Image
            src={src || ''}
            alt={alt || ''}
            className="object-contain"
            fill
         />
      </div>
   )
}

export default SmallProductImg;