'use client'
import Confetti from "react-confetti"
const SuccessPage = () => {
    return (
        <div className="flex flex-col gap-6 items-center justify-center h-[calc(100vh-180px)]">
            <Confetti width={2000} height={1000}/>
            <h1 className="text-6xl text-green-700">Muchas gracias por su compra</h1>
            <h2 className="text-xl font-medium">Carga de pedido exitosa</h2>
            <h3 className="">Estas siendo redirigido con un vendedor para finalizar la compra...</h3>
        </div>
    )
}
export default SuccessPage;