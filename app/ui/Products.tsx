'use client'
import { useState } from "react";
import Link from "next/link";
import SmallProductImg from "./components/SmallProductImg";

interface Props {
   categories: Category[];
   products: Product[];
}

const CATEGORIES = {
   ALL: 'all',
   PHONE: 'phone',
   LAPTOPS: 'laptops',
   HEADPHONES: 'headphones',
   CARRY: 'carry',
} as const

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
   Laptops: (
      <svg width="18" height="14" viewBox="0 0 18 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
         <path fill="#currentColor" d="M16.5 9V0H1.5V9H0V11.25C0 11.8467 0.237053 12.419 0.65901 12.841C1.08097 13.2629 1.65326 13.5 2.25 13.5H15.75C16.3467 13.5 16.919 13.2629 17.341 12.841C17.7629 12.419 18 11.8467 18 11.25V9H16.5ZM3 1.5H15V9H11.1907L10.5555 9.75H7.44375L6.80925 9H3V1.5ZM16.5 11.25C16.5 11.4489 16.421 11.6397 16.2803 11.7803C16.1397 11.921 15.9489 12 15.75 12H2.25C2.05109 12 1.86032 11.921 1.71967 11.7803C1.57902 11.6397 1.5 11.4489 1.5 11.25V10.5H6.11325L6.75 11.25H11.25L11.8853 10.5H16.5V11.25Z"/>
      </svg>
   ),
   Headphones: (
      <svg className="mb-[2px]" width="17" height="15" viewBox="0 0 18 15" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
         <path fill="currentColor" d="M15.7388 7.818V6.75C15.7388 4.95979 15.0276 3.2429 13.7618 1.97703C12.4959 0.711159 10.779 0 8.98879 0C7.19858 0 5.48169 0.711159 4.21582 1.97703C2.94995 3.2429 2.23879 4.95979 2.23879 6.75V7.818C1.45216 8.16438 0.808394 8.77046 0.41526 9.5348C0.0221255 10.2991 -0.0965108 11.1753 0.0792117 12.0167C0.254934 12.858 0.714349 13.6135 1.38055 14.1566C2.04674 14.6997 2.87928 14.9974 3.73879 15H5.23879V7.5H3.73879V6.75C3.73879 5.35761 4.29192 4.02225 5.27648 3.03769C6.26105 2.05312 7.59641 1.5 8.98879 1.5C10.3812 1.5 11.7165 2.05312 12.7011 3.03769C13.6857 4.02225 14.2388 5.35761 14.2388 6.75V7.5H12.7388V15H14.2388C15.0983 14.9974 15.9308 14.6997 16.597 14.1566C17.2632 13.6135 17.7227 12.858 17.8984 12.0167C18.0741 11.1753 17.9555 10.2991 17.5623 9.5348C17.1692 8.77046 16.5254 8.16438 15.7388 7.818V7.818ZM3.73879 13.5C3.14206 13.5 2.56976 13.2629 2.1478 12.841C1.72585 12.419 1.48879 11.8467 1.48879 11.25C1.48879 10.6533 1.72585 10.081 2.1478 9.65901C2.56976 9.23705 3.14206 9 3.73879 9V13.5ZM14.2388 13.5V9C14.8355 9 15.4078 9.23705 15.8298 9.65901C16.2517 10.081 16.4888 10.6533 16.4888 11.25C16.4888 11.8467 16.2517 12.419 15.8298 12.841C15.4078 13.2629 14.8355 13.5 14.2388 13.5Z"/>
      </svg>
   ),
   Carry: (
      <svg className="mb-[2px]" width="16" height="16" viewBox="0 0 18 18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
         <path fill="currentColor" d="M15.75 3H13.5V1.5C13.5 1.10218 13.342 0.720644 13.0607 0.43934C12.7794 0.158035 12.3978 0 12 0L6 0C5.60218 0 5.22064 0.158035 4.93934 0.43934C4.65804 0.720644 4.5 1.10218 4.5 1.5V3H2.25C1.65326 3 1.08097 3.23705 0.65901 3.65901C0.237053 4.08097 0 4.65326 0 5.25L0 18H18V5.25C18 4.65326 17.7629 4.08097 17.341 3.65901C16.919 3.23705 16.3467 3 15.75 3V3ZM6 1.5H12V3H6V1.5ZM2.25 4.5H15.75C15.9489 4.5 16.1397 4.57902 16.2803 4.71967C16.421 4.86032 16.5 5.05109 16.5 5.25V9H1.5V5.25C1.5 5.05109 1.57902 4.86032 1.71967 4.71967C1.86032 4.57902 2.05109 4.5 2.25 4.5V4.5ZM1.5 16.5V10.5H8.25V12H9.75V10.5H16.5V16.5H1.5Z"/>
      </svg>
   ),
   Phones: (
      <svg width="12" height="18" viewBox="0 0 12 18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
         <path fill="#currentColor" d="M0 0V15.75C0 16.3467 0.237053 16.919 0.65901 17.341C1.08097 17.7629 1.65326 18 2.25 18H9.75C10.3467 18 10.919 17.7629 11.341 17.341C11.7629 16.919 12 16.3467 12 15.75V0H0ZM10.5 1.5V12H1.5V1.5H10.5ZM9.75 16.5H2.25C2.05109 16.5 1.86032 16.421 1.71967 16.2803C1.57902 16.1397 1.5 15.9489 1.5 15.75V13.5H10.5V15.75C10.5 15.9489 10.421 16.1397 10.2803 16.2803C10.1397 16.421 9.94891 16.5 9.75 16.5Z" />
      </svg>
   ),
};

