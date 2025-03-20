import React from 'react'

interface BannerProps {
  title: string;
}

export default function Banner({ title }: BannerProps) {
  return (
    <div className='bg-[#E10A0A] py-10 text-white text-center text-8xl text-bold w-full'>
      <h1>{title}</h1>
    </div>
  );
}
