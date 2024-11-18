import { ColumnDef } from '@tanstack/react-table'


import { DataTableColumnHeader } from '@/components/reused/table/data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

export type Service = {
  id: number;
  Title: string;
  Description: string;
  Status: string;
};

export const columns: ColumnDef<Service>[] = [
   
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('title')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'discount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Discount' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('discount')}% off
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('status')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'Option',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