function Products({ categories, products }: Props) {
   const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES.ALL);

   const handleCategories = (newCategory: string) => setSelectedCategory(newCategory);

   const filteredProducts = products.filter((product) => {
      if (selectedCategory === CATEGORIES.ALL) return true;
      return product.category_name === selectedCategory;
   });

   return (
      <div>
         {/* CATEGORIES */}
         <div className="flex gap-5 mb-6">
            <button
               onClick={() => handleCategories(CATEGORIES.ALL)}
               className={`p-2 flex gap-2 border rounded-lg font-medium bg-white transition duration-200 
               ${selectedCategory === CATEGORIES.ALL ? 'border-black text-black' : 'border-gray-400 text-gray_secondary hover:text-black hover:border-black'}`}
            >
               <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_194_171)">
                     <path
                        fill="currentColor"
                        d="M16.8639 8.23149L9.00012 12.9505L1.13637 8.23149C0.965804 8.12915 0.761568 8.09876 0.568594 8.147C0.375619 8.19524 0.209712 8.31817 0.107372 8.48874C0.00503132 8.6593 -0.0253599 8.86354 0.0228838 9.05652C0.0711276 9.24949 0.194054 9.4154 0.364622 9.51774L8.61462 14.4677C8.73127 14.5378 8.86479 14.5748 9.00087 14.5748C9.13696 14.5748 9.27047 14.5378 9.38712 14.4677L17.6371 9.51774C17.8077 9.4154 17.9306 9.24949 17.9789 9.05652C18.0271 8.86354 17.9967 8.86354 17.8944 8.48874C17.792 8.31817 17.6261 8.19524 17.4332 8.147C17.2402 8.09876 17.0359 8.12915 16.8654 8.23149H16.8639Z"
                     />
                     <path
                        fill="currentColor"
                        d="M16.8639 11.6571L9.00017 16.3754L1.13642 11.6571C1.05196 11.6064 0.958349 11.5729 0.860929 11.5584C0.763509 11.5439 0.664189 11.5487 0.568637 11.5726C0.473086 11.5965 0.383175 11.639 0.304038 11.6976C0.224902 11.7563 0.158089 11.8299 0.107415 11.9144C0.0567414 11.9988 0.0231987 12.0924 0.00870227 12.1899C-0.00579419 12.2873 -0.000960485 12.3866 0.0229274 12.4821C0.0711711 12.6751 0.194098 12.841 0.364665 12.9434L8.61467 17.8934C8.73131 17.9635 8.86483 18.0005 9.00092 18.0005C9.137 18.0005 9.27052 17.9635 9.38717 17.8934L17.6372 12.9434C17.8077 12.841 17.9307 12.6751 17.9789 12.4821C18.0271 12.2892 17.9968 12.0849 17.8944 11.9144C17.7921 11.7438 17.6262 11.6209 17.4332 11.5726C17.2402 11.5244 17.036 11.5548 16.8654 11.6571H16.8639Z"
                     />
                     <path
                        fill="currentColor"
                        d="M8.99993 11.0801C8.59537 11.0798 8.19847 10.9697 7.85168 10.7613L0.363681 6.26807C0.252791 6.20139 0.161039 6.10716 0.0973411 5.99453C0.0336435 5.8819 0.000167847 5.75471 0.000167847 5.62532C0.000167847 5.49592 0.0336435 5.36873 0.0973411 5.25611C0.161039 5.14348 0.252791 5.04925 0.363681 4.98257L7.85168 0.489316C8.19846 0.280988 8.59538 0.170929 8.99993 0.170929C9.40448 0.170929 9.8014 0.280988 10.1482 0.489316L17.6362 4.98257C17.7471 5.04925 17.8388 5.14348 17.9025 5.25611C17.9662 5.36873 17.9997 5.49592 17.9997 5.62532C17.9997 5.75471 17.9662 5.8819 17.9025 5.99453C17.8388 6.10716 17.7471 6.20139 17.6362 6.26807L10.1482 10.7613C9.80139 10.9697 9.40449 11.0798 8.99993 11.0801V11.0801ZM2.20793 5.62532L8.62493 9.47507C8.73827 9.54286 8.86786 9.57867 8.99993 9.57867C9.132 9.57867 9.26159 9.54286 9.37493 9.47507L15.7919 5.62532L9.37493 1.77557C9.26159 1.70777 9.132 1.67197 8.99993 1.67197C8.86786 1.67197 8.73827 1.70777 8.62493 1.77557V1.77557L2.20793 5.62532Z"
                     />
                  </g>
                  <defs>
                     <clipPath id="clip0_194_171">
                        <rect width="18" height="18" fill="white" />
                     </clipPath>
                  </defs>
               </svg>
               <span>All</span>
            </button>
            {categories.map((category) => (
               <button
                  key={category.id}
                  onClick={() => handleCategories(category.name)}
                  className={`py-2 px-3 flex items-center gap-2 border rounded-lg font-medium bg-white transition duration-200 
                  ${selectedCategory === category.name ? 'border-black text-black' : 'border-gray-400 text-gray_secondary hover:text-black hover:border-black'}
                  `}
               >
                   {CATEGORY_ICONS[category.name]}
                  <span>{category.name}</span>
               </button>
            ))}
         </div>

         {/* PRODUCTS GRID */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-x-7 gap-y-5 2xl:gap-y-7">
            {filteredProducts.map((product) => (
               <Link
                  href={`/product/${product.id}`}
                  key={product.id}
                  className="flex flex-col justify-between items-center gap-3 py-3 cursor-pointer bg-white rounded-xl border border-gray-400 hover:border-black transition duration-200 2xl:gap-5 "
               >
                  <p className="text-xs 2xl:text-sm font-inter">{product.name}</p>                  
                  <SmallProductImg src={product.image_url} alt={product.name} width='w-[128px]' height='h-[100px]' />
                  <p className="font-semibold">{Number(product.price)}$</p>
               </Link>
            ))}
         </div>
      </div>
   )
}

export default Products;