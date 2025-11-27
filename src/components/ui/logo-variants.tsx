import React from 'react';
import { cn } from '@/lib/utils';

interface LogoVariantProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8', 
  lg: 'h-10 w-10',
  xl: 'h-16 w-16'
};

// Opção 1: Cantos suavemente arredondados (RECOMENDADO)
export const LogoRounded: React.FC<LogoVariantProps> = ({ className, size = 'md' }) => (
  <img 
    src="/logomarca.png" 
    alt="RonalDigital" 
    className={cn("object-contain rounded-lg shadow-sm", sizeClasses[size], className)}
  />
);

// Opção 2: Cantos mais arredondados
export const LogoRoundedMore: React.FC<LogoVariantProps> = ({ className, size = 'md' }) => (
  <img 
    src="/logomarca.png" 
    alt="RonalDigital" 
    className={cn("object-contain rounded-xl shadow-sm", sizeClasses[size], className)}
  />
);

// Opção 3: Completamente redonda (para casos específicos)
export const LogoCircle: React.FC<LogoVariantProps> = ({ className, size = 'md' }) => (
  <div className={cn("rounded-full overflow-hidden shadow-sm", sizeClasses[size], className)}>
    <img 
      src="/logomarca.png" 
      alt="RonalDigital" 
      className="object-cover w-full h-full"
    />
  </div>
);

// Opção 4: Com borda e sombra moderna
export const LogoModern: React.FC<LogoVariantProps> = ({ className, size = 'md' }) => (
  <div className={cn(
    "rounded-lg border border-border/50 bg-background/80 backdrop-blur-sm p-1 shadow-sm",
    sizeClasses[size], 
    className
  )}>
    <img 
      src="/logomarca.png" 
      alt="RonalDigital" 
      className="object-contain w-full h-full rounded-md"
    />
  </div>
);

// Opção 5: Estilo tech com gradiente sutil
export const LogoTech: React.FC<LogoVariantProps> = ({ className, size = 'md' }) => (
  <div className={cn(
    "rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 p-1 shadow-sm",
    sizeClasses[size], 
    className
  )}>
    <img 
      src="/logomarca.png" 
      alt="RonalDigital" 
      className="object-contain w-full h-full rounded-md"
    />
  </div>
);