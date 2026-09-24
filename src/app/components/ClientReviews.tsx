'use client';

import { ExternalLink, MapPin } from 'lucide-react';
import useFetchStores from '../hooks/useFetchStores';
import { googleMapsUrl } from '../utils/googleMaps';

export default function ClientReviews() {
  const { stores, loading, error } = useFetchStores();
  const activeStores = stores.filter(store => store.isActive);

  if (loading) return <p className="text-center text-zinc-500">Cargando sucursales...</p>;
  if (error) return <p className="text-center text-zinc-500">No se pudieron cargar las sucursales.</p>;
  if (!activeStores.length) return <p className="text-center text-zinc-500">No hay sucursales disponibles.</p>;

  return <section aria-label="Opiniones por sucursal" className="grid gap-5 md:grid-cols-2">
    {activeStores.map(store => {
      const url = googleMapsUrl(store.address, store.city, store.state, store.googleMapsUrl);
      return <article key={store.id} className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 text-left shadow-sm">
        <p className="mb-2 text-sm font-medium text-zinc-500">Sucursal</p>
        <h2 className="text-xl font-semibold text-zinc-900">{store.name}</h2>
        <p className="mt-3 flex items-start gap-2 text-zinc-600"><MapPin className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />{store.address}, {store.city}, {store.state}</p>
        <a href={url} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center justify-center gap-2 self-start rounded-lg bg-zinc-900 px-5 py-3 font-medium text-white hover:bg-zinc-700">
          {store.googleMapsUrl ? 'Leer reseñas en Google Maps' : 'Buscar local en Google Maps'}
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </article>;
    })}
  </section>;
}
