import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { Navigation } from 'lucide-react';

// ... (keep icon fixes) ...

const RecenterMap = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        if (typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng)) {
            map.flyTo([lat, lng], 14, { duration: 1.5 });
        }
    }, [lat, lng, map]);
    return null;
};

const MapSearch = ({ parkingLots, userLocation }) => {
    const navigate = useNavigate();

    // Default center (Navi Mumbai)
    const defaultCenter = [19.0330, 73.0297];

    // Validate userLocation
    let center = defaultCenter;
    if (userLocation && typeof userLocation.lat === 'number' && typeof userLocation.lng === 'number') {
        center = [userLocation.lat, userLocation.lng];
    } else if (userLocation) {
        // Try parsing
        const lat = parseFloat(userLocation.lat);
        const lng = parseFloat(userLocation.lng);
        if (!isNaN(lat) && !isNaN(lng)) {
            center = [lat, lng];
        }
    }

    return (
        <div className="h-[500px] w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200 z-0 relative">
            <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {userLocation && <RecenterMap lat={userLocation.lat} lng={userLocation.lng} />}


                {/* User Location Marker */}
                {userLocation && (
                    <Marker position={[userLocation.lat, userLocation.lng]} icon={
                        new L.Icon({
                            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            shadowSize: [41, 41]
                        })
                    }>
                        <Popup>
                            <div className="font-bold text-center">You are here</div>
                        </Popup>
                    </Marker>
                )}

                {/* Parking Lot Markers */}
                {parkingLots.map((lot) => {
                    const lat = lot.location?.latitude || (lot.location?.coordinates ? lot.location.coordinates[1] : 0);
                    const lng = lot.location?.longitude || (lot.location?.coordinates ? lot.location.coordinates[0] : 0);
                    if (!lat || !lng) return null;

                    return (
                        <Marker
                            key={lot._id}
                            position={[lat, lng]}
                            icon={
                                new L.Icon({
                                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                                    iconSize: [25, 41],
                                    iconAnchor: [12, 41],
                                    popupAnchor: [1, -34],
                                    shadowSize: [41, 41]
                                })
                            }
                        >
                            <Popup>
                                <div className="min-w-[200px]">
                                    <h3 className="font-bold text-lg mb-1">{lot.name}</h3>
                                    <p className="text-sm text-gray-600 mb-2">{lot.address}</p>
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="font-bold text-primary">₹{lot.pricePerHour}/hr</span>
                                        <span className={`text-xs px-2 py-1 rounded-full ${lot.availableSlots > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {lot.availableSlots} slots left
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/slots/${lot._id}`)}
                                        className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition"
                                    >
                                        View Slots
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    )
                })}
            </MapContainer>
        </div>
    );
};

export default MapSearch;
