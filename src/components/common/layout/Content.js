import React from 'react'
import cn from 'classnames'

export default function Content({className, children}) {

  return (
    <div
      className={cn(
        'flex relative',
        className
      )}
    >
        {children}
    </div>
  )
}