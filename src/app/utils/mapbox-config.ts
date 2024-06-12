import mapboxgl from 'mapbox-gl';

export function setMapboxToken(token: string): void {
  (mapboxgl as any).accessToken = token;
}
