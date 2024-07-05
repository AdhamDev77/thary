import { Menu } from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import Sidebar from './sidebar'
  


type Props = {}



const MobileSidebar = (props: Props) => {
  return (
    
    <Sheet>
  <SheetTrigger className=' md:hidden pl-4 hover:opacity-75 transition'><Menu /></SheetTrigger>
    <SheetContent side="right" className='p-0 bg-white dark:bg-black'>
        <Sidebar />
    </SheetContent>
</Sheet>

  )
}

export default MobileSidebar