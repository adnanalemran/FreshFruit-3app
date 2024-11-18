import http from '@/utils/http'
import { useQuery } from '@tanstack/react-query'

// Define the Payment interface
interface Payment {
  id: string // or number, depending on your API
  avatarUrl: string
  initials: string
  user?: {
    name: string
    email: string
  }
  package?: {
    title: string
  }
  amount: number // or string, based on your API response
}

// Skeleton loader component
const SkeletonLoader = () => (
  <div className='flex animate-pulse items-center space-x-4'>
    <div className='h-9 w-9 rounded-full bg-gray-200'></div>
    <div className='flex-1 space-y-2'>
      <div className='h-4 w-3/4 rounded bg-gray-200'></div>
      <div className='h-4 w-1/2 rounded bg-gray-200'></div>
      <div className='h-4 w-1/3 rounded bg-gray-200'></div>
    </div>
    <div className='h-4 w-20 rounded bg-gray-200'></div>
  </div>
)

// Main RecentSales component
export function RecentSales() {
  const {
    data: payments = [],
    isLoading,
    isError,
    error,
  } = useQuery<Payment[]>({
    queryKey: ['payments'],
    queryFn: async () => {
      const res = await http.get('/tour/payments')
      return res.data.data
    },
  })
  const { data: currency_symbol } = useQuery({
    queryKey: ['currency_symbol'],
    queryFn: async () => {
      const res = await http.get('/currency')
      return res?.data?.data?.currency_symbol
    },
  })

  // Loading state
  if (isLoading) {
    return (
      <div className='space-y-8'>
        {Array.from({ length: 5 }).map((_, index) => (
          <SkeletonLoader key={index} />
        ))}
      </div>
    )
  }

  // Error state
  if (isError) {
    return <div>Error: {error.message}</div>
  }

  // Render payments
  return (
    <div className='space-y-8'>
      {payments.slice(0, 5).map((payment) => (
        <div key={payment.id} className='flex items-center'>
          {/* <Avatar className='h-9 w-9'>
            <AvatarImage src={payment.avatarUrl} alt='Avatar' />
            <AvatarFallback>{payment.initials}</AvatarFallback>
          </Avatar> */}
          <div className='ml-4 space-y-1'>
            <p className='text-sm font-medium leading-none'>
              {payment.user?.name}
            </p>
            <p className='text-sm text-muted-foreground'>
              {payment.user?.email}
            </p>
            <p className='text-sm font-bold text-muted-foreground'>
              {payment.package?.title}
            </p>
          </div>
          <div className='ml-auto font-medium'>
            {currency_symbol}
            {payment.amount}
          </div>
        </div>
      ))}
    </div>
  )
}
