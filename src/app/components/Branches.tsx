'use client';
import { MapPin, Phone } from 'lucide-react';
import useFetchStores from '../hooks/useFetchStores';
import { whatsappUrl } from '../utils/whatsapp';

export default function Branches() {
  const { stores } = useFetchStores();
  return <section className="container mx-auto mt-8 border-t border-zinc-200 px-4 pt-8">
    <h2 className="mb-6 text-2xl font-semibold text-zinc-800">Sucursales</h2>
    <div className="grid gap-6 md:grid-cols-3">
      {stores.filter(store => store.isActive).map(store => <div key={store.id} className="border-l border-zinc-200 pl-4 text-zinc-700">
        <h3 className="font-semibold text-zinc-900">{store.name}</h3>
        <p className="mt-2 flex items-start gap-2"><MapPin className="h-4 w-4 shrink-0" />{store.address}, {store.city}, {store.state}</p>
        {store.phone && <a href={whatsappUrl(store.phone)} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center gap-2 underline underline-offset-4"><Phone className="h-4 w-4" />{store.phone}</a>}
      </div>)}
    </div>
  </section>;
}
