import Image from "next/image";

function Loading() {
   return (
      <div className='flex justify-center items-center h-[80%]'>
         {/* <div className='animate-spin rounded-full h-32 w-32 border-b-4 border-gray-900'></div>       */}
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