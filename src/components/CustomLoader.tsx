import type React from 'react';

const CustomLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <svg
        width="80" // Aumentado el tamaño para mejor visibilidad
        height="80"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-float mb-4 text-primary" // animation applied here, mb-4 para separar del texto
        data-ai-hint="calm aura serene meditation" // Pista para IA
      >
        {/* Diseño de "aura flotante" simplificado */}
        <circle cx="50" cy="40" r="12" fill="currentColor" opacity="0.8">
            <animate attributeName="cy" values="40;30;40" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0.4;0.8" dur="3s" repeatCount="indefinite" />
        </circle>
        <path d="M25 70 Q50 50 75 70 T25 70" fill="currentColor" opacity="0.5">
           <animate attributeName="d" values="M25 70 Q50 50 75 70 T25 70;M25 70 Q50 60 75 70 T25 70;M25 70 Q50 50 75 70 T25 70" dur="3s" repeatCount="indefinite" />
        </path>
         <path d="M30 80 Q50 60 70 80 T30 80" fill="currentColor" opacity="0.3">
           <animate attributeName="d" values="M30 80 Q50 60 70 80 T30 80;M30 80 Q50 70 70 80 T30 80;M30 80 Q50 60 70 80 T30 80" dur="3s" repeatCount="indefinite" />
        </path>
      </svg>
      <p className="text-2xl font-semibold text-foreground">MovaZen</p>
      <p className="text-sm text-muted-foreground mt-1">Cargando tu espacio de calma...</p>
    </div>
  );
};

export default CustomLoader;
