import Image from "next/image";

function Loading() {
   return (
      <div className='flex justify-center items-center h-[80%]'>         
         <Image
            src="/infinity-animated.svg"
            alt="Logo"
            width={400}
            height={400}
         />
      </div>
   )
}

export default Loading;