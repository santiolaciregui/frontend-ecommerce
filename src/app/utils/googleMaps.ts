export function googleMapsUrl(address: string, city: string, state: string) {
  const query = [address, city, state, 'Argentina'].filter(Boolean).join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
