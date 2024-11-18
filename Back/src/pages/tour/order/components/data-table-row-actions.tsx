import { useState } from 'react';
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
import ViewModal from './ViewModal';
import http from '@/utils/http';
import { Link } from 'react-router-dom';

interface ItemDetails {
  id: string;
  title: string;
  description: string;
  image: string;

}

interface DataTableRowActionsProps<TData extends ItemDetails> {
  row: Row<TData>;
}

export function DataTableRowActions<TData extends ItemDetails>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      await http.delete(`/tour/package/${id}`);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Deleted successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['package'] });
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
    const serviceId = row.original.id;
    mutation.mutate(serviceId);
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
        <DropdownMenuContent align="end" className="w-[160px] cursor-pointer">
          <DropdownMenuItem onClick={handleView}>View</DropdownMenuItem>
          <DropdownMenuSeparator />
          <Link to={`/package/update/${row.original.id}`}>
            <DropdownMenuItem>Edit</DropdownMenuItem>
          </Link>

          {/* <DropdownMenuItem
            onClick={() => setDeleteModalOpen(true)}
            className="text-destructive"
          >
            Delete
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteModal
        open={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleDelete}
        itemName={row.original.title}
      />

      <ViewModal
        open={isViewModalOpen}
        onClose={() => setViewModalOpen(false)}
        itemDetails={row.original} // Ensure row.original matches ItemDetails
      />
    </>
  );
}
