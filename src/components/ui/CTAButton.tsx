import Link from 'next/link';

interface CTAButtonProps {
  text: string;
  onClick?: () => void;
  variant?: 'filled' | 'outlined';
  className?: string;
  isAnchor?: boolean;
  url?: string;
  disabled?: boolean;
}

export default function CTAButton({
  text,
  onClick,
  variant = 'filled',
  className = '',
  isAnchor = false,
  url = '',
  disabled = false,
}: CTAButtonProps) {
  const baseClasses = `
    group relative flex items-center justify-center text-center px-8 py-3 rounded-lg font-semibold
    transition-all duration-300 ease-out
    hover:-translate-y-[1px] active:translate-y-0
    overflow-hidden
  `;

  const getVariantClasses = (
    variant: 'filled' | 'outlined',
    isDisabled: boolean
  ) => {
    const baseVariant = {
      filled: `
        bg-gradient-to-r from-purple-600 to-purple-700
        text-white shadow-lg border border-purple-500/30
        ${!isDisabled ? 'hover:from-purple-500 hover:to-purple-600 hover:shadow-xl hover:shadow-purple-500/30 hover:border-purple-400/50' : ''}
      `,
      outlined: `
        bg-transparent text-purple-300 border-2 border-purple-500/50 shadow-lg shadow-purple-500/10
        ${!isDisabled ? 'hover:bg-purple-600/10 hover:text-white hover:border-purple-400 hover:shadow-purple-500/20' : ''}
      `,
    };
    return baseVariant[variant];
  };

  const content = (
    <>
      <span className="relative z-10 flex items-center justify-center gap-2 text-center">
        {text}
        <span className="flex items-center justify-center text-center transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110">
          →
        </span>
      </span>

      {/* Animated background shine effect */}
      <div className="absolute inset-0 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

      {/* Subtle inner glow for filled variant */}
      {variant === 'filled' && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-400/20 to-purple-600/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      )}
    </>
  );

  if (isAnchor) {
    return (
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses} ${getVariantClasses(variant, disabled)} ${className} inline-block`}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${getVariantClasses(variant, disabled)} ${className} inline-block ${
        disabled ? 'cursor-not-allowed opacity-50' : ''
      }`}
    >
      {content}
    </button>
  );
}
