import { fadeIn } from '../animations/gsapAnimations';
import { useEffect, useRef } from 'react';
import { Zap, Lock } from 'lucide-react';

const SlotCard = ({ slot, onClick }) => {
    const cardRef = useRef(null);

    useEffect(() => {
        fadeIn(cardRef.current);
    }, [slot.status]);

    const getStatusStyles = () => {
        switch (slot.status) {
            case 'available':
                return 'border-secondary/50 bg-secondary/5 hover:bg-secondary/10 hover:border-secondary text-secondary shadow-glow-green cursor-pointer';
            case 'reserved':
                return 'border-yellow-500/50 bg-yellow-500/5 text-yellow-500 cursor-not-allowed';
            case 'occupied':
                return 'border-red-500/50 bg-red-500/5 text-red-500 cursor-not-allowed';
            default:
                return 'border-slate-200 bg-slate-50 text-slate-400';
        }
    };

    return (
        <div
            ref={cardRef}
            onClick={slot.status === 'available' ? onClick : null}
            className={`
                relative h-32 rounded-lg border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 transform
                ${getStatusStyles()}
                ${slot.status === 'available' ? 'hover:-translate-y-1' : 'opacity-80'}
            `}
        >
            {/* Lane marking simulation */}
            <div className="absolute top-0 left-1/2 -ml-0.5 w-1 h-2 bg-current opacity-30"></div>
            <div className="absolute bottom-0 left-1/2 -ml-0.5 w-1 h-2 bg-current opacity-30"></div>

            <span className="text-2xl font-bold tracking-widest font-mono">{slot.slotNumber}</span>
            <span className="text-xs font-bold uppercase tracking-wider mt-1 opacity-80">{slot.status}</span>

            {slot.type === 'ev' && (
                <div className="absolute top-2 right-2 text-blue-400" title="EV Charging">
                    <Zap size={16} fill="currentColor" />
                </div>
            )}

            {slot.status === 'reserved' && (
                <div className="absolute top-2 left-2">
                    <Lock size={14} />
                </div>
            )}
        </div>
    );
};

export default SlotCard;
