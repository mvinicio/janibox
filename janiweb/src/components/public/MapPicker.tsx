import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Leaflet + React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

interface MapPickerProps {
    address: string;
    onAddressChange?: (address: string) => void;
    readOnly?: boolean;
}

// Helper component to update map view
const ChangeView = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, 15);
    }, [center, map]);
    return null;
};

const MapPicker = ({ address, onAddressChange, readOnly = false }: MapPickerProps) => {
    const [position, setPosition] = useState<[number, number]>([-0.1807, -78.4678]); // Default to Quito
    const [searching, setSearching] = useState(false);
    const searchTimeout = useRef<any>(null);
    const markerRef = useRef<L.Marker>(null);
    const isInternalUpdate = useRef(false);

    useEffect(() => {
        // Skip if the address update came from the map itself
        if (isInternalUpdate.current) {
            isInternalUpdate.current = false;
            return;
        }

        if (readOnly || !address || address.length < 5) return;

        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        searchTimeout.current = setTimeout(async () => {
            setSearching(true);
            try {
                const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(address)}&limit=1`);
                const data = await response.json();

                if (data.features && data.features.length > 0) {
                    const [lng, lat] = data.features[0].geometry.coordinates;
                    setPosition([lat, lng]);
                }
            } catch (error) {
                console.error('Error geocoding address:', error);
            } finally {
                setSearching(false);
            }
        }, 1000);

        return () => {
            if (searchTimeout.current) clearTimeout(searchTimeout.current);
        };
    }, [address]);

    const handleMarkerDragEnd = async () => {
        const marker = markerRef.current;
        if (marker) {
            const newPos = marker.getLatLng();
            const newCoords: [number, number] = [newPos.lat, newPos.lng];
            setPosition(newCoords);

            setSearching(true);
            try {
                const response = await fetch(`https://photon.komoot.io/reverse?lon=${newPos.lng}&lat=${newPos.lat}`);
                const data = await response.json();

                if (data.features && data.features.length > 0) {
                    const props = data.features[0].properties;
                    const parts = [
                        props.name || props.street,
                        props.housenumber,
                        props.city
                    ].filter(Boolean);

                    const formattedAddress = parts.join(', ');
                    if (formattedAddress && onAddressChange) {
                        isInternalUpdate.current = true;
                        onAddressChange(formattedAddress);
                    }
                }
            } catch (error) {
                console.error('Error reverse geocoding:', error);
            } finally {
                setSearching(false);
            }
        }
    };

    return (
        <div className="relative w-full h-64 rounded-[32px] overflow-hidden border-4 border-white shadow-xl bg-gray-100 group">
            <MapContainer
                center={position}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%', zIndex: 1 }}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                    position={position}
                    draggable={!readOnly}
                    eventHandlers={{
                        dragend: handleMarkerDragEnd
                    }}
                    ref={markerRef}
                />
                <ChangeView center={position} />
            </MapContainer>

            {searching && (
                <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] z-[2] flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
            )}

            {!readOnly && (
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-xl px-4 py-2 rounded-2xl z-[2] border border-white/50 shadow-lg pointer-events-none">
                    <p className="text-[9px] font-black uppercase tracking-widest text-primary mb-0.5">Precisión de Entrega</p>
                    <p className="text-[10px] text-gray-500 font-medium truncate italic">Escribe o arrastra el marcador para ubicarte</p>
                </div>
            )}
        </div>
    );
};

export default MapPicker;
