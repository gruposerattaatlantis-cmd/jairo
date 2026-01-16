
import React, { useState, useEffect } from 'react';
import { Course, Resource } from '../types';

const COURSES: Course[] = [
    {
        id: 'c1',
        category: 'Raíces',
        title: 'Crecimiento Consciente',
        description: 'Enraizando tus valores antes de escalar tus metas.',
        modules: [
            { 
                id: 'm1', 
                title: 'Hábitos Orgánicos', 
                duration: '12 min', 
                progress: 100, 
                isLocked: false, 
                icon: 'spa',
                description: 'Crea una rutina que no necesite vacaciones.',
                resources: [
                    { type: 'pdf', label: 'Guía de Hábitos 1.0', url: '#' },
                    { type: 'link', label: 'Plantilla de Notion', url: 'https://notion.so' }
                ]
            },
            { 
                id: 'm2', 
                title: 'Gestión del Silencio', 
                duration: '15 min', 
                progress: 45, 
                isLocked: false, 
                icon: 'self_improvement',
                resources: [
                    { type: 'pdf', label: 'Manual de Meditación', url: '#' }
                ]
            }
        ]
    },
    {
        id: 'c2',
        category: 'Tallos',
        title: 'Sistemas con IA',
        description: 'Construye tu segundo cerebro usando Gemini y automatización.',
        modules: [
            { 
                id: 'm4', 
                title: 'Prompts de Negocio', 
                duration: '22 min', 
                progress: 0, 
                isLocked: false, 
                icon: 'bolt',
                description: 'Cómo hablarle a la IA para que trabaje por ti.',
                resources: [
                    { type: 'pdf', label: 'Cheat Sheet: Prompts', url: '#' },
                    { type: 'link', label: 'Acceso a Gemini API', url: 'https://aistudio.google.com' }
                ]
            },
            { 
                id: 'm5', 
                title: 'Automatización de Riego', 
                duration: '30 min', 
                progress: 0, 
                isLocked: true, 
                icon: 'settings_suggest' 
            }
        ]
    },
    {
        id: 'c3',
        category: 'Frutos',
        title: 'Marketing de Esencia',
        description: 'Atrae, no persigas. Ventas orgánicas para el 2025.',
        modules: [
            { 
                id: 'm6', 
                title: 'Psicología del Valor', 
                duration: '25 min', 
                progress: 0, 
                isLocked: false, 
                icon: 'token',
                resources: [
                    { type: 'pdf', label: 'Framework de Ventas', url: '#' }
                ]
            }
        ]
    }
];

