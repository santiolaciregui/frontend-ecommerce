import React from 'react';
import Image from 'next/image';

const Branches: React.FC = () => {
  return (
    <div className="container mx-auto px-4 mt-8 pt-8 border-t-2 border-green-700 border-opacity-40">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Image src="/ico-sucursales.svg" width={40} height={40} alt="Sucursales" className="mb-2" />
          <h2 className="text-2xl font-bold">SUCURSALES</h2>
        </div>
        <div className="md:border-l-2 border-green-700 border-opacity-40 pl-4">
          <h3 className="font-bold">NEUQUÉN</h3>
          <p>
            <strong>
              Láinez 267<br />
              Neuquén Capital<br />
              Neuquén
            </strong>
          </p>
        </div>
        <div className="md:border-l-2 border-green-700 border-opacity-40 pl-4">
          <h3 className="font-bold">CATRIEL</h3>
          <p>
            <strong>
              San Martín 436<br />
              Catriel<br />
              Río Negro
            </strong>
          </p>
        </div>
        <div className="md:border-l-2 border-green-700 border-opacity-40 pl-4">
          <h3 className="font-bold">CORONEL SUÁREZ</h3>
          <p>
            <strong>
              Faustino Sarmiento 275<br />
              Coronel Suarez<br />
              Buenos Aires
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Branches;