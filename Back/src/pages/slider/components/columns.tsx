import { ColumnDef } from '@tanstack/react-table'

import { DataTableColumnHeader } from '@/components/reused/table/data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { ImageUrl } from '@/utils/ImageUrl';


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
    accessorKey: 'image',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Image' />
    ),
    cell: ({ row }) => {
      const imagePath = row.getValue('image');
      const imageUrl = `${ImageUrl}${imagePath}`;
      return (
        <div className='flex space-x-2 items-center'>
          <img
            src={imageUrl}
            alt="Image"
            className='w-16 h-16 object-cover rounded'
          />
        </div>
      );
    },
  },

  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('description')}
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
