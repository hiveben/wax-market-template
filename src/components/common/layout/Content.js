import React from 'react'
import cn from 'classnames'

export default function Content(props) {
  return (
    <div
      className={cn(
        'container mx-auto',
        'pt-6 px-6 pb-12',
        props.className && props.className
      )}
    >
        { props.headline &&
          <h4 className={cn('text-5xl mb-8 w-full')}>
            {props.headline}
          </h4>
        }
        
        {props.children}
    </div>
  )
}