const LearningZone: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [showNotification, setShowNotification] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowNotification(true), 800);
        return () => clearTimeout(timer);
    }, []);

    const handleResourceClick = (e: React.MouseEvent, url: string) => {
        e.stopPropagation();
        if (url !== '#') {
            window.open(url, '_blank');
        }
    };

    return (
        <div className="h-full w-full bg-transparent overflow-y-scroll no-scrollbar p-10 pt-64 relative">
            
            {/* Notificación: Guía del Silencio */}
            <div className={`fixed top-14 left-6 right-6 z-[100] transition-all duration-1000 transform ${showNotification ? 'translate-y-0 opacity-100' : '-translate-y-24 opacity-0 pointer-events-none'}`}>
                <div className="glass p-5 rounded-[2.2rem] border border-white/10 flex items-center gap-5 shadow-[0_25px_60px_rgba(0,0,0,0.6)] backdrop-blur-3xl">
                    <div className="w-10 h-10 rounded-full bg-petal-500/15 flex items-center justify-center text-petal-400 shrink-0 shadow-inner">
                        <span className="material-icons text-lg">auto_awesome</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-[8px] text-petal-400 uppercase font-bold tracking-[0.4em] mb-1 opacity-80">Guía del Silencio</p>
                        <p className="text-xs text-petal-100/90 font-medium italic leading-tight">"Respira. ¿Qué recurso nutrirá tu mente hoy?"</p>
                    </div>
                    <button 
                        onClick={() => setShowNotification(false)}
                        className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-petal-400 transition-colors"
                    >
                        <span className="material-icons text-sm">close</span>
                    </button>
                </div>
            </div>

            <header className="mb-14 relative z-10">
                <h1 className="text-6xl font-display font-bold text-white italic tracking-tighter leading-none">
                    ZONA DE<br/><span className="text-petal-500 font-light opacity-80">PODA</span>
                </h1>
                <p className="text-petal-400/70 text-[10px] uppercase tracking-[0.5em] font-bold mt-8">Simplifica tu camino al éxito</p>
            </header>

            {/* Selector de Categoría */}
            <div className="flex gap-4 mb-16 overflow-x-auto no-scrollbar py-2">
                {['Todos', 'Raíces', 'Tallos', 'Frutos'].map(cat => (
                    <button 
                        key={cat}
                        onClick={() => setSelectedCategory(cat === 'Todos' ? null : cat)}
                        className={`px-10 py-2.5 rounded-full border text-[9px] uppercase tracking-[0.25em] font-black transition-all duration-700 ${
                            (selectedCategory === cat || (cat === 'Todos' && !selectedCategory)) 
                            ? 'bg-petal-500/20 border-petal-400/40 text-petal-100 shadow-[0_10px_30px_rgba(147,166,126,0.15)] scale-105' 
                            : 'border-white/5 text-zinc-600 hover:border-white/10'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Lista de Cursos */}
            <div className="space-y-20 pb-48">
                {COURSES.filter(c => !selectedCategory || c.category === selectedCategory).map(course => (
                    <div key={course.id} className="animate-fade-in">
                        <div className="flex justify-between items-end mb-8 px-4">
                            <div>
                                <span className="text-petal-500/50 text-[9px] font-black uppercase tracking-[0.5em] mb-3 block">{course.category}</span>
                                <h2 className="text-3xl font-display font-bold text-white tracking-tight leading-none">{course.title}</h2>
                            </div>
                            <span className="text-zinc-700 text-[8px] font-bold tracking-[0.2em] uppercase opacity-60">{course.modules.length} sesiones</span>
                        </div>
                        
                        <div className="space-y-6">
                            {course.modules.map(module => (
                                <div 
                                    key={module.id} 
                                    className={`glass p-7 rounded-[2rem] border transition-all duration-700 relative overflow-hidden group ${
                                        module.isLocked ? 'opacity-20 grayscale pointer-events-none' : 'hover:border-petal-500/30 cursor-pointer'
                                    }`}
                                >
                                    <div 
                                        className="absolute bottom-0 left-0 h-[2px] bg-petal-500/40 transition-all duration-[3000ms]" 
                                        style={{ width: `${module.progress}%` }}
                                    ></div>

                                    <div className="flex items-start gap-8">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-1000 shrink-0 ${
                                            module.progress === 100 ? 'bg-petal-500/30 text-petal-400 shadow-[0_0_20px_rgba(147,166,126,0.2)]' : 'bg-white/5 text-zinc-700 group-hover:text-petal-500/80 shadow-inner'
                                        }`}>
                                            <span className="material-icons text-2xl">{module.isLocked ? 'lock' : module.icon}</span>
                                        </div>
                                        
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="font-bold text-base text-petal-100 tracking-tight">{module.title}</h3>
                                                <span className="text-[10px] text-zinc-600 font-bold tracking-widest uppercase opacity-80">{module.duration}</span>
                                            </div>
                                            
                                            {module.description && (
                                                <p className="text-zinc-500 text-[10px] mb-4 leading-relaxed font-medium">{module.description}</p>
                                            )}

                                            {/* Sección de Recursos */}
                                            {module.resources && module.resources.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/5">
                                                    {module.resources.map((res, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={(e) => handleResourceClick(e, res.url)}
                                                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 hover:bg-petal-500/10 hover:border-petal-500/20 transition-all active:scale-95"
                                                        >
                                                            <span className="material-icons text-[14px] text-petal-400">
                                                                {res.type === 'pdf' ? 'picture_as_pdf' : 'open_in_new'}
                                                            </span>
                                                            <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-petal-100">
                                                                {res.label}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex items-center gap-6 mt-6">
                                                <div className="flex-1 h-[1px] bg-white/5 rounded-full overflow-hidden">
                                                    <div className="h-full bg-petal-500/30 transition-all duration-1000" style={{ width: `${module.progress}%` }}></div>
                                                </div>
                                                <span className="text-[8px] font-black text-zinc-600 tracking-widest uppercase opacity-70">
                                                    {module.progress === 100 ? 'Completado' : module.progress > 0 ? `${module.progress}%` : 'Listo'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LearningZone;
