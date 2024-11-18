import { HTMLAttributes, useState } from 'react'
import { useForm } from 'react-hook-form'
import {   useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/custom/button'
import { PasswordInput } from '@/components/custom/password-input'
import { cn } from '@/lib/utils'
import http from '@/utils/http' // Replace with your HTTP service
import useAuth from '@/hooks/useAuth' // Import your auth context or hook if applicable

interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> { }

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, {
      message: 'Please enter your password',
    })
    .min(7, {
      message: 'Password must be at least 7 characters long',
    }),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const { setToken, setUser, storeUser } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)

    try {
      const response = await http.post('/login', data)
      const { token, user } = response.data

      if (token && user) {
        setToken?.(token)
        setUser?.(user)
        storeUser?.(user)
         navigate('/')
      }
     
    } catch (e: Error | unknown) {
      console.error('Login failed')
      const { response } = e as { response: unknown };

      if ((response as { status?: number })?.status === 404) {
        setError('User not found.')
        return
      }

      if ((response as { status?: number })?.status === 401) {
        form.setError('password', {
          type: 'manual',
          message: 'Invalid credentials. Please try again.',
        })
      } else {
        setError('Something went wrong. Please try again later.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='name@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <div className='flex items-center justify-between'>
                    <FormLabel>Password</FormLabel>

                  </div>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' loading={isLoading}>
              Login
            </Button>

            <div className='relative my-2'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' />
              </div>
              
            </div>


          </div>
        </form>
      </Form>
      
       {/* <Link to="/sign-up" className='w-full flex justify-center '>
        <Button className=' w-full'  >
          Sign Up
        </Button>
      </Link> */}
    </div>
  )
}
