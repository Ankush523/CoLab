import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Image from 'next/image'
import code from '@/images/code.png'

const Navbar = () => {

  return (
    <div className='flex flex-row justify-around p-4 text-black'>
        <div className='flex flex-row space-x-2'>
            <Image src={code} width={40} height={40} alt={''} />
            <label className='mt-2 text-2xl font-semibold'>CoLab</label>
        </div>
       <div className='flex flex-row space-x-8'>
            <label className='my-3 text-sm'>Home</label>
            <label className='my-3 text-sm'>About</label>
            <ConnectButton/>
       </div>
    </div>
  )
}

export default Navbar