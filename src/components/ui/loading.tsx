import React from 'react';
import { Logo } from './logo';
import { cn } from '@/lib/utils';

interface LoadingProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({ 
  className, 
  size = 'md',
  text = 'Carregando...'
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center space-y-4",
      className
    )}>
      <div className="animate-pulse">
        <Logo size={size} showText={false} />
      </div>
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
        <span className="text-muted-foreground text-sm">{text}</span>
      </div>
    </div>
  );
};

export default Loading;