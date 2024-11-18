import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from './sidebar'
import useIsCollapsed from '@/hooks/use-is-collapsed'
import useAuth from '@/hooks/useAuth'
import { useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'

export default function AppShell() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [isCollapsed, setIsCollapsed] = useIsCollapsed()

  const { getRole, getToken } = useAuth()

  const role = getRole()
  const token = getToken()

  useEffect(() => {
    if (role !== 1 || !token) {

      navigate('/sign-in')
    }
  }, [role, token, navigate, toast])

  return (
    <div className='relative h-full overflow-hidden bg-background'>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main
        id='content'
        className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${isCollapsed ? 'md:ml-14' : 'md:ml-64'} h-full`}
      >
        <Outlet />
      </main>
    </div>
  )
}
