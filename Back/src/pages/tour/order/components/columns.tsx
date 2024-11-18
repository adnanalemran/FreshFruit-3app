import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/reused/table/data-table-column-header';

import moment from 'moment';
export type Booking = {
  id: string;
  user: {
    name: string;
  };
  package: {
    title: string;
    description: string;
  };
  amount: number;
  status: string;
  created_at: string;
  booking_date: string;
};

export const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: 'package',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Package Title" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
          {row?.original?.package?.title}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'user.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User Name" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">

          {row?.original?.user?.name}

        </span>
      </div>
    ),
  },
  {
    accessorKey: 'Order-Date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order Date" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
          {moment(row?.original?.created_at).format('DD/MM/YYYY')}
        </span>
      </div>
    ),
  }, {
    accessorKey: 'Booked-Date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Booked Date" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
          {moment(row?.original?.booking_date).format('DD/MM/YYYY')}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'stripe_charge_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="stripe_charge_id" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
          {row.getValue('stripe_charge_id')}
        </span>
      </div>
    ),
  },

  // {
  //   accessorKey: 'option',
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
];
