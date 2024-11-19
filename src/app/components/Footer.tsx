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
            
            <a href="https://api.whatsapp.com/send?phone=%2B542914128292&context=ARApsBsv0AI30qWG9HpK4JiaNARoXvWnTc-QYeDNdzhUkW9PqMrR9M7Lp19AxDGuBk96BM0DqBU-vBwWANhykEXNX3mMhqJfW45DCxvJzIW8eFjylD2wktvV4AvxYccvgQQG5TreF4OdEzmuBbIvkv4&source=FB_Page&app=facebook&entry_point=page_cta" target="_blank" rel="noopener noreferrer"   className="inline-flex items-center">
            <Image src="/whatsapp.png" width={16} height={16} alt="WhatsApp"/>
            <span className="ml-2 font-semibold">+54 0291 412-8292</span>
            
            
          </a>
            
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
            
            <div className='flex gap-6'>
            <a href="https://www.facebook.com/VERDEMANZANAMUEBLESARGENTINA" target="_blank" rel="noopener noreferrer">
            <Image src="/facebook.png" width={16} height={16} alt="Facebook" />
          </a>
          <a href="https://www.instagram.com/mueblesverdemanzana/?hl=es-la" target="_blank" rel="noopener noreferrer">
            <Image src="/instagram.png" width={16} height={16} alt="Instagram" />
          </a>


            </div>
              <span className="font-semibold">Métodos de pago</span>
              <div className="flex justify-start"> 
              <Image src="/visa.png" alt="" width={40} height={20}/>
              <Image src="/mastercard.png" alt="" width={40} height={20}/>
    
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