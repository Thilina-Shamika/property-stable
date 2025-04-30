import Link from 'next/link'
import { HomeIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline'

const activeClass = 'bg-gray-100 text-gray-900'
const inactiveClass = 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'

const Sidebar = () => {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : ''

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <nav className="flex flex-col space-y-1">
          <Link href="/admin/properties" className={`flex items-center space-x-2 ${pathname === '/admin/properties' ? activeClass : inactiveClass}`}>
            <HomeIcon className="h-5 w-5" />
            <span>Properties</span>
          </Link>

          <Link href="/admin/listed-properties" className={`flex items-center space-x-2 ${pathname === '/admin/listed-properties' ? activeClass : inactiveClass}`}>
            <ClipboardDocumentListIcon className="h-5 w-5" />
            <span>Listed Properties</span>
          </Link>
        </nav>
      </div>
    </div>
  )
}

export default Sidebar 