import { auth } from "@/auth";
import Steps from "./components/Steps";
import { getAddressesByUser } from "@/lib/database/repositories/addresses.repository";
import { getProducts } from "@/lib/database/repositories/products.repository";

async function PaymentPage() {
    const session = await auth();
    const products = await getProducts();
    const userAddresses = await getAddressesByUser(session?.user.id || '');    

  return (
    <div className="flex flex-col h-full pt-3 2xl:pt-6">        
        <Steps 
            userId={session?.user.id || ''} 
            products={products} 
            userAddresses={userAddresses}
        />
    </div>
  )
}

export default PaymentPage;