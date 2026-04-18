'use client';
import { useState } from 'react';
import { logoutAction } from '@/app/actions/auth.actions';
import Button from '@/app/ui/Button';
import ProfileDetails from './ProfileDetails';
import ProfileOrders from './ProfileOrders';
import ProfileAddresses from './ProfileAddresses';

interface Props {
  userOrders: Order[];
  userAddresses: Address[];
}

function ProfileSections({ userOrders, userAddresses }: Props) {
  const [activeSection, setActiveSection] = useState('details');

  return (
    <div className='flex gap-7 max-h-[400px] 2xl:max-h-[460px] min-w-[700px] 2xl:min-w-[800px] mx-auto'>

      {/* MENU */}
      <div className='relative py-8 rounded-xl bg-white w-[28%]'>
        <h2 className='font-medium text-center'>Profile</h2>
        <nav className='flex flex-col gap-2 mt-8 pl-6 w-fit mx-auto text-base 2xl:gap-3 2xl:text-lg'>
          <p className='cursor-pointer' onClick={() => setActiveSection('details')}>Details</p>
          <p className='cursor-pointer' onClick={() => setActiveSection('orders')}>Orders</p>
          <p className='cursor-pointer' onClick={() => setActiveSection('addresses')}>Addresses</p>          
        </nav>
        <form action={logoutAction}>
          <Button
            type='submit'
            variant='secondary'
            className='absolute top-[82%] left-[31%] max-w-[67px] 2xl:min-w-[80px] font-urbanist font-semibold border border-gray_secondary hover:bg-red-500 hover:border-red-500'
          >
            Logout
          </Button>
        </form>
      </div>

      {/* SECTIONS */}
      <div className='w-[72%]'>
        {activeSection === 'details' && <ProfileDetails />}
        {activeSection === 'orders' && <ProfileOrders userOrders={userOrders} />}
        {activeSection === 'addresses' && <ProfileAddresses userAddresses={userAddresses} />}        
      </div>
    </div>
  );
}

export default ProfileSections;
