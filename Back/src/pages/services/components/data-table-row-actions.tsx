import   { useState } from 'react';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { Button } from '@/components/custom/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DeleteModal from '@/components/reused/table/DeleteModal';
 
import { useMutation, useQueryClient } from '@tanstack/react-query';
 
import { useToast } from '@/components/ui/use-toast';
import UpdateItem from './UpdateItem';
 
import http from '@/utils/http';
import ViewModal from './ViewModal';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false); // State for ViewModal
  const { toast } = useToast();
  const queryClient = useQueryClient();
   

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      await http.delete(`/portfolio/service/${id}`);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Service deleted successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['service'] });
      setDeleteModalOpen(false);
    },
    onError: (error) => {
      console.error('Delete failed', error);
      toast({
        title: 'Error',
        description: 'Failed to delete service.',
        variant: 'destructive',
      });
    },
  });

  const handleDelete = () => {
    const serviceId = (row.original as { id: string })?.id;
    mutation.mutate(serviceId);
  };

  const handleUpdate = () => {
    setUpdateModalOpen(true);
  };

  const handleView = () => {
    setViewModalOpen(true); // Open the ViewModal
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={handleView}>View</DropdownMenuItem> {/* Added View Menu Item */}
          <DropdownMenuItem onClick={handleUpdate}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setDeleteModalOpen(true)}
            className="text-destructive"
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
      <UpdateItem
        id={(row.original as { id: string })?.id}
        isOpen={isUpdateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
      />
      <ViewModal
        open={isViewModalOpen}
        onClose={() => setViewModalOpen(false)}
        itemDetails={row.original} // Pass the item details to the ViewModal
      />
    </>
  );
}
