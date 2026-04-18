import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import ProfileSections from "./components/ProfileSections";
import { getOrderByUserID } from "@/lib/database/repositories/orders.repository";
import { getAddressesByUser } from "@/lib/database/repositories/addresses.repository";

async function Profile() {
   const session = await auth();   
   const userOrders = await getOrderByUserID(Number(session?.user?.id));
   const userAddresses = await getAddressesByUser(session?.user.id || '');   

   return (
      <div className="flex h-full pt-[80px] 2xl:pt-[120px]">         
         <SessionProvider session={session}>
            <ProfileSections userOrders={userOrders} userAddresses={userAddresses} />
         </SessionProvider>         
      </div>
   );
}

export default Profile;
