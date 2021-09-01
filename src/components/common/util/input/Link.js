import React from 'react'
import NextLink from 'next/link'
import cn from 'classnames'

export default function Link(
  { children, className, href, external }
) {
  const linkClassNames = cn(
    'block',
    'focus-visible:ring-1 focus-visible:ring-inset',
    'focus-visible:ring-gray-300',
    className
  )
  if (external)
    return (
      <a
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        className={linkClassNames}
      >
        {children}
      </a>
    )
  return (
    <NextLink href={href} passHref>
      <a className={linkClassNames}>
        {children}
      </a>
    </NextLink>
  )
}