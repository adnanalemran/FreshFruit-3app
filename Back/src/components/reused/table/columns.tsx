import { ColumnDef } from '@tanstack/react-table'



import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'



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
