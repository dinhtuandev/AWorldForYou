import type { ReactNode } from 'react';

export interface CinematicTextProps {
  children: ReactNode;
  variant?: 'title' | 'body' | 'quote' | 'caption';
  className?: string;
}

export const CinematicText = ({
  children,
  variant = 'body',
  className = '',
}: CinematicTextProps) => {
  const variantStyles = {
    title: 'text-[clamp(1.5rem,5vw,2.75rem)] font-light tracking-wide text-white font-serif drop-shadow-lg',
    quote: 'text-[clamp(1.15rem,3.8vw,2.25rem)] font-light leading-relaxed tracking-wide text-neutral-100 font-serif drop-shadow-md',
    body: 'text-[clamp(0.875rem,2.2vw,1.125rem)] font-light leading-relaxed text-neutral-300',
    caption: 'text-[clamp(0.7rem,1.8vw,0.85rem)] font-light tracking-widest text-neutral-400 uppercase',
  };

  return (
    <div
      className={`max-w-[85vw] mx-auto text-center ${variantStyles[variant]} ${className}`}
    >
      {children}
    </div>
  );
};
