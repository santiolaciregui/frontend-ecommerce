'use client'

interface AlertProps {
  text: string;
}

const Alert: React.FC<AlertProps> = ({ text }) => {
    return (
      <div className="min-h-8 px-4 md:px-8 lg:px-16 xl:px-32 bg-zinc-900 text-white flex items-center justify-center">
        <div className="flex items-center justify-center h-full w-auto min-w-[10rem] text-center text-xs tracking-wide">
          {text}
        </div>
      </div>
    );
  }

  export default Alert;
