import Image from 'next/image'
import React from 'react'

export default function Header() {
  return (
    <div className='flex justify-center border-bottom border-1 border-gray-200 py-1'>
        <Image src="/logo.png" alt="logo" width={65} height={64} />
    </div>
  )
}
