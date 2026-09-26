'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, MapPin } from 'lucide-react';
import useFetchStores from '../hooks/useFetchStores';
import { googleMapsUrl } from '../utils/googleMaps';

interface GoogleReview {
  reviewId: string;
  reviewer?: { displayName?: string; profilePhotoUrl?: string; isAnonymous?: boolean };
  starRating: string;
  comment?: string;
  createTime?: string;
}

interface GoogleReviewsResponse {
  storeId: number;
  fetchedAt: string;
  rating: number | null;
  ratingCount: number;
  reviews: GoogleReview[];
}

const starCount: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

export default function ClientReviews() {
  const { stores, loading: storesLoading, error: storesError } = useFetchStores();
  const activeStores = stores.filter(store => store.isActive);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [data, setData] = useState<GoogleReviewsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedId === null) {
      const first = activeStores.find(store => store.googleBusinessLocation)?.id;
      if (first) setSelectedId(first);
    }
  }, [activeStores, selectedId]);

  useEffect(() => {
    if (selectedId === null) return;
    const controller = new AbortController();
    setData(null);
    setError('');
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stores/${selectedId}/google-reviews`, {
      signal: controller.signal,
      cache: 'no-store'
    })
      .then(async response => {
        if (!response.ok) throw new Error('Reseñas no disponibles');
        setData(await response.json());
      })
      .catch(() => {
        if (!controller.signal.aborted) setError('Todavía no hay reseñas sincronizadas para este local. Podés verlas en Google Maps.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [selectedId]);

  if (storesLoading) return <p className="text-center text-zinc-500">Cargando sucursales...</p>;
  if (storesError) return <p className="text-center text-zinc-500">No se pudieron cargar las sucursales.</p>;
  if (!activeStores.length) return <p className="text-center text-zinc-500">No hay sucursales disponibles.</p>;

  const selectedStore = activeStores.find(store => store.id === selectedId);
  const selectedUrl = selectedStore && googleMapsUrl(selectedStore.address, selectedStore.city, selectedStore.state, selectedStore.googleMapsUrl);

  return <section aria-label="Opiniones por sucursal">
    <div className="grid gap-4 md:grid-cols-2">
      {activeStores.map(store => <article key={store.id} className="rounded-xl border border-zinc-200 bg-white p-5 text-left shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">{store.name}</h2>
        <p className="mt-2 flex items-start gap-2 text-sm text-zinc-600"><MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{store.address}, {store.city}, {store.state}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {store.googleBusinessLocation && store.id && <button type="button" onClick={() => setSelectedId(store.id!)}
            aria-pressed={selectedId === store.id}
            className={`rounded-lg px-4 py-2 font-medium ${selectedId === store.id ? 'bg-zinc-900 text-white' : 'border border-zinc-300 text-zinc-800 hover:bg-zinc-50'}`}>
            Ver opiniones
          </button>}
          <a href={googleMapsUrl(store.address, store.city, store.state, store.googleMapsUrl)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 px-4 py-2 text-zinc-800 hover:bg-zinc-50">
            Google Maps <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </article>)}
    </div>

    {selectedStore && <div className="mt-10" aria-live="polite">
      {loading && <p className="text-center text-zinc-500">Cargando reseñas de {selectedStore.name}...</p>}
      {error && <p className="text-center text-zinc-600">{error} {selectedUrl && <a href={selectedUrl} target="_blank" rel="noopener noreferrer" className="underline">Abrir ficha</a>}</p>}
      {data && <div>
        <div className="mb-6 text-center">
          <span translate="no" className="text-sm font-normal text-[#5e5e5e] whitespace-nowrap">Google Maps</span>
          <h2 className="mt-1 text-2xl font-semibold text-zinc-900">{selectedStore.name}</h2>
          {data.rating !== null && <p className="mt-2 text-lg text-zinc-700"><span className="text-amber-500" aria-hidden="true">★</span> {data.rating.toFixed(1)} · {data.ratingCount} opiniones</p>}
          <p className="mt-1 text-xs text-zinc-500">Actualizado: {new Date(data.fetchedAt).toLocaleString('es-AR')}</p>
          {selectedUrl && <a href={selectedUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm text-blue-700 underline underline-offset-4">Ver todas las opiniones en Google Maps</a>}
        </div>
        {data.reviews.length ? <div className="grid gap-5 md:grid-cols-2">
          {data.reviews.map(review => <article key={review.reviewId} className="rounded-xl border border-zinc-200 bg-white p-6 text-left shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              {!review.reviewer?.isAnonymous && review.reviewer?.profilePhotoUrl && <img src={review.reviewer.profilePhotoUrl} alt="" className="h-10 w-10 rounded-full" referrerPolicy="no-referrer" />}
              <div>
                <span className="font-semibold text-zinc-900">{review.reviewer?.isAnonymous ? 'Cliente anónimo' : review.reviewer?.displayName || 'Cliente de Google'}</span>
                {review.createTime && <p className="text-sm text-zinc-500">{new Date(review.createTime).toLocaleDateString('es-AR')}</p>}
              </div>
            </div>
            <p className="mb-3 text-amber-500" aria-label={`${starCount[review.starRating] || 0} de 5 estrellas`}>{'★'.repeat(starCount[review.starRating] || 0)}</p>
            {review.comment && <p className="whitespace-pre-line text-lg leading-relaxed text-zinc-800">{review.comment}</p>}
          </article>)}
        </div> : <p className="text-center text-zinc-500">Este local todavía no tiene reseñas.</p>}
        <p className="mt-6 text-center text-sm text-zinc-500">Se muestran las diez opiniones más recientemente actualizadas que devuelve Google Business Profile.</p>
      </div>}
    </div>}
  </section>;
}
