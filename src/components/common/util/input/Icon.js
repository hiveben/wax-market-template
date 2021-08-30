import React from 'react'
import cn from 'classnames'

export default function Icon(
  { children, className, onClick}
) {
  return (
    <button
      className={cn(
        'relative h-6.5 cursor-pointer',
        'text-lg text-white text-center no-underline',
        'transition-opacity duration-500',
        'opacity-85 hover:opacity-100',
        className
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}