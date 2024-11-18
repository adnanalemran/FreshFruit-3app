import { useState } from 'react'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { Button } from '@/components/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import DeleteModal from '@/components/reused/table/DeleteModal'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/components/ui/use-toast'
import http from '@/utils/http'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      await http.delete(`/portfolio/shop/${id}`)
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Service deleted successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['shop'] })
      setDeleteModalOpen(false)
    },
    onError: (error) => {
      console.error('Delete failed', error)
      toast({
        title: 'Error',
        description: 'Failed to delete service.',
        variant: 'destructive',
      })
    },
  })

  const handleDelete = () => {
    const serviceId = (row.original as { id: string })?.id
    mutation.mutate(serviceId)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
          >
            <DotsHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[160px]'>
          {/* <Link to={`/shop/${(row.original as { id: string })?.id}`}>
            <DropdownMenuItem>View</DropdownMenuItem>
          </Link>
          <DropdownMenuItem>Edit</DropdownMenuItem> */}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setDeleteModalOpen(true)}
            className='text-destructive'
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteModal
        open={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleDelete}
        itemName={(row.original as { Title: string })?.Title}
      />
    </>
  )
}
