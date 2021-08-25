import React from 'react'
import cn from 'classnames'

export default function Button(
  { children, className, disabled, onClick}
) {
  return (
    <button
      className={cn(
        'focus:outline-none focus-visible:ring-1 focus-visible:ring-inset',
        'focus-visible:ring-gray-300',
        { 'cursor-not-allowed': disabled },
        className
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}