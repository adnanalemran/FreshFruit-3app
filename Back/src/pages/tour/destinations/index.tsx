import { Layout } from '@/components/custom/layout';
import { Search } from '@/components/search';
import ThemeSwitch from '@/components/theme-switch';
import { UserNav } from '@/components/user-nav';

import { columns } from './components/columns';


import { useQuery } from "@tanstack/react-query";

import { DataTable } from '@/components/reused/table/data-table';

import http from '@/utils/http';
import { Button } from '@/components/custom/button';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { Link } from 'react-router-dom';

export default function Destinations() {

  const { data: destinations = [], isLoading, isError, error } = useQuery({
    queryKey: ["destinations"],
    queryFn: async () => {
      const res = await http.get("/tour/destinations");
      return res.data.data;
    },
  });

  return (
    <Layout>
      <Layout.Header sticky className=" shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4">
          <Search />
          <div className='ml-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <UserNav />
          </div>
        </div>
      </Layout.Header>

      <Layout.Body className="container mx-auto py-6 px-4">
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              Destinations
            </h1>
            <p className='text-muted-foreground'>
              Manage destinations for tours and packages
            </p>
          </div>

          <Link to="/destinations/create" className='flex items-center gap-2'>

            <Button variant="outline"  >
              <div className='flex gap-2 items-center justify-center'>
                <IoMdAddCircleOutline className='text-lg' /> Create
              </div>
            </Button>
          </Link>
        </div>

        <div className='rounded-lg  shadow p-6'>
          {isLoading ? (
            <div className="text-center py-10">
              <div className="loader mb-4"></div>
              <p className=" ">Loading  ...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-10 text-red-600">
              <p>{error.message}</p>
            </div>
          ) : (
            <DataTable data={destinations} columns={columns} />
          )}
        </div>
      </Layout.Body>
    </Layout>
  );
}
