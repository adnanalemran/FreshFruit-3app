import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import http from '@/utils/http'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import { Button } from '@/components/custom/button'

export function Currency() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null)

  // Fetch all currencies
  const { data: currencies, } = useQuery({
    queryKey: ['all-currency'],
    queryFn: async () => {
      const res = await http.get('/all-currency')
      return res.data.data
    },
  })

  const { data: currency } = useQuery({
    queryKey: ['currency'],
    queryFn: async () => {
      const res = await http.get('/currency')
      return res.data.data
    },
  })

  // Handle currency change mutation
  const { mutate: changeCurrency, isPending } = useMutation({
    mutationFn: async (id: string) => http.post(`/change-currency/${id}`),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Currency updated successfully!',
        duration: 3000,
      })
      queryClient.invalidateQueries({ queryKey: ['all-currency'] })
      queryClient.invalidateQueries({ queryKey: ['currency'] })
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'There was an error updating the currency.',
        variant: 'destructive',
        duration: 3000,
      })
    },
  })

  // Handle select change
  const handleCurrencyChange = (value: string) => {
    setSelectedCurrency(value)
  }

 

  return (
    <div className='mb-6 flex  lg:gap-8   flex-col justify-between p-6 lg:flex-row'>
      <div className='w-full lg:w-1/2  '>
        <Label htmlFor='name' className='text-lg font-semibold'>
          Application Currency
        </Label>
        <div className='mt-4'>
          <Select onValueChange={handleCurrencyChange}>
            <SelectTrigger className='w-full  '>
              <SelectValue placeholder='Select a currency' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {currencies?.length ? (
                  currencies.map(
                    (currency: {
                      id: number
                      currency_title: string
                      currency_symbol: string
                    }) => (
                      <SelectItem
                        key={currency.id}
                        value={currency.id.toString()}
                      >
                        {currency.currency_title} ({currency.currency_symbol})
                      </SelectItem>
                    )
                  )
                ) : (
                  <p>No currencies available.</p>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Button
          className={`mt-4 w-full sm:w-auto ${isPending ? 'cursor-not-allowed opacity-50' : ''}`}
          onClick={() => selectedCurrency && changeCurrency(selectedCurrency)}
          disabled={!selectedCurrency || isPending}
        >
          {isPending ? 'Saving...' : 'Save'}
        </Button>
      </div>

      <div className=' w-full lg:w-1/2'>
        <h2 className='text-xl font-bold'>Current Currency</h2>

        <div className='  rounded-lg   p-4  '>
          <div className='mb-2 flex items-center'>
            <span className='mr-2 font-semibold text-gray-700'>
              Currency Code:
            </span>
            <span>{currency?.currency_code}</span>
          </div>
          <div className='mb-2 flex items-center'>
            <span className='mr-2 font-semibold text-gray-700'>
              Country Name:
            </span>
            <span>{currency?.country_name}</span>
          </div>
          <div className='mb-2 flex items-center'>
            <span className='mr-2 font-semibold text-gray-700'>
              Currency Symbol:
            </span>
            <span>{currency?.currency_symbol}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Currency
