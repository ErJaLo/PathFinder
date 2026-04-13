import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

type LatLng = { lat: number; lng: number } | null;

type Props = {
    value: LatLng;
    onChange: (coords: LatLng) => void;
    height?: number;
};

const DEFAULT_CENTER: [number, number] = [41.39, 2.17];
const DEFAULT_ZOOM = 5;

export function MapPicker({ value, onChange, height = 280 }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    // Init map once
    useEffect(() => {
        if (!containerRef.current) return;

        const center: [number, number] = value ? [value.lat, value.lng] : DEFAULT_CENTER;
        const zoom = value ? 10 : DEFAULT_ZOOM;

        const map = L.map(containerRef.current).setView(center, zoom);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        if (value) {
            markerRef.current = L.marker([value.lat, value.lng], { icon: defaultIcon }).addTo(map);
        }

        map.on('click', (e: L.LeafletMouseEvent) => {
            const coords = { lat: e.latlng.lat, lng: e.latlng.lng };

            if (markerRef.current) {
                markerRef.current.setLatLng(e.latlng);
            } else {
                markerRef.current = L.marker(e.latlng, { icon: defaultIcon }).addTo(map);
            }

            map.flyTo(e.latlng, Math.max(map.getZoom(), 10), { duration: 0.5 });
            onChangeRef.current(coords);
        });

        mapRef.current = map;

        return () => {
            map.remove();
            mapRef.current = null;
            markerRef.current = null;
        };
        // Only run on mount/unmount — value changes handled via the marker ref
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClear = () => {
        if (markerRef.current && mapRef.current) {
            mapRef.current.removeLayer(markerRef.current);
            markerRef.current = null;
        }
        onChange(null);
    };

    return (
        <div className="overflow-hidden rounded-xl border border-pf-border dark:border-pf-border-dark">
            <div ref={containerRef} style={{ height, width: '100%' }} />
            <div className="flex items-center justify-between bg-pf-surface-2 px-3 py-1.5 text-[11px] text-pf-text-3 dark:bg-pf-surface-2dark dark:text-pf-text-3dark">
                {value ? (
                    <span>{value.lat.toFixed(5)}°, {value.lng.toFixed(5)}°</span>
                ) : (
                    <span>Clica al mapa per seleccionar la ubicacio</span>
                )}
                {value && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="text-pf-primary hover:underline dark:text-pf-primary-dark"
                    >
                        Esborrar
                    </button>
                )}
            </div>
        </div>
    );
}
