'use client'
const Alert = ({ text }) => {
    return (
      <div className="min-h-7 px-4 md:px-8 lg:px-16 xl:px-32 bg-green-500 flex items-center justify-center">
        <div className="flex items-center justify-center h-full w-auto min-w-[10rem] text-center text-sm">
          {text}
        </div>
      </div>
    );
  }
  
  export default Alert;
  