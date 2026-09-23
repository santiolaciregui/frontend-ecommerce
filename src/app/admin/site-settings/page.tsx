'use client';

import { useEffect, useState } from 'react';
import { defaultSiteSettings, SiteSettings } from '@/app/hooks/useSiteSettings';
import ProtectedRoute from '@/app/components/ProtectedRoute';

const fields: { key: keyof SiteSettings; label: string; type: string }[] = [
  { key: 'contactTitle', label: 'Título de contacto', type: 'text' },
  { key: 'contactDescription', label: 'Descripción de contacto', type: 'text' },
  { key: 'instagramUrl', label: 'URL de Instagram', type: 'url' },
  { key: 'googleReviewsUrl', label: 'URL de opiniones en Google', type: 'url' },
];

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/site-settings`)
      .then(response => response.json())
      .then(data => setSettings({ ...defaultSiteSettings, ...data }))
      .catch(() => setMessage('No se pudo cargar la configuración.'));
  }, []);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/site-settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        body: JSON.stringify(settings),
      });
      if (!response.ok) throw new Error();
      setMessage('Cambios guardados.');
    } catch {
      setMessage('No se pudieron guardar los cambios.');
    } finally {
      setSaving(false);
    }
  }

  return <ProtectedRoute><main className="mx-auto max-w-2xl px-6 py-12 text-zinc-800">
    <h1 className="text-3xl font-semibold mb-6">Contenido y enlaces</h1>
    <form onSubmit={save} className="space-y-5">
      {fields.map(field => <label key={field.key} className="block text-sm font-medium">
        {field.label}
        <input type={field.type} value={settings[field.key]} onChange={event => setSettings({ ...settings, [field.key]: event.target.value })} className="mt-2 block w-full rounded-md border border-zinc-300 bg-white p-3" maxLength={500} />
      </label>)}
      <button disabled={saving} className="rounded-md bg-zinc-900 px-5 py-3 text-white disabled:opacity-50">{saving ? 'Guardando...' : 'Guardar cambios'}</button>
      {message && <p role="status">{message}</p>}
    </form>
  </main></ProtectedRoute>;
}
