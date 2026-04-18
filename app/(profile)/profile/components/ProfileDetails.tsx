'use client';
import { useSession } from "next-auth/react";
import ProfileImageUpload from "./ProfileImageUpload";
import Input from "@/app/ui/Input";
import Button from "@/app/ui/Button";

function ProfileDetails() {
  const { data: session } = useSession();

  return (
    <>
    <ProfileImageUpload />
    <form className="grid grid-cols-2 gap-4 mt-6">
        <label className="flex flex-col gap-1 text-xs 2xl:text-sm" htmlFor="firstname">
        First name
        <Input
            type="text"
            id="firstname"
            placeholder={session?.user.first_name}
        />
        </label>
        <label className="flex flex-col gap-1 text-xs 2xl:text-sm" htmlFor="lastname">
        Last name
        <Input
            type="text"
            id="lastname"
            placeholder={session?.user.last_name}
        />
        </label>
        <label className="flex flex-col gap-1 text-xs 2xl:text-sm" htmlFor="email">
        Email
        <Input
            type="email"
            id="email"
            placeholder={session?.user.email!}
        />
        </label>
        <label className="flex flex-col gap-1 text-xs 2xl:text-sm" htmlFor="phone">
        Phone
        <Input
            type="text"
            id="phone"
            placeholder={session?.user.phone}
        />
        </label>
        <Button variant="primary" className="col-span-2 mt-4">
            Save details
        </Button>
    </form>
    </>
  )
}

export default ProfileDetails;