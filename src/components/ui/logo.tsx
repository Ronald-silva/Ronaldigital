import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textClassName?: string;
  variant?: 'horizontal' | 'stacked' | 'icon-only';
}

const sizeClasses = {
  sm: 'h-6 w-auto',
  md: 'h-8 w-auto', 
  lg: 'h-10 w-auto',
  xl: 'h-16 w-auto'
};

const textSizeClasses = {
  sm: 'text-sm font-semibold',
  md: 'text-base font-bold',
  lg: 'text-xl font-bold', 
  xl: 'text-2xl font-bold'
};

const spacingClasses = {
  sm: 'space-x-2',
  md: 'space-x-3',
  lg: 'space-x-3',
  xl: 'space-x-4'
};

export const Logo: React.FC<LogoProps> = ({ 
  className, 
  size = 'md', 
  showText = true,
  textClassName,
  variant = 'horizontal'
}) => {
  
  if (variant === 'icon-only' || !showText) {
    return (
      <img 
        src="/logomarca.png" 
        alt="RonalDigital" 
        className={cn("object-contain rounded-lg", sizeClasses[size], className)}
      />
    );
  }

  if (variant === 'stacked') {
    return (
      <div className={cn("flex flex-col items-center space-y-1", className)}>
        <img 
          src="/logomarca.png" 
          alt="RonalDigital" 
          className={cn("object-contain rounded-lg", sizeClasses[size])}
        />
        <span className={cn(
          "text-center leading-tight",
          textSizeClasses[size],
          textClassName
        )} translate="no" data-translate="no">
          <span className="text-foreground">Ronal</span><span className="text-primary">Digital</span>
        </span>
      </div>
    );
  }

  // Horizontal (default)
  return (
    <div className={cn("flex items-center", spacingClasses[size], className)}>
      <img 
        src="/logomarca.png" 
        alt="RonalDigital" 
        className={cn("object-contain flex-shrink-0 rounded-lg", sizeClasses[size])}
      />
      <div className="flex flex-col">
        <span className={cn(
          "leading-tight tracking-tight",
          textSizeClasses[size],
          textClassName
        )} translate="no" data-translate="no">
          <span className="text-foreground">Ronal</span><span className="text-primary">Digital</span>
        </span>
        {size === 'xl' && (
          <span className="text-xs text-muted-foreground font-medium tracking-wide">
            Desenvolvimento Web
          </span>
        )}
      </div>
    </div>
  );
};

export default Logo;