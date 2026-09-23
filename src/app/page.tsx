// app/page.tsx
import HomeContent from './HomeContent';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  let carouselImages: string[] = [];
  if (apiUrl) {
    try {
      const response = await fetch(`${apiUrl}/dashboard/carousel`, { next: { revalidate: 60 } });
      if (response.ok) {
        const data = await response.json();
        carouselImages = Array.isArray(data.images) ? data.images : [];
      }
    } catch (error) {
      console.error('Error fetching carousel images:', error);
    }
  }
  return <HomeContent carouselImages={carouselImages} />;
}
