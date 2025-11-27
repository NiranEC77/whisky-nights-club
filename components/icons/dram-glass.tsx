export function DramGlass({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Glencairn glass shape */}
      <path
        d="M8 2 L16 2 L14 8 C14 8 14.5 12 14.5 14 C14.5 16 13.5 18 12 18 C10.5 18 9.5 16 9.5 14 C9.5 12 10 8 10 8 L8 2 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Whisky liquid */}
      <path
        d="M10.2 8.5 C10.2 8.5 10.3 10 10.3 11.5 C10.3 13 10.8 14.5 12 14.5 C13.2 14.5 13.7 13 13.7 11.5 C13.7 10 13.8 8.5 13.8 8.5 Z"
        fill="currentColor"
        opacity="0.4"
      />
      {/* Base/stem */}
      <path
        d="M10.5 18 L10.5 20 L13.5 20 L13.5 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Foot/base */}
      <path
        d="M9 20 L15 20 L15 21.5 L9 21.5 Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

