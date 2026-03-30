import Link from "next/link"

interface Props {
   classname?:string;
}

function BackToStoreBtn({classname}:Props) {
   return (
      <Link
         href="/"
         className={`inline-flex items-center bg-white font-semibold transition-colors group px-4 py-2 rounded-full ${classname}`}
      >
         <svg 
         className="w-4 h-4 mr-1 transform group-hover:-translate-x-1 transition-transform" 
         fill="none" stroke="currentColor" 
         viewBox="0 0 24 24" 
         xmlns="http://www.w3.org/2000/svg"
         >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
         </svg>
         Back to store
      </Link>
   )
}

export default BackToStoreBtn