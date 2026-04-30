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
    type LucideIcon,
} from 'lucide-react'

export const featureIcons: Record<string, LucideIcon> = {
    languages: Globe,
    sun:       Sun,
    meds:      Pill,
    baby:      Baby,
}

// src/lib/icons.ts
export const categoryIcons: Record<string, { icon: LucideIcon; color: string }> = {
    medications: { icon: Pill,        color: '#e05252' }, // red — medical
    vitamins:    { icon: Leaf,        color: '#16a34a' }, // green — natural
    suncare:     { icon: Sun,         color: '#f59e0b' }, // amber — sun
    skincare:    { icon: Sparkles,    color: '#a855f7' }, // purple — beauty
    haircare:    { icon: Scissors,    color: '#0e7490' }, // teal — grooming
    baby:        { icon: Baby,        color: '#ec4899' }, // pink — baby
    firstaid:    { icon: ShieldPlus,  color: '#dc2626' }, // red — emergency
    devices:     { icon: Stethoscope, color: '#2563eb' }, // blue — medical
    dental:      { icon: Smile,       color: '#0891b2' }, // cyan — dental
    eyecare:     { icon: Eye,         color: '#7c3aed' }, // violet — eye
    natural:     { icon: Heart,       color: '#16a34a' }, // green — natural
    other:       { icon: ShoppingBag, color: '#6b7280' }, // gray — misc
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
}