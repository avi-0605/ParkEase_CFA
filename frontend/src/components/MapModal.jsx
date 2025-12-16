import React from 'react';
import { X } from 'lucide-react';
import MapSearch from './MapSearch';

const MapModal = ({ lot, onClose }) => {
    if (!lot) return null;

    // Normalize lot data if needed (MapSearch expects an array)
    // Ensure location has lat/lng or coordinates
    const mapLot = {
        ...lot,
        location: lot.location || { coordinates: [0, 0] } // Fallback
    };

    // Extract lat/lng for centering
    const lat = mapLot.location.latitude || (mapLot.location.coordinates ? mapLot.location.coordinates[1] : 19.0330);
    const lng = mapLot.location.longitude || (mapLot.location.coordinates ? mapLot.location.coordinates[0] : 73.0297);
    const center = { lat, lng };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h3 className="font-bold text-lg text-slate-800">{lot.name}</h3>
                        <p className="text-sm text-slate-500">{lot.address}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition">
                        <X size={20} />
                    </button>
                </div>
                <div className="h-[400px]">
                    <MapSearch parkingLots={[mapLot]} userLocation={center} />
                </div>
            </div>
        </div>
    );
};

export default MapModal;
