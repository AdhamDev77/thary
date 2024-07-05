import React from 'react'
import Logo from './logo'
import SidebarRoutes from './sidebarRoutes'

type Props = {}

const Sidebar = (props: Props) => {
  return (
    <div className=' h-full border-r flex flex-col overflow-y-auto bg-white dark:bg-gray-900 shadow-md'>
        <div className='p-6'>
            <Logo />
        </div>
        <div className='flex flex-col w-full'>
            <SidebarRoutes />
        </div>
    </div>
  )
}

export default Sidebar