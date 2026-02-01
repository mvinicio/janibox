import { useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker, useMapEvents, useMap, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';

// Fix for default marker icon in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export interface TargetedLocation {
    id: string;
    lat: number;
    lng: number;
    radius: number; // km
    name?: string;
}

interface LocationMapProps {
    locations: TargetedLocation[];
    activeLocationId: string | null;
    onAddLocation: (loc: TargetedLocation) => void;
    onUpdateLocation: (id: string, updates: Partial<TargetedLocation>) => void;
    onSelectLocation: (id: string) => void;
    onRemoveLocation: (id: string) => void;
}

// Component to handle map clicks -> Add new location
const MapClickHandler = ({ onAdd }: { onAdd: (lat: number, lng: number) => void }) => {
    useMapEvents({
        click(e) {
            onAdd(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
};

// Component to add Search Control
const SearchControl = ({ onAdd }: { onAdd: (lat: number, lng: number, name: string) => void }) => {
    const map = useMap();

    useEffect(() => {
        const provider = new OpenStreetMapProvider();

        // @ts-ignore
        const searchControl = new GeoSearchControl({
            provider: provider,
            style: 'bar',
            showMarker: false,
            showPopup: false,
            autoClose: true,
            retainZoomLevel: false,
            animateZoom: true,
            keepResult: false,
            searchLabel: 'Buscar zona para agregar...',
        });

        // @ts-ignore
        map.addControl(searchControl);

        // Listen for result selection -> Add new pin there
        map.on('geosearch/showlocation', (result: any) => {
            if (result.location) {
                onAdd(result.location.y, result.location.x, result.label);
                map.setView([result.location.y, result.location.x], 13);
            }
        });

        return () => {
            // @ts-ignore
            map.removeControl(searchControl);
        };
    }, [map, onAdd]);

    return null;
};

const LocationMap = ({
    locations,
    activeLocationId,
    onAddLocation,
    onUpdateLocation,
    onSelectLocation,
    onRemoveLocation
}: LocationMapProps) => {

    // Default center (Guayaquil) for initialization
    const defaultCenter: [number, number] = [-2.1894, -79.8891];

    const handleAdd = (lat: number, lng: number, name: string = 'Nueva Zona') => {
        const newLoc: TargetedLocation = {
            id: crypto.randomUUID(),
            lat,
            lng,
            radius: 3, // Default 3km
            name
        };
        onAddLocation(newLoc);
    };

    return (
        <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-inner border border-gray-200 z-0 relative">
            <MapContainer
                center={defaultCenter}
                zoom={12}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <SearchControl onAdd={handleAdd} />
                <MapClickHandler onAdd={handleAdd} />

                {locations.map(loc => {
                    const isActive = loc.id === activeLocationId;
                    return (
                        <div key={loc.id}>
                            <Marker
                                position={[loc.lat, loc.lng]}
                                draggable={true}
                                eventHandlers={{
                                    click: (e) => {
                                        L.DomEvent.stopPropagation(e);
                                        onSelectLocation(loc.id);
                                    },
                                    dragend: (e) => {
                                        const marker = e.target;
                                        const position = marker.getLatLng();
                                        onUpdateLocation(loc.id, { lat: position.lat, lng: position.lng });
                                        onSelectLocation(loc.id);
                                    }
                                }}
                                opacity={isActive ? 1 : 0.6}
                            >
                                <Popup>
                                    <div className="text-center">
                                        <p className="font-bold text-xs mb-1">{loc.name || 'Zona sin nombre'}</p>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onRemoveLocation(loc.id);
                                            }}
                                            className="text-white bg-red-500 hover:bg-red-600 px-2 py-0.5 rounded text-[10px]"
                                            type="button"
                                        >
                                            Eliminar Pin
                                        </button>
                                    </div>
                                </Popup>
                            </Marker>
                            <Circle
                                center={[loc.lat, loc.lng]}
                                radius={loc.radius * 1000}
                                pathOptions={{
                                    color: isActive ? '#ec4899' : '#9ca3af', // Pink if active, Gray if not
                                    fillColor: isActive ? '#ec4899' : '#9ca3af',
                                    fillOpacity: isActive ? 0.2 : 0.1
                                }}
                            />
                        </div>
                    );
                })}

                {/* Coordinate Badge - Bottom Left */}
                {activeLocationId && (() => {
                    const active = locations.find(l => l.id === activeLocationId);
                    if (!active) return null;
                    return (
                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black shadow-md z-[400] border border-gray-100 flex items-center gap-2">
                            Zona Activa: {active.name?.split(',')[0]} ({active.radius}km)
                        </div>
                    );
                })()}

            </MapContainer>
        </div>
    );
};

export default LocationMap;
