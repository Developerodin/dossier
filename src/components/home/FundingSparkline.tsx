import React from 'react'

type FundingSparklineProps = {
  className?: string
  variant?: 'card' | 'stats'
}

export const FundingSparkline: React.FC<FundingSparklineProps> = ({
  className,
  variant = 'card',
}) => {
  if (variant === 'stats') {
    return (
      <svg
        className={className}
        viewBox="0 0 64 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M1 24 C8 22, 12 18, 18 16 C26 13, 30 20, 38 14 C46 8, 52 6, 63 3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1 24 C8 22, 12 18, 18 16 C26 13, 30 20, 38 14 C46 8, 52 6, 63 3 L63 28 L1 28 Z"
          fill="currentColor"
          opacity="0.12"
        />
      </svg>
    )
  }

  return (
    <svg
      className={className}
      viewBox="0 0 200 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <path
        d="M0 68 C28 64, 40 48, 58 42 C82 34, 96 56, 120 40 C148 20, 168 16, 200 8"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M0 68 C28 64, 40 48, 58 42 C82 34, 96 56, 120 40 C148 20, 168 16, 200 8 L200 80 L0 80 Z"
        fill="currentColor"
        opacity="0.1"
      />
    </svg>
  )
}
