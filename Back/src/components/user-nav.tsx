import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'
import http from '@/utils/http'
import { ImageUrl } from '@/utils/ImageUrl'
import { DropdownMenuGroup } from '@radix-ui/react-dropdown-menu'
import { useQuery } from '@tanstack/react-query'
export function UserNav() {
  const navigate = useNavigate()
  const { removeUser, removeToken } = useAuth() || {}

  const { data: getUserInfo } = useQuery({
    queryKey: ['getUserInfo'],
    queryFn: async () => {
      const res = await http.get('/getUserInfo')
      return res.data.user
    },
  })
  console.log('getUserInfo', getUserInfo)

  const handleLogout = async () => {
    try {
      const res = await http.post('/logout')
      if (res.status === 200) {
        removeUser?.()
        removeToken?.()
        http.interceptors.request.use(
          (config) => {
            delete config.headers.Authorization
            return config
          },
          (error) => {
            return Promise.reject(error)
          }
        )
        navigate('/sign-in')
      } else {
        throw new Error(res.data.message || 'An error occurred')
      }
    } catch (error) {
      console.log('An error occurred')
    }
  }
  const ProfileImageUrl = ` ${ImageUrl}${getUserInfo?.image}`

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            {getUserInfo?.image ? (
              <AvatarImage className='object-cover' src={ProfileImageUrl} alt='User Avatar' />
            ) : (
              <AvatarFallback> P</AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>
              {getUserInfo?.name}
            </p>
            <p className='text-xs leading-none text-muted-foreground'>
              {getUserInfo?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link to='/settings'>
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </Link>
          <Link to='/settings'>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <div onClick={handleLogout}>
          <DropdownMenuItem>Log out</DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
