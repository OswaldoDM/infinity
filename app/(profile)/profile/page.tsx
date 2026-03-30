import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { logoutAction } from "@/app/actions/auth.actions";
import ProfileImageUpload from "./components/ProfileImageUpload";
import Button from "@/app/ui/Button";
import Input from "@/app/ui/Input";

async function Profile() {
   const session = await auth();    

   return (
      <div className="flex h-full pt-[80px] 2xl:pt-[120px]">
         <div className=" flex gap-7 max-h-[400px] 2xl:max-h-[460px]  min-w-[700px] 2xl:min-w-[800px] mx-auto">
            <div className="relative py-8 rounded-xl bg-white w-[28%]">
               <h2 className="font-medium text-center">Profile</h2>
               <nav className="flex flex-col gap-2 mt-8 pl-6 w-fit mx-auto text-base">
                  <p>Details</p>
                  <p>Orders</p>
                  <p>Addresses</p>
                  <p>Credit Cards</p>
               </nav>
               <form action={logoutAction}>
                  <Button
                     type="submit"
                     variant="secondary"
                     className="absolute top-[82%] left-[31%] max-w-[67px] 2xl:min-w-[80px] font-urbanist font-semibold  border border-gray_secondary hover:bg-red-500 hover:border-red-500"
                  >
                     Logout
                  </Button>
               </form>
            </div>
            <div className="w-[72%]">
               <SessionProvider session={session}>
                  <ProfileImageUpload />
               </SessionProvider>
               <form className="grid grid-cols-2 gap-4 mt-6 2xl:mt-12">
                  <label className="flex flex-col gap-1 text-xs" htmlFor="firstname">
                     First name
                     <Input
                        type="text"
                        id="firstname"
                        placeholder={session?.user.first_name}
                     />
                  </label>
                  <label className="flex flex-col gap-1 text-xs" htmlFor="lastname">
                     Last name
                     <Input
                        type="text"
                        id="lastname"
                        placeholder={session?.user.last_name}
                     />
                  </label>
                  <label className="flex flex-col gap-1 text-xs" htmlFor="email">
                     Email
                     <Input
                        type="email"
                        id="email"
                        placeholder={session?.user.email!}
                     />
                  </label>
                  <label className="flex flex-col gap-1 text-xs" htmlFor="phone">
                     Phone
                     <Input
                        type="text"
                        id="phone"
                        placeholder={session?.user.phone}
                     />
                  </label>
                  <Button variant="primary" className="col-span-2 mt-4 2xl:mt-8">
                     Save details
                  </Button>
               </form>
            </div>
         </div>
      </div>
   );
}

export default Profile;
