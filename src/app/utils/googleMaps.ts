export function googleMapsUrl(address: string, city: string, state: string, listingUrl?: string) {
  if (listingUrl) {
    try {
      const url = new URL(listingUrl);
      const host = url.hostname.toLowerCase();
      if (url.protocol === 'https:' && !url.username && !url.password && (
        ((host === 'google.com' || host === 'www.google.com' || host === 'maps.google.com') && url.pathname.startsWith('/maps')) ||
        host === 'maps.app.goo.gl' || (host === 'goo.gl' && url.pathname.startsWith('/maps/')) || host === 'g.page'
      )) return url.toString();
    } catch {
      // Use the address search when the saved link is invalid.
    }
  }
  const query = [address, city, state, 'Argentina'].filter(Boolean).join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
