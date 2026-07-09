interface LogoMarkProps {
  size?: number;
  className?: string;
}

export default function LogoMark({ size = 32, className }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      role="img"
    >
      <defs>
        <linearGradient
          id="tm-grad"
          x1="0"
          y1="0"
          x2="40"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#f97316" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="10" fill="url(#tm-grad)" />
      <path
        d="M10 8 H30 Q33 8 33 11 V12 Q33 14.5 30 14.5 H24 V30 Q24 32.5 21.5 32.5 H18.5 Q16 32.5 16 30 V14.5 H10 Q7 14.5 7 12 V11 Q7 8 10 8 Z"
        fill="white"
      />
    </svg>
  );
}
