import React from 'react'
import Link from "../common/util/input/Link";
import cn from 'classnames'

export default function NavigationItem(
  { href, className, navName}
) {
  return (
    <div className={cn(
        'relative flex leading-10 h-10 my-auto mx-1',
        'cursor-pointer lg:mx-5',
        className
    )}>
        <Link  href={href} className="cursor-pointer">
            <div className="w-full text-blue-700 text-xxs lg:text-xs">{navName}</div>
        </Link>
    </div>
  )
}