
export interface Resource {
    type: 'pdf' | 'link';
    label: string;
    url: string;
}

export interface UserProfile {
    name: string;
    seeds: number;
    flourishPercent: number;
    streak: number;
    lastActive: string; // ISO Date
    currentSkin: string;
    unlockedSkins: string[];
    flowerColor?: string;
    isAdmin?: boolean;
}

export interface CourseModule {
    id: string;
    title: string;
    duration: string;
    progress: number;
    isLocked: boolean;
    icon: string;
    description?: string;
    resources?: Resource[];
}

export interface Course {
    id: string;
    category: 'Raíces' | 'Tallos' | 'Frutos';
    title: string;
    description: string;
    modules: CourseModule[];
}

export interface JournalEntry {
    id: string;
    date: string;
    content: string;
    sentiment?: string;
    aiFeedback?: string;
}

export interface BusinessIdea {
    id: string;
    title: string;
    description: string;
    tags: string[];
    validated: boolean;
}

export interface Project {
    id: string;
    author: string;
    title: string;
    description: string;
    likes: number; // "Riego"
}

export interface Habit {
    id: string;
    title: string;
    completed: boolean;
    type: 'mind' | 'business' | 'wellness';
}

export interface VideoContent {
    id: string;
    title: string;
    author: string;
    description: string;
    likes: number;
    color: string; // Placeholder for video bg
}

export enum TabView {
    HOME = 'home',       
    VIDEOS = 'videos',   
    LEARNING = 'learning', 
    COMMUNITY = 'community' 
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}
