import React from 'react';
import Layout from '../components/Layout';
import Header from '../components/Header';
import { NextPage } from 'next';

const TerminosCondiciones: NextPage = () => {
  return (
    <Layout>
      <Header />
      <main className="container mx-auto px-4 py-8 mt-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Términos y Condiciones</h1>
          
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Introducción</h2>
              <p className="text-gray-700">
                Bienvenido a Verde Manzana. Estos términos y condiciones describen las reglas y regulaciones para el uso del sitio web de Verde Manzana.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Garantía de los productos</h2>
              <p className="text-gray-700">
                Todos los productos cuentan con una garantía de 6 meses que cubre defectos de fabricación. No incluye daños provocados por mal uso, accidentes o desgaste normal del producto.
              </p>
              <p className="text-gray-700 mt-2">
                Para hacer uso de la garantía, deberás:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>Contactarnos vía correo electrónico a fabricaverdemanzana@gmail.com y deberás presentar:</li>
                <li>Comprobante de compra o, en su defecto, fecha de la misma.</li>
                <li>Detallar el problema o inconveniente.</li>
                <li>Enviar material infográfico que incluya fotos y videos.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Propiedad Intelectual</h2>
              <p className="text-gray-700">
                Todo el contenido del sitio web (imágenes, textos, logotipos, diseño, etc.) es propiedad de Fábrica VM o de sus proveedores y está protegido por las leyes de propiedad intelectual. Está prohibida su reproducción, distribución o uso sin autorización previa.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Limitación de Responsabilidad</h2>
              <p className="text-gray-700">
                Fábrica VM no se hace responsable por:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>Daños o pérdidas ocasionadas por el uso indebido de los productos.</li>
                <li>Errores en los datos proporcionados por el usuario al momento de la compra.</li>
                <li>Demoras imputables a terceros (empresas de logística).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Envíos y Entregas</h2>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>Realizamos envíos a todo el territorio argentino.</li>
                <li>Los plazos estimados de entrega son informados al momento de realizar una compra.</li>
                <li>Una vez despachado el pedido, recibirás un número de seguimiento para monitorear el estado de tu envío.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Devoluciones</h2>
              <p className="text-gray-700">
                Te recomendamos estar seguro de la compra a realizar debido a que no se realizan cambios o devoluciones de mercaderías, al igual que reembolsos de pagos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Aceptación de los términos</h2>
              <p className="text-gray-700">
                Al acceder a este sitio web, asumimos que aceptas estos términos y condiciones en su totalidad. No continúes usando el sitio web de Verde Manzana si no aceptas todos los términos y condiciones establecidos en esta página.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Modificaciones</h2>
              <p className="text-gray-700">
                Verde Manzana puede revisar estos términos de servicio del sitio web en cualquier momento sin previo aviso. Al usar este sitio web, aceptas estar sujeto a la versión actual de estos términos y condiciones.
              </p>
            </section>
          </div>

          <div className="mt-8 text-center text-gray-600 italic">
            <p>Si tenés alguna consulta sobre estos términos, no dudes en contactarnos. ¡Gracias por elegir Fábrica VM!</p>
            <p className="mt-2">Última actualización: {new Date().toLocaleDateString('es-AR', {day: '2-digit', month: '2-digit', year: 'numeric'})}</p>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default TerminosCondiciones;