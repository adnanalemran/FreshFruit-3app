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
    accessorKey: 'Title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('Title')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'Image',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Image' />
    ),
    cell: ({ row }) => {
      const imagePath = row.getValue('Image');
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
    accessorKey: 'Description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('Description')}
          </span>
        </div>
      );
    },
  }, {
    accessorKey: 'url',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='url' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('url')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'Status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('Status')}
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
