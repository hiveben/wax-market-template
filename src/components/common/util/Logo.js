import React from 'react'
import Link from "../util/input/Link";

export default function Logo() {
  return (
    <Link href={'/'}>
        <div className="relative h-20 opacity-100">
            <img className="h-16 my-2.5 mx-12" src="/nfthive-logo.svg" alt="Worldwide Asset Explorer"/>
        </div>
    </Link>
  )
}