import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/reused/table/data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { ImageUrl } from '@/utils/ImageUrl';
import StatusSwitch from './SwitchComponent';

 

export type Service = {
  id: string;
  title: string;
  description: string;
  image: string;

};
export const columns: ColumnDef<Service>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
          {row.getValue('title')}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'main_image',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Image" />
    ),
    cell: ({ row }) => {
      const imagePath = row.getValue('main_image');
      const imageUrl = `${ImageUrl}${imagePath}`;
      return (
        <div className="flex space-x-2 items-center">
          <img
            src={imageUrl}
            alt="Image"
            className="w-16 h-16 object-cover rounded"
          />
        </div>
      );
    },
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
          {row.getValue('description')}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <div className='flex'>
        <StatusSwitch
          id={row.original.id.toString()}
          initialStatus={row.getValue('status') as boolean}
        />
      </div>

    ),
  },
  {
    accessorKey: 'Option',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
