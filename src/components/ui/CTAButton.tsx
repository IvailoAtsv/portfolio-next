interface CTAButtonProps {
  text: string;
  onClick?: () => void;
  variant?: 'filled' | 'outlined';
  className?: string;
}

export default function CTAButton({
  text,
  onClick,
  variant = 'filled',
  className = '',
}: CTAButtonProps) {
  const baseClasses = `
    group relative px-8 py-3 rounded-lg font-semibold
    transition-all duration-300 ease-out
    hover:-translate-y-[1px] active:translate-y-0
    overflow-hidden
  `;

  const variantClasses = {
    filled: `
      bg-gradient-to-r from-purple-600 to-purple-700
      hover:from-purple-500 hover:to-purple-600
      text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/30
      border border-purple-500/30 hover:border-purple-400/50
    `,
    outlined: `
      bg-transparent hover:bg-purple-600/10
      text-purple-300 hover:text-white
      border-2 border-purple-500/50 hover:border-purple-400
      shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20
    `,
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">
        {text}
        <span className="transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110">
          →
        </span>
      </span>

      {/* Animated background shine effect */}
      <div className="absolute inset-0 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

      {/* Subtle inner glow for filled variant */}
      {variant === 'filled' && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-400/20 to-purple-600/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      )}
    </button>
  );
}
