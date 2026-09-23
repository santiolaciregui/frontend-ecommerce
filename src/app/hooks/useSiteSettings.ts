'use client';
import { useEffect, useState } from 'react';

export interface SiteSettings {
  contactTitle: string;
  contactDescription: string;
  instagramUrl: string;
  googleReviewsUrl: string;
}

export const defaultSiteSettings: SiteSettings = {
  contactTitle: 'Estamos en tu zona',
  contactDescription: 'Buscá tu localidad más cercana y contactate con un asesor comercial',
  instagramUrl: '',
  googleReviewsUrl: '',
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/site-settings`)
      .then(response => {
        if (!response.ok) throw new Error('No se pudo cargar la configuración');
        return response.json();
      })
      .then(data => setSettings({ ...defaultSiteSettings, ...data }))
      .catch(error => console.error(error));
  }, []);
  return settings;
}
