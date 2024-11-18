import http from '@/utils/http'
import { UserAuthForm } from './components/user-auth-form'

import { useQuery } from '@tanstack/react-query'
import { ImageUrl } from "@/utils/ImageUrl";
export default function SignIn() {
  const { data: headerData = [] } = useQuery({
    queryKey: ['header'],
    queryFn: async () => {
      const res = await http.get('/portfolio/header/1')
      return res?.data?.data
    },
  })

  return (
    <>
      <div className='container relative grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
        <div className='relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex'>
          <div className='absolute inset-0 bg-zinc-900' />
          <div className='relative z-20 flex h-14 items-center text-lg font-medium'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='mr-2 h-6 w-6'
            >
              <path d='M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3' />
            </svg>

            {headerData?.name}
          </div>

          <div className='flex h-full   flex-col '>
            <img
              src={`${ImageUrl}/${headerData?.image}`}

              className='relative m-auto rounded-lg  h-32 w-32  '

              alt=' logo'
            />
            <h2 className='relative mt-8 text-center text-2xl text-white'>
              Welcome to the Admin Console
              <p className='relative mt-4 text-center text-xs text-white'>
                Manage your portfolio and settings with ease. Use the navigation
                menu to access different sections of the admin panel.
              </p>
            </h2>
          </div>
        </div>
        <div className='lg:p-8'>
          <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[350px]'>
            <div className='flex flex-col space-y-2 text-left'>
              <h1 className='text-2xl font-semibold tracking-tight'>Login</h1>
              <p className='text-sm text-muted-foreground'>
                Enter your email and password below <br />
                to log into your account
              </p>
            </div>
            <UserAuthForm />
            <p className='px-8 text-center text-sm text-muted-foreground'>
              By clicking login, you agree to our{' '}
              <a
                href='#'
                className='underline underline-offset-4 hover:text-primary'
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href='#'
                className='underline underline-offset-4 hover:text-primary'
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
