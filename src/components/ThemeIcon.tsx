import React from 'react';
import {
  Cat,
  Apple,
  Utensils,
  Trees,
  Trophy,
  Laptop,
  GraduationCap,
  Compass,
  Palette,
  Heart,
  Home,
  Car,
  Briefcase,
  Globe,
  Sparkles,
} from 'lucide-react';

interface ThemeIconProps {
  iconName: string;
  className?: string;
}

export const ThemeIcon: React.FC<ThemeIconProps> = ({ iconName, className = 'w-5 h-5' }) => {
  switch (iconName) {
    case 'Cat':
      return <Cat className={className} />;
    case 'Apple':
      return <Apple className={className} />;
    case 'Utensils':
      return <Utensils className={className} />;
    case 'Trees':
      return <Trees className={className} />;
    case 'Trophy':
      return <Trophy className={className} />;
    case 'Laptop':
      return <Laptop className={className} />;
    case 'GraduationCap':
      return <GraduationCap className={className} />;
    case 'Compass':
      return <Compass className={className} />;
    case 'Palette':
      return <Palette className={className} />;
    case 'Heart':
      return <Heart className={className} />;
    case 'Home':
      return <Home className={className} />;
    case 'Car':
      return <Car className={className} />;
    case 'Briefcase':
      return <Briefcase className={className} />;
    case 'Globe':
      return <Globe className={className} />;
    case 'Sparkles':
    default:
      return <Sparkles className={className} />;
  }
};
