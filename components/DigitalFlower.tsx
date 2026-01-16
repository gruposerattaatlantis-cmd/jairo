
import React, { useEffect, useState, useRef } from 'react';

interface Palette {
    id: string;
    name: string;
    stops: [string, string, string];
}

const PALETTES: Palette[] = [
    { id: 'classic', name: 'Original', stops: ['#F7F8F7', '#A3B18A', '#588157'] },
    { id: 'golden', name: 'Aura Solar', stops: ['#FFFBEB', '#F5E6CC', '#D4A373'] },
    { id: 'electric', name: 'Niebla Azul', stops: ['#F0F9FF', '#BAE6FD', '#7DD3FC'] },
    { id: 'toxic', name: 'Verde Musgo', stops: ['#F7FEE7', '#D1E8E2', '#93A67E'] },
    { id: 'nebula', name: 'Atardecer', stops: ['#FAF5FF', '#E9D5FF', '#D8B4FE'] },
];

interface Props {
    seeds: number;
    currentColorId?: string;
    onColorSelect: (paletteId: string, cost: number) => void;
}

const DigitalFlower: React.FC<Props> = ({ seeds, currentColorId = 'classic', onColorSelect }) => {
    const [level, setLevel] = useState(0);
    const [selectedPaletteId, setSelectedPaletteId] = useState<string>(currentColorId);
    const [customCost, setCustomCost] = useState<number>(5);

    useEffect(() => {
        const newLevel = seeds >= 1000 ? 5 : seeds >= 500 ? 4 : seeds >= 250 ? 3 : seeds >= 100 ? 2 : seeds >= 50 ? 1 : 0;
        setLevel(newLevel);
    }, [seeds]);

    const activePalette = PALETTES.find(p => p.id === (level === 5 ? selectedPaletteId : currentColorId)) || PALETTES[0];

    const stemHeight = level * 50 + (level > 0 ? 30 : 10);
    const flowerScale = 0.5 + (level * 0.1);
    const flowerOpacity = level >= 3 ? 1 : 0;

    return (
        <div className="w-full h-full relative flex flex-col items-center justify-center pointer-events-none select-none">
            <svg viewBox="0 0 400 650" className="w-full h-full max-h-[70vh] drop-shadow-[0_0_30px_rgba(147,166,126,0.1)]">
                <defs>
                    <filter id="bloom">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <filter id="coreGlow">
                        <feGaussianBlur stdDeviation="12" result="blur" />
                    </filter>
                    
                    <radialGradient id="coreGradient">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="40%" stopColor={activePalette.stops[0]} />
                        <stop offset="100%" stopColor="transparent" />
                    </radialGradient>

                    <linearGradient id="stemGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={activePalette.stops[1]} />
                        <stop offset="100%" stopColor="#1A201C" />
                    </linearGradient>
                </defs>

                <ellipse cx="200" cy="540" rx="100" ry="30" fill="rgba(147, 166, 126, 0.05)" />

                <g transform="translate(200, 530)" opacity={level > 0 ? 0.9 : 0}>
                    <path d="M 0,0 C -40,10 -80,5 -110,40 Q -80,45 -40,15 Z" fill="#E8EDDE" opacity="0.6" />
                    <path d="M 0,0 C 40,10 80,5 110,40 Q 80,45 40,15 Z" fill="#E8EDDE" opacity="0.6" />
                    <path d="M -5,5 C -20,30 -10,60 -30,80 Q -10,65 0,15 Z" fill="#E8EDDE" opacity="0.4" />
                    <path d="M 5,5 C 20,30 10,60 30,80 Q 10,65 0,15 Z" fill="#E8EDDE" opacity="0.4" />
                    
                    <path d="M -10,5 Q -50,25 -95,38" fill="none" stroke="#A3B18A" strokeWidth="1" opacity="0.3" />
                    <path d="M 10,5 Q 50,25 95,38" fill="none" stroke="#A3B18A" strokeWidth="1" opacity="0.3" />
                </g>

                <g opacity={level > 0 ? 0.8 : 0}>
                    <path
                        d={`M 200,535 C 180,${535-stemHeight*0.3} 220,${535-stemHeight*0.6} 200,${535-stemHeight}`}
                        fill="none" stroke="url(#stemGradient)" strokeWidth="5" strokeLinecap="round"
                    />
                    <path
                        d={`M 200,535 C 220,${535-stemHeight*0.3} 180,${535-stemHeight*0.6} 200,${535-stemHeight}`}
                        fill="none" stroke="url(#stemGradient)" strokeWidth="4" strokeLinecap="round" opacity="0.7"
                    />
                </g>

                {Array.from({ length: Math.min(level * 2, 6) }).map((_, i) => {
                    const side = i % 2 === 0 ? 1 : -1;
                    const yPos = 510 - (i * 60);
                    if (yPos < 535 - stemHeight) return null;
                    return (
                        <g key={i} transform={`translate(200, ${yPos}) scale(${side}, 1)`} opacity="0.6">
                            <path d="M 0,0 C 20,-10 40,-5 45,10 C 30,15 10,10 0,0" fill="#93A67E" />
                            <path d="M 0,0 C 20,-10 40,-5 45,10" fill="none" stroke="#E8EDDE" strokeWidth="0.5" opacity="0.5" />
                        </g>
                    );
                })}

                <g transform={`translate(200, ${535 - stemHeight}) scale(${flowerScale})`} style={{ opacity: flowerOpacity, transition: 'all 2s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                    <circle cx="0" cy="0" r="40" fill="url(#coreGradient)" filter="url(#coreGlow)" opacity="0.8" />
                    <circle cx="0" cy="0" r="15" fill="#FFFFFF" filter="url(#bloom)" opacity="0.9" />

                    {[1, 0.8, 0.6].map((s, layerIndex) => (
                        <g key={layerIndex} transform={`scale(${s})`}>
                            {Array.from({ length: 12 }).map((_, i) => (
                                <path
                                    key={i}
                                    d="M 0,0 C 40,-60 20,-120 0,-130 C -20,-120 -40,-60 0,0"
                                    fill="none"
                                    stroke={activePalette.stops[layerIndex]}
                                    strokeWidth="1.5"
                                    transform={`rotate(${i * 30 + (layerIndex * 15)})`}
                                    opacity={0.4 + (layerIndex * 0.2)}
                                />
                            ))}
                        </g>
                    ))}
                    
                    {Array.from({ length: 24 }).map((_, i) => (
                        <line 
                            key={i} 
                            x1="0" y1="0" x2="0" y2="-60" 
                            stroke="#E8EDDE" 
                            strokeWidth="0.5" 
                            transform={`rotate(${i * 15})`} 
                            opacity="0.3" 
                        />
                    ))}
                </g>
            </svg>

            {level === 5 && (
                <div className="absolute bottom-20 w-full flex flex-col items-center pointer-events-auto animate-fade-in px-10 z-[100]">
                    <div className="glass w-full max-w-xs p-5 rounded-[2.5rem] space-y-5 border-white/10">
                        <div className="flex justify-center gap-4">
                            {PALETTES.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => setSelectedPaletteId(p.id)}
                                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                                        selectedPaletteId === p.id ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'border-transparent opacity-40 hover:opacity-100'
                                    }`}
                                    style={{ background: `linear-gradient(135deg, ${p.stops[1]}, ${p.stops[2]})` }}
                                />
                            ))}
                        </div>
                        {selectedPaletteId !== currentColorId && (
                            <button
                                onClick={() => onColorSelect(selectedPaletteId, customCost)}
                                className="w-full bg-white/10 text-white py-3 rounded-full font-display font-bold text-[9px] uppercase tracking-[0.3em] border border-white/20 hover:bg-white/20 transition-all"
                            >
                                Evolucionar Esencia
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DigitalFlower;
