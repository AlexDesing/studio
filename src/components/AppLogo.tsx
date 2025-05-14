import { Sparkles } from 'lucide-react';
import type React from 'react';

interface AppLogoProps {
  className?: string;
  iconSize?: number;
}

const AppLogo: React.FC<AppLogoProps> = ({ className, iconSize = 24 }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Sparkles size={iconSize} className="text-primary" />
      <span className="text-xl font-semibold text-foreground">CasaZen</span>
    </div>
  );
};

export default AppLogo;
