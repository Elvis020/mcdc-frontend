'use client'

import Link, { LinkProps } from 'next/link'
import { useNavigation } from './navigation-progress'
import { ReactNode, MouseEvent } from 'react'

interface NavLinkProps extends LinkProps {
  children: ReactNode
  className?: string
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
}

export function NavLink({ href, children, onClick, ...props }: NavLinkProps) {
  const { startNavigation } = useNavigation()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    startNavigation()
    onClick?.(e)
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  )
}
