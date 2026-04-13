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

type Props = {
    lat: number;
    lng: number;
    label?: string;
    height?: number;
};

export function MapDisplay({ lat, lng, label, height = 220 }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const map = L.map(containerRef.current, {
            scrollWheelZoom: false,
        }).setView([lat, lng], 10);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        const marker = L.marker([lat, lng], { icon: defaultIcon }).addTo(map);
        if (label) marker.bindPopup(label);

        mapRef.current = map;

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, [lat, lng, label]);

    return (
        <div className="overflow-hidden rounded-xl border border-pf-border dark:border-pf-border-dark">
            <div ref={containerRef} style={{ height, width: '100%' }} />
        </div>
    );
}
