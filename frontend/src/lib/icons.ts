// src/lib/icons.ts
import {
    Globe,
    Sun,
    Pill,
    Baby,
    Leaf,
    ShieldPlus,
    Stethoscope,
    Smile,
    Eye,
    Sparkles,
    Scissors,
    Heart,
    ShoppingBag,
    Cross,
    MapPin,
    Phone,
    Clock,
    ArrowRight,
    ArrowLeft,
    Menu,
    X,
    CheckCircle,
    XCircle,
    Search,
    type LucideIcon,
} from 'lucide-react'

export const featureIcons: Record<string, LucideIcon> = {
    languages: Globe,
    sun:       Sun,
    meds:      Pill,
    baby:      Baby,
}

// src/lib/icons.ts
export const categoryIcons: Record<string, { icon: LucideIcon; color: string; bg: string }> = {
    medications: { icon: Pill,        color: '#e05252', bg: '#fef2f2' },
    vitamins:    { icon: Leaf,        color: '#16a34a', bg: '#f0fdf4' },
    suncare:     { icon: Sun,         color: '#f59e0b', bg: '#fffbeb' },
    skincare:    { icon: Sparkles,    color: '#a855f7', bg: '#faf5ff' },
    haircare:    { icon: Scissors,    color: '#0e7490', bg: '#ecfeff' },
    baby:        { icon: Baby,        color: '#ec4899', bg: '#fdf2f8' },
    firstaid:    { icon: ShieldPlus,  color: '#dc2626', bg: '#fef2f2' },
    devices:     { icon: Stethoscope, color: '#2563eb', bg: '#eff6ff' },
    dental:      { icon: Smile,       color: '#0891b2', bg: '#ecfeff' },
    eyecare:     { icon: Eye,         color: '#7c3aed', bg: '#f5f3ff' },
    natural:     { icon: Heart,       color: '#16a34a', bg: '#f0fdf4' },
    other:       { icon: ShoppingBag, color: '#6b7280', bg: '#f9fafb' },
}



export {
    Cross,
    MapPin,
    Phone,
    Clock,
    ArrowRight,
    ArrowLeft,
    Menu,
    X,
    CheckCircle,
    XCircle,
    Pill,
    Globe,
    Search,
}