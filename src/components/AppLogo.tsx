import Image from 'next/image';
import type React from 'react';

interface AppLogoProps {
  className?: string;
  iconSize?: number;
}

const AppLogo: React.FC<AppLogoProps> = ({ className, iconSize = 28 }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image 
        src="/logo.png" // Asegúrate de tener tu logo en public/logo.png
        alt="MovaZen Logo"
        width={iconSize}
        height={iconSize}
        priority // Si el logo está en el LCP (Largest Contentful Paint)
      />
      <span className="text-xl font-semibold text-foreground">MovaZen</span>
    </div>
  );
};

export default AppLogo;
