'use client'
import Image from "next/image"
import Link from "next/link"

const Footer = () => {
    return (
    <div className='py-8 px-4 md:px-8 lg:px-16 mt-10 xl:px-32 2xl:px-64 bg-gray-100 text-sm '>
        {/* TOP */}
        <div className='flex justify-between gap-24'>
          {/* LEFT */}
          <div className='w-full md:w-1/2 lg:w-1/4 flex flex-col gap-8'>
            <Link href='/'>
              <div className="text-2xl tracking-wide">VERDE MANZANA</div>
            </Link>
            <p>Manuel Láinez 267, Q8300 Neuquén</p>
            <span className="font-semibold">verdemanzana@gmail.com</span>
            <span className="font-semibold">+54 0291 412-8292</span>
            <div className='flex gap-6'>
              <Image src='/facebook.png' alt='' width={16} height={16}/>
              <Image src='/x.png' alt='' width={16} height={16}/>
              <Image src='/youtube.png' alt='' width={16} height={16}/>

            </div>
          </div>
          {/* CENTER
          <div className='hidden lg:flex justify-between w-1/2'>
            <div className="flex flex-col justify-between">
              <h1 className="font-medium text-lg">COMPANY</h1>
              <div className="flex flex-col gap-6">
                <Link href=''>Sobre Nosotros</Link>
                <Link href=''>Formas de Envio</Link>
                <Link href=''>Contactanos</Link>
              </div>
            </div>
          </div> */}
          {/* RIGTH */}
          <div className='w-full md:w-1/2 lg:w-1/4 flex flex-col gap-8'>
            <h1 className="font-medium text-lg">SEGUINOS</h1>
            <p>Be the first to get the latest news about our new sillon and baiuts y much more</p>
            <div className="flex">
              <input type="text" placeholder="Email Address" className="p-4 w-3/4"/>
              <button className="w-1/4 bg-green-400 text-white">JOIN</button>
            </div>
              <span className="font-semibold">Metodos de pago</span>
              <div className="flex justify-between"> 
              <Image src="/visa.png" alt="" width={40} height={20}/>
              <Image src="/mastercard.png" alt="" width={40} height={20}/>
              <Image src="/paypal.png" alt="" width={40} height={20}/>
              </div>
          </div>
        </div>
        {/* BOTTOM
        <div className='flex flex-col md:flex-wor items-center justify-between gap-8 mt-16'>
          <div className="">VerdeManzana Tienda Online™</div>
        </div> */}
      </div>
    )
  }
  
  export default Footer 