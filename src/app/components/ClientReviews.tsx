'use client';

import { useEffect, useState } from 'react';
import useFetchStores from '../hooks/useFetchStores';

interface GoogleReview {
  name: string;
  text: string;
  rating: number;
  publishedAt: string;
  relativePublishedAt?: string;
  author: { displayName: string; uri?: string; photoUri?: string } | null;
  url: string | null;
}

interface GoogleReviewsResponse {
  storeId: number;
  placeName: string;
  placeAddress: string;
  placeUrl: string;
  rating: number | null;
  ratingCount: number;
  attributions: { provider: string; providerUri?: string }[];
  reviews: GoogleReview[];
}

export default function ClientReviews() {
  const { stores, loading: storesLoading, error: storesError } = useFetchStores();
  const linkedStores = stores.filter(store => store.isActive && store.googlePlaceId);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [data, setData] = useState<GoogleReviewsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (linkedStores.length && !linkedStores.some(store => store.id === selectedId)) {
      setSelectedId(linkedStores[0].id || null);
    }
  }, [linkedStores, selectedId]);

  useEffect(() => {
    if (!selectedId) return;
    const controller = new AbortController();
    setLoading(true);
    setError(false);
    setData(null);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stores/${selectedId}/google-reviews`, {
      signal: controller.signal,
      cache: 'no-store'
    })
      .then(response => {
        if (!response.ok) throw new Error('Google reviews unavailable');
        return response.json();
      })
      .then(setData)
      .catch(fetchError => {
        if (fetchError.name !== 'AbortError') setError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [selectedId]);

  if (storesLoading) return <p className="text-center text-zinc-500">Cargando sucursales...</p>;
  if (storesError) return <p className="text-center text-zinc-500">No se pudieron cargar las sucursales.</p>;
  if (!linkedStores.length) return <p className="text-center text-zinc-500">Las reseñas de Google estarán disponibles próximamente.</p>;

  return <section aria-label="Reseñas por sucursal">
    <div className="flex flex-wrap justify-center gap-2 mb-8" role="group" aria-label="Elegí un local">
      {linkedStores.map(store => <button
        key={store.id}
        type="button"
        aria-pressed={store.id === selectedId}
        onClick={() => setSelectedId(store.id || null)}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${store.id === selectedId ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'}`}
      >{store.name} · {store.city}</button>)}
    </div>

    {loading && <p className="text-center text-zinc-500">Cargando reseñas de Google...</p>}
    {error && <p className="text-center text-zinc-500">No se pudieron cargar las reseñas de este local. Intentá de nuevo más tarde.</p>}
    {data && <div>
      <div className="mb-6 flex flex-col items-center gap-2">
        <span translate="no" className="text-sm font-normal text-[#5e5e5e] whitespace-nowrap">Google Maps</span>
        <p className="text-2xl font-semibold text-zinc-900">{data.placeName}</p>
        {data.placeAddress && <p className="text-sm text-zinc-500">{data.placeAddress}</p>}
        {data.rating !== null && <p className="text-zinc-700" aria-label={`${data.rating} de 5 estrellas, ${data.ratingCount} opiniones`}>
          <span className="text-amber-500" aria-hidden="true">★</span> {data.rating.toFixed(1)} · {data.ratingCount} opiniones
        </p>}
        <a href={data.placeUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-700 underline underline-offset-4">Ver todas las reseñas de este local en Google Maps</a>
      </div>
      {data.reviews.length ? <div className="grid gap-5 md:grid-cols-2">
        {data.reviews.map(review => <article key={review.name} className="rounded-xl border border-zinc-200 bg-white p-6 text-left shadow-sm">
          <div className="mb-3 flex items-center gap-3">
            {review.author?.photoUri && <img src={review.author.photoUri} alt="" className="h-10 w-10 rounded-full" referrerPolicy="no-referrer" />}
            <div>
              {review.author?.uri ? <a href={review.author.uri} target="_blank" rel="noopener noreferrer" className="font-semibold text-zinc-900 hover:underline">{review.author.displayName}</a> : <span className="font-semibold text-zinc-900">{review.author?.displayName || 'Cliente de Google'}</span>}
              {review.relativePublishedAt && <p className="text-sm text-zinc-500">{review.relativePublishedAt}</p>}
            </div>
          </div>
          <p className="mb-3 text-amber-500" aria-label={`${review.rating} de 5 estrellas`}>{'★'.repeat(Math.max(0, Math.min(5, review.rating)))}</p>
          {review.text && <p className="text-lg leading-relaxed text-zinc-800 whitespace-pre-line">{review.text}</p>}
          <a href={review.url!} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm text-blue-700 underline underline-offset-4">Ver reseña en Google Maps</a>
        </article>)}
      </div> : <p className="text-center text-zinc-500">Este local todavía no tiene reseñas disponibles en Google.</p>}
      {data.attributions.map(attribution => <p key={attribution.provider} className="mt-4 text-center text-xs text-zinc-500">{attribution.providerUri ? <a href={attribution.providerUri} target="_blank" rel="noopener noreferrer" className="underline">{attribution.provider}</a> : attribution.provider}</p>)}
      <p className="mt-6 text-center text-sm text-zinc-500">Google Maps muestra hasta cinco reseñas por local, ordenadas por relevancia. No aplicamos otros filtros. Google no verifica todas las opiniones, pero revisa y elimina contenido falso cuando lo detecta.</p>
    </div>}
  </section>;
}
