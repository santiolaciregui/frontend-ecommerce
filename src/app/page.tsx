import { Suspense } from "react"


const HomePage = async () => {


  return (
    <div className=''>
      <div className="mt-14 px-4 md:px-8 lg:px-16 xl:32 2xl:px-64 relative">
        <Suspense fallback={'loading'}>
          
        </Suspense>
      </div>
    </div>
  )
}

export default HomePage