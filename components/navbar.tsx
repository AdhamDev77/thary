import React from 'react'
import MobileSidebar from '../app/(dashboard)/_components/mobileSidebar'
import NavbarRoutes from '@/components/navbarRoutes'

type Props = {}

const Navbar = (props: Props) => {
  return (
<div className="p-4 h-full flex items-center justify-between shadow-md z-50 backdrop-blur-md bg-white/70 dark:bg-black/70">
    <MobileSidebar />
    <NavbarRoutes />
</div>

  )
}

export default Navbar