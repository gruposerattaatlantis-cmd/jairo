
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { UserProfile, TabView, Habit, VideoContent } from './types';
import DigitalFlower from './components/DigitalFlower';
import LearningZone from './components/LearningZone';

const Icons = {
    Home: () => <span className="material-icons">spa</span>,
    Video: () => <span className="material-icons">filter_vintage</span>,
    Book: () => <span className="material-icons">auto_stories</span>,
    Users: () => <span className="material-icons">diversity_3</span>,
    Heart: ({ filled }: { filled: boolean }) => <span className={`material-icons ${filled ? 'text-petal-400 scale-110' : 'text-zinc-400'}`}>favorite</span>,
    Play: () => <span className="material-icons text-5xl opacity-40">play_arrow</span>,
    Pause: () => <span className="material-icons text-5xl opacity-40">pause</span>,
    VolumeUp: () => <span className="material-icons">volume_up</span>,
    VolumeOff: () => <span className="material-icons">volume_off</span>,
    Check: () => <span className="material-icons">check_circle</span>,
    X: () => <span className="material-icons">close</span>,
    Bolt: () => <span className="material-icons">energy_savings_leaf</span>,
    Yard: () => <span className="material-icons">park</span>,
    Add: () => <span className="material-icons">add_circle_outline</span>,
    AutoGraph: () => <span className="material-icons">insights</span>,
    Water: () => <span className="material-icons">water_drop</span>,
    Share: () => <span className="material-icons">water_drop</span>,
    Travel: () => <span className="material-icons">auto_awesome</span>,
    Error: () => <span className="material-icons text-red-400/50 text-4xl">cloud_off</span>,
    Trophy: () => <span className="material-icons text-amber-400">emoji_events</span>,
    Star: () => <span className="material-icons text-[10px] text-petal-400">star</span>,
    Person: () => <span className="material-icons text-lg opacity-40">person</span>,
    Mail: () => <span className="material-icons text-lg opacity-40">mail</span>,
    Phone: () => <span className="material-icons text-lg opacity-40">phone_iphone</span>,
    Lock: () => <span className="material-icons text-lg opacity-40">lock</span>,
    Admin: () => <span className="material-icons text-xs text-amber-400">verified</span>,
    Photo: () => <span className="material-icons">add_a_photo</span>,
    WhatsApp: () => <span className="material-icons">chat</span>,
    Facebook: () => <span className="material-icons">facebook</span>,
    Instagram: () => <span className="material-icons">camera_alt</span>,
    Send: () => <span className="material-icons">send</span>
};

const TEST_USERS = [
    { username: 'jairoboss', password: '123456', name: 'Jairo Boss', isAdmin: true },
    { username: 'diegodesa', password: '123456', name: 'Diego Desa', isAdmin: false }
];

const INITIAL_VIDEOS: (VideoContent & { url: string })[] = [
    { id: 'v1', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', title: 'Paciencia en el Cultivo', author: 'JardínSereno', description: 'Aprender a esperar es la habilidad más valiosa.', likes: 1240, color: '' },
    { id: 'v2', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', title: 'Claridad Mental', author: 'EcoMente', description: 'Tu negocio florece cuando tu mente respira.', likes: 980, color: '' },
    { id: 'v3', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', title: 'Flujo de Caja Orgánico', author: 'JairoPalacios', description: 'Lecciones de finanzas para jardineros digitales.', likes: 2500, color: '' },
];

const COMMUNITY_USERS = [
    { id: 1, name: "Sofía Zen", seeds: 2450, x: 25, y: 30, color: "#588157", motto: "Menos es más", level: "Roble Sabio", isAdmin: false },
    { id: 2, name: "Marco Prisma", seeds: 1820, x: 70, y: 20, color: "#A3B18A", motto: "Geometría del éxito", level: "Tallo Fuerte", isAdmin: false },
    { id: 3, name: "Elena Oasis", seeds: 1540, x: 50, y: 55, color: "#93A67E", motto: "Paz en el caos digital", level: "Brote Dorado", isAdmin: false },
    { id: 4, name: "Julián Bio", seeds: 1200, x: 80, y: 75, color: "#344E41", motto: "Sistemas vivos", level: "Semilla Activa", isAdmin: false },
    { id: 5, name: "Nora Root", seeds: 1150, x: 20, y: 80, color: "#588157", motto: "Raíces profundas", level: "Brote Sabio", isAdmin: false },
];

// --- COMPONENTES AUXILIARES ---

const ShareModal = ({ isOpen, onClose, video, onAction }: any) => {
    if (!isOpen) return null;
    const shareUrl = window.location.href;
    const shareText = `Mira este video de ${video.author} en The Garden Method`;

    const options = [
        { icon: <Icons.Send />, label: 'A otro Jardinero', color: 'bg-petal-500/20', action: () => { onAction('internal'); onClose(); } },
        { icon: <Icons.WhatsApp />, label: 'WhatsApp', color: 'bg-green-500/20', action: () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`) },
        { icon: <Icons.Facebook />, label: 'Facebook', color: 'bg-blue-600/20', action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`) },
        { icon: <Icons.Instagram />, label: 'Instagram', color: 'bg-purple-500/20', action: () => { navigator.clipboard.writeText(shareUrl); onAction('copy'); onClose(); } }
    ];

    return (
        <div className="fixed inset-0 z-[300] flex items-end justify-center px-4 pb-8 animate-fade-in">
            <div className="absolute inset-0 bg-garden-950/80 backdrop-blur-sm" onClick={onClose}></div>
            <div className="glass w-full max-w-sm rounded-[3rem] p-8 border-white/10 relative z-10 shadow-2xl">
                <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-8"></div>
                <h3 className="text-center font-display font-bold text-white text-lg mb-8 italic tracking-tighter">Polinizar el Conocimiento</h3>
                <div className="grid grid-cols-2 gap-4">
                    {options.map((opt, i) => (
                        <button key={i} onClick={opt.action} className="flex flex-col items-center gap-3 p-5 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all active:scale-95 group">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-petal-100 ${opt.color} group-hover:scale-110 transition-transform`}>{opt.icon}</div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-petal-400">{opt.label}</span>
                        </button>
                    ))}
                </div>
                <button onClick={onClose} className="w-full mt-8 py-4 text-zinc-500 font-bold text-[9px] uppercase tracking-[0.3em] hover:text-white transition-colors">Cerrar</button>
            </div>
        </div>
    );
};

const ScreenAuth = ({ authMode, setAuthMode, authData, setAuthData, handleAuth }: any) => (
    <div className="h-full flex flex-col items-center justify-center p-10 relative overflow-hidden animate-fade-in">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(147,166,126,0.1),transparent_70%)] animate-pulse-glow"></div>
        <header className="mb-12 text-center relative z-10">
            <h1 className="text-4xl font-display font-bold text-white italic tracking-tighter leading-none mb-3">THE GARDEN<br/><span className="text-petal-500 font-light opacity-80">METHOD</span></h1>
            <p className="text-petal-400 text-[8px] uppercase tracking-[0.6em] font-bold">Cultiva tu Mente Digital</p>
            <p className="text-white/20 text-[7px] uppercase tracking-[0.5em] font-black mt-4 italic">By Jairo Palacios</p>
        </header>

        <form onSubmit={handleAuth} className="w-full max-w-[320px] glass p-8 rounded-[2.5rem] border border-white/10 relative z-10 space-y-5 shadow-2xl">
            <div className="flex justify-center gap-6 mb-4">
                <button type="button" onClick={() => setAuthMode('login')} className={`text-[9px] uppercase tracking-widest font-black transition-all ${authMode === 'login' ? 'text-petal-400 scale-110' : 'text-zinc-600 opacity-40'}`}>Entrar</button>
                <button type="button" onClick={() => setAuthMode('register')} className={`text-[9px] uppercase tracking-widest font-black transition-all ${authMode === 'register' ? 'text-petal-400 scale-110' : 'text-zinc-600 opacity-40'}`}>Registrarse</button>
            </div>

            {authMode === 'register' && (
                <>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2"><Icons.Person /></div>
                        <input type="text" placeholder="Nombre y Apellido" value={authData.fullName} onChange={(e) => setAuthData({...authData, fullName: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-xs text-white focus:outline-none focus:border-petal-500/40 transition-all" required />
                    </div>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2"><Icons.Mail /></div>
                        <input type="email" placeholder="Correo electrónico" value={authData.email} onChange={(e) => setAuthData({...authData, email: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-xs text-white focus:outline-none focus:border-petal-500/40 transition-all" required />
                    </div>
                </>
            )}

            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2"><Icons.Person /></div>
                <input type="text" placeholder="Usuario" value={authData.username} onChange={(e) => setAuthData({...authData, username: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-xs text-white focus:outline-none focus:border-petal-500/40 transition-all" required />
            </div>

            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2"><Icons.Lock /></div>
                <input type="password" placeholder="Contraseña" value={authData.password} onChange={(e) => setAuthData({...authData, password: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-xs text-white focus:outline-none focus:border-petal-500/40 transition-all" required />
            </div>

            <button type="submit" className="w-full py-4 bg-petal-500 text-garden-900 rounded-2xl font-display font-black text-[10px] uppercase tracking-[0.3em] hover:bg-petal-400 active:scale-95 transition-all mt-4">{authMode === 'login' ? 'Iniciar Sesión' : 'Plantar Semilla'}</button>
        </form>
    </div>
);

const ScreenGarden = ({ user, awardSeeds, handleColorSelect }: any) => (
    <div className="h-full bg-transparent relative flex flex-col overflow-hidden">
        <header className="absolute top-10 left-0 right-0 z-50 px-8 flex justify-between items-center animate-fade-in">
            <div className="glass px-5 py-2 rounded-full border border-white/10 shadow-2xl flex items-center gap-3">
                <span className="text-petal-400 font-display font-black text-[8px] uppercase tracking-[0.3em]">Semillas</span>
                <span className="text-white font-display font-bold text-lg leading-none">{user.seeds}</span>
            </div>
            <div className="flex gap-2">
                {user.isAdmin && <div className="w-10 h-10 rounded-full glass border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.2)] animate-pulse"><Icons.Admin /></div>}
                <div className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-petal-400/60"><Icons.AutoGraph /></div>
            </div>
        </header>
        <div className="flex-1 flex items-center justify-center -mt-16 relative">
            {user.isAdmin && <div className="absolute top-1/4 left-1/2 -translate-x-1/2 text-[7px] font-black text-amber-500/40 uppercase tracking-[0.8em]">Master Gardener Access</div>}
            <DigitalFlower seeds={user.seeds} currentColorId={user.flowerColor} onColorSelect={handleColorSelect} />
        </div>
        <footer className="relative z-50 px-8 pb-10 flex flex-col items-center gap-4">
            {user.isAdmin && <button onClick={() => awardSeeds(150, "Carga de Datos")} className="glass w-full max-w-[280px] py-4 rounded-full border border-amber-500/20 text-amber-100 font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_0_20px_rgba(251,191,36,0.1)]"><Icons.Photo /> Subir Exp (Admin)</button>}
            <button onClick={() => awardSeeds(25, "Cultivo Consciente")} className="glass w-full max-w-[280px] py-4 rounded-full border border-petal-500/20 text-petal-100 font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all"><Icons.Bolt /> Respirar y Cultivar</button>
        </footer>
    </div>
);

const ScreenVideos = ({ videos, globalMuted, setGlobalMuted, likedVideos, setLikedVideos, awardSeeds }: any) => {
    const videoRefs = useRef<{[key: string]: HTMLVideoElement | null}>({});
    const [uiVisible, setUiVisible] = useState<{[key: string]: boolean}>(Object.fromEntries(videos.map((v: any) => [v.id, true])));
    const [progress, setProgress] = useState<{[key: string]: number}>(Object.fromEntries(videos.map((v: any) => [v.id, 0])));
    const [videoTime, setVideoTime] = useState<{[key: string]: {current: number, total: number}}>(Object.fromEntries(videos.map((v: any) => [v.id, {current: 0, total: 0}])));
    const [shareVideo, setShareVideo] = useState<any>(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target as HTMLVideoElement;
                const id = video.getAttribute('data-video-id') || '';
                if (entry.isIntersecting) {
                    video.play().catch(() => {});
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.6 });
        
        (Object.values(videoRefs.current) as (HTMLVideoElement | null)[]).forEach(v => {
            if (v) observer.observe(v);
        });
        
        return () => observer.disconnect();
    }, [videos]);

    const formatTime = (seconds: number) => {
        if (isNaN(seconds) || seconds === undefined || seconds === null) return "00:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleTimeUpdate = (id: string, e: React.SyntheticEvent<HTMLVideoElement>) => {
        const video = e.currentTarget;
        if (!video) return;
        
        const duration = video.duration || 0;
        const currentProgress = duration > 0 ? (video.currentTime / duration) * 100 : 0;
        
        setProgress(prev => ({ ...prev, [id]: currentProgress }));
        setVideoTime(prev => ({ ...prev, [id]: { current: video.currentTime, total: duration } }));

        // Desvanecimiento tras 10 segundos
        if (video.currentTime >= 10 && uiVisible[id]) {
            setUiVisible(prev => ({ ...prev, [id]: false }));
        }
    };

    const handleLoadedMetadata = (id: string, e: React.SyntheticEvent<HTMLVideoElement>) => {
        const video = e.currentTarget;
        if (!video) return;
        setVideoTime(prev => ({ 
            ...prev, 
            [id]: { 
                current: video.currentTime || 0, 
                total: video.duration || 0 
            } 
        }));
    };

    const toggleUi = (id: string) => {
        setUiVisible(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleShareAction = (type: string) => {
        if (type === 'internal') awardSeeds(30, "Polinización Interna");
        if (type === 'copy') awardSeeds(10, "Enlace para Redes Copiado");
    };

    return (
        <div className="h-full w-full bg-garden-950 snap-y snap-mandatory overflow-y-scroll no-scrollbar relative">
            <ShareModal isOpen={!!shareVideo} onClose={() => setShareVideo(null)} video={shareVideo} onAction={handleShareAction} />
            
            {videos.map((video: any) => {
                const vt = videoTime[video.id] || { current: 0, total: 0 };
                return (
                    <div key={video.id} className="snap-start w-full h-full relative flex flex-col justify-end p-0 overflow-hidden" onClick={() => toggleUi(video.id)}>
                        <video 
                            ref={el => { videoRefs.current[video.id] = el; }}
                            data-video-id={video.id}
                            src={video.url} 
                            loop playsInline muted={globalMuted}
                            onTimeUpdate={(e) => handleTimeUpdate(video.id, e)}
                            onLoadedMetadata={(e) => handleLoadedMetadata(video.id, e)}
                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                        />
                        
                        <div className={`absolute inset-0 bg-gradient-to-t from-garden-950 via-transparent to-transparent opacity-90 transition-opacity duration-1000 ${uiVisible[video.id] ? 'opacity-100' : 'opacity-0'}`}></div>
                        
                        {/* Contenido principal (Título/Botones) */}
                        <div className={`relative z-30 w-full px-10 pb-32 transition-all duration-1000 transform ${uiVisible[video.id] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <div className="w-4/5">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="font-display font-medium text-sm text-petal-100 opacity-60">@{video.author} {video.author === 'JairoPalacios' && <Icons.Admin />}</span>
                                </div>
                                <h2 className="text-3xl font-display font-bold text-white mb-4 tracking-tight leading-tight">{video.title}</h2>
                                <p className="text-zinc-400 text-sm line-clamp-2 leading-relaxed">{video.description}</p>
                            </div>

                            {/* Botones laterales */}
                            <div className="absolute right-6 bottom-4 flex flex-col gap-6">
                                <button onClick={(e) => { e.stopPropagation(); setGlobalMuted(!globalMuted); }} className="w-12 h-12 glass rounded-full flex items-center justify-center text-petal-400 transition-all hover:scale-110 active:scale-95">{globalMuted ? <Icons.VolumeOff /> : <Icons.VolumeUp />}</button>
                                <button onClick={(e) => { e.stopPropagation(); if (!likedVideos.includes(video.id)) { setLikedVideos([...likedVideos, video.id]); awardSeeds(20, "Semillas por Cultivo"); } }} className="w-12 h-12 glass rounded-full flex flex-col items-center justify-center transition-all hover:scale-110 active:scale-95 group"><Icons.Heart filled={likedVideos.includes(video.id)} /><span className="text-[7px] font-black uppercase tracking-tighter mt-1 text-petal-100 group-active:animate-bounce">+20</span></button>
                                <button onClick={(e) => { e.stopPropagation(); setShareVideo(video); }} className="w-12 h-12 glass rounded-full flex flex-col items-center justify-center text-petal-400 transition-all hover:scale-110 active:scale-95" title="Compartir"><Icons.Share /><span className="text-[7px] font-black uppercase tracking-tighter mt-1 opacity-60">Gota</span></button>
                            </div>
                        </div>

                        {/* Barra de Progreso y Tiempo (EN LA PARTE INFERIOR EXTREMA) */}
                        <div className={`absolute bottom-4 left-0 w-full px-10 z-50 transition-all duration-1000 transform ${uiVisible[video.id] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                            <div className="flex justify-between items-center mb-2 px-1">
                                <span className="text-[9px] font-black text-white/40 tracking-widest">{formatTime(vt.current)}</span>
                                <span className="text-[9px] font-black text-white/40 tracking-widest">{formatTime(vt.total)}</span>
                            </div>
                            <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-petal-500 transition-all duration-300 shadow-[0_0_8px_rgba(147,166,126,0.5)]" style={{ width: `${progress[video.id] || 0}%` }}></div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const ScreenCommunity = ({ user, handleVisitGarden, isTraveling, visitingGarden, setVisitingGarden }: any) => {
    const rankingData = useMemo(() => {
        const allUsers = [...COMMUNITY_USERS, { id: 99, name: user.name, seeds: user.seeds, motto: user.isAdmin ? "Maestro del Jardín" : "Creciendo en Silencio", level: user.isAdmin ? "Raíz Madre" : "Tu Nivel", color: user.isAdmin ? "#f59e0b" : "#93A67E", x: 50, y: 50, isAdmin: user.isAdmin }];
        return [...allUsers].sort((a, b) => b.seeds - a.seeds);
    }, [user]);

    const topFive = useMemo(() => rankingData.slice(0, 5), [rankingData]);

    return (
        <div className="h-full bg-transparent p-0 pb-32 relative overflow-y-auto no-scrollbar">
            <div className="relative w-full h-[45vh] overflow-hidden bg-[radial-gradient(circle_at_50%_50%,rgba(147,166,126,0.05)_0%,transparent_70%)]">
                <div className="absolute top-12 left-10 z-20">
                    <h2 className="text-xs font-black text-petal-400 uppercase tracking-[0.5em] mb-1">Ecosistema</h2>
                    <h1 className="text-3xl font-display font-bold text-white italic tracking-tighter">EL JARDÍN</h1>
                </div>

                <svg className="w-full h-full opacity-60">
                   {topFive.map((u, i) => (
                       <line key={`line-${u.id}`} x1="50%" y1="50%" x2={`${u.x}%`} y2={`${u.y}%`} stroke="white" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.1" />
                   ))}
                </svg>

                {topFive.map((u, index) => (
                    <div key={`node-${u.id}`} onClick={() => handleVisitGarden(u)} className="absolute cursor-pointer group flex flex-col items-center" style={{ left: `${u.x}%`, top: `${u.y}%`, transform: 'translate(-50%, -50%)' }}>
                        <div className={`w-14 h-14 rounded-full glass border border-white/10 flex items-center justify-center transition-all duration-500 group-hover:scale-125 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] ${index === 0 ? 'border-amber-500/40' : ''}`}>
                            <div className={`w-3 h-3 rounded-full animate-pulse`} style={{ backgroundColor: u.color }}></div>
                            {index === 0 && <div className="absolute -top-1 -right-1 text-amber-400 scale-75"><Icons.Admin /></div>}
                        </div>
                        <span className="text-[7px] font-black text-white/40 uppercase tracking-widest mt-2 group-hover:text-petal-400 transition-colors">{u.name.split(' ')[0]}</span>
                    </div>
                ))}
            </div>

            <div className="px-8 space-y-3 -mt-4 relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-[9px] font-black text-petal-500 uppercase tracking-widest">Top Guardianes</span>
                    <span className="text-[9px] font-bold text-zinc-600 uppercase">{rankingData.length} Semillas vivas</span>
                </div>

                {rankingData.map((u, index) => (
                    <div key={u.id} onClick={() => u.id !== 99 && handleVisitGarden(u)} className={`glass p-4 rounded-3xl border flex items-center gap-4 transition-all ${u.id === 99 ? 'border-petal-500/30 bg-petal-500/5 shadow-[0_0_20px_rgba(147,166,126,0.1)]' : 'border-white/5 opacity-80'} ${index < 3 ? 'scale-105 my-2' : ''}`}>
                        <div className={`w-8 h-8 flex justify-center items-center font-bold text-xs ${index === 0 ? 'text-amber-400' : index === 1 ? 'text-zinc-400' : index === 2 ? 'text-orange-300' : 'text-zinc-600'}`}>
                            {index === 0 ? <Icons.Trophy /> : index + 1}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h4 className={`text-sm font-bold ${index < 3 ? 'text-white' : 'text-zinc-300'}`}>{u.name}</h4>
                                {u.isAdmin && <Icons.Admin />}
                            </div>
                            <p className="text-[8px] text-zinc-500 uppercase tracking-widest">{u.level}</p>
                        </div>
                        <div className="text-right">
                            <span className={`text-sm font-bold block ${index < 3 ? 'text-petal-400' : 'text-white'}`}>{u.seeds}</span>
                            <span className="text-[7px] text-zinc-500 uppercase tracking-tighter">Semillas</span>
                        </div>
                    </div>
                ))}
            </div>

            {isTraveling && <div className="fixed inset-0 z-[200] bg-garden-950 flex flex-col items-center justify-center animate-fade-in"><div className="w-12 h-12 border-2 border-petal-500/10 border-t-petal-500 rounded-full animate-spin"></div><h2 className="text-petal-400 font-bold text-[10px] uppercase tracking-[0.5em] mt-8 animate-pulse">Sincronizando Jardines...</h2></div>}
            {visitingGarden && (
                <div className="fixed inset-0 z-[150] bg-garden-950 flex flex-col animate-fade-in">
                    <header className="p-10 flex justify-between items-center"><button onClick={() => setVisitingGarden(null)} className="w-12 h-12 glass rounded-full flex items-center justify-center hover:text-petal-400 transition-colors"><Icons.X /></button><span className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] italic">Vista de Nodo</span></header>
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <DigitalFlower seeds={visitingGarden.seeds} currentColorId="classic" onColorSelect={() => {}} />
                        <h2 className="text-4xl font-display font-bold text-white mt-6 italic tracking-tighter">{visitingGarden.name}</h2>
                        <p className="text-petal-400 text-[10px] mt-2 uppercase tracking-[0.3em] opacity-60">"{visitingGarden.motto}"</p>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const [currentTab, setCurrentTab] = useState<TabView>(TabView.HOME);
    const [authData, setAuthData] = useState({ username: '', password: '', fullName: '', email: '', phone: '' });
    const [user, setUser] = useState<UserProfile>({ name: 'Jardinero', seeds: 0, flourishPercent: 0, streak: 1, lastActive: new Date().toISOString(), currentSkin: 'default', unlockedSkins: ['default'], flowerColor: 'classic', isAdmin: false });
    const [videos] = useState(INITIAL_VIDEOS);
    const [toast, setToast] = useState({ message: '', visible: false, type: 'gain' });
    const [likedVideos, setLikedVideos] = useState<string[]>([]);
    const [visitingGarden, setVisitingGarden] = useState<any>(null);
    const [isTraveling, setIsTraveling] = useState(false);
    const [globalMuted, setGlobalMuted] = useState(true);

    const awardSeeds = (amount: number, reason: string) => {
        setUser(prev => ({ ...prev, seeds: prev.seeds + amount }));
        setToast({ message: `${amount >= 0 ? '+' : ''}${amount}: ${reason}`, visible: true, type: amount >= 0 ? 'gain' : 'loss' });
        setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 2500);
    };

    const handleAuth = (e: React.FormEvent) => {
        e.preventDefault();
        const inputUser = authData.username.trim().toLowerCase();
        const inputPass = authData.password.trim();
        if (authMode === 'login') {
            const foundUser = TEST_USERS.find(u => u.username.toLowerCase() === inputUser && u.password === inputPass);
            if (foundUser) {
                setUser(prev => ({ ...prev, name: foundUser.name, isAdmin: !!foundUser.isAdmin }));
                setIsAuthenticated(true);
                awardSeeds(10, `Bienvenido, ${foundUser.name}`);
            } else {
                setToast({ message: "Usuario o clave incorrectos", visible: true, type: 'loss' });
                setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 2500);
            }
        } else {
            setUser(prev => ({ ...prev, name: authData.fullName || authData.username, isAdmin: false }));
            setIsAuthenticated(true);
            awardSeeds(15, "Semilla Plantada");
        }
    };

    const handleColorSelect = (paletteId: string, cost: number) => {
        if (user.seeds < cost) {
            setToast({ message: "Semillas insuficientes", visible: true, type: 'loss' });
            setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 2500);
            return;
        }
        setUser(prev => ({ ...prev, seeds: prev.seeds - cost, flowerColor: paletteId }));
        awardSeeds(0, "Esencia Evolucionada");
    };

    const handleVisitGarden = (target: any) => {
        setIsTraveling(true);
        setTimeout(() => { setVisitingGarden(target); setIsTraveling(false); }, 1200);
    };

    return (
        <div className="h-screen w-full max-w-md mx-auto bg-garden-900 relative flex flex-col border-x border-white/5 shadow-2xl overflow-hidden font-sans">
            <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-none z-[10] opacity-10">
                <p className="text-[7px] text-white font-black uppercase tracking-[0.6em] whitespace-nowrap italic">
                    The Garden Method By Jairo Palacios
                </p>
            </div>

            <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[200] transition-all duration-700 ${toast.visible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
                <div className={`glass px-8 py-3 rounded-full border shadow-2xl flex items-center gap-3 ${toast.type === 'gain' ? 'border-petal-500/30' : 'border-red-500/20'}`}>
                    <span className={`w-2 h-2 rounded-full ${toast.type === 'gain' ? 'bg-petal-400 animate-pulse' : 'bg-red-400'}`}></span>
                    <span className="text-petal-100 font-display font-bold text-[10px] uppercase tracking-widest">{toast.message}</span>
                </div>
            </div>

            <main className="flex-1 overflow-hidden relative">
                {!isAuthenticated ? (
                    <ScreenAuth authMode={authMode} setAuthMode={setAuthMode} authData={authData} setAuthData={setAuthData} handleAuth={handleAuth} />
                ) : (
                    <>
                        {currentTab === TabView.HOME && <ScreenGarden user={user} awardSeeds={awardSeeds} handleColorSelect={handleColorSelect} />}
                        {currentTab === TabView.VIDEOS && <ScreenVideos videos={videos} globalMuted={globalMuted} setGlobalMuted={setGlobalMuted} likedVideos={likedVideos} setLikedVideos={setLikedVideos} awardSeeds={awardSeeds} />}
                        {currentTab === TabView.COMMUNITY && <ScreenCommunity user={user} handleVisitGarden={handleVisitGarden} isTraveling={isTraveling} visitingGarden={visitingGarden} setVisitingGarden={setVisitingGarden} />}
                        {currentTab === TabView.LEARNING && <LearningZone />}
                    </>
                )}
            </main>

            {isAuthenticated && (
                <nav className="h-28 glass border-t border-white/5 flex justify-around items-center px-8 z-[100] pb-6 shrink-0 relative">
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-5 pointer-events-none">
                        <p className="text-[6px] text-white uppercase tracking-[0.2em] font-medium">Silent Growth • Jairo Palacios</p>
                    </div>

                    {(['home', 'videos', 'learning', 'community'] as const).map((tab) => (
                        <button key={tab} onClick={() => { setCurrentTab(tab as any); setVisitingGarden(null); }} className={`flex flex-col items-center transition-all duration-500 ${currentTab === tab ? 'text-petal-400 scale-110' : 'text-zinc-600 opacity-60'}`}>
                            <span className="text-2xl">{tab === 'home' ? <Icons.Home /> : tab === 'videos' ? <Icons.Video /> : tab === 'learning' ? <Icons.Book /> : <Icons.Users />}</span>
                            <span className="text-[7px] font-black uppercase tracking-[0.3em] mt-2 opacity-40">{tab}</span>
                        </button>
                    ))}
                </nav>
            )}

            <style>{`.animate-fade-in { animation: fadeIn 0.8s ease-out forwards; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
        </div>
    );
}
