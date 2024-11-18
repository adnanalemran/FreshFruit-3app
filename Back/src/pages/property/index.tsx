import { Layout } from '@/components/custom/layout';
import { Search } from '@/components/search';
import ThemeSwitch from '@/components/theme-switch';
import { UserNav } from '@/components/user-nav';

import { columns } from './components/columns';

import { useQuery } from "@tanstack/react-query";

 
import AddItems from './AddItems';
import http from '@/utils/http';
import { DataTable } from '../tasks/components/data-table';

export default function property() {


  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: property = [], isLoading, isError, error } = useQuery({
    queryKey: ["property"],
    queryFn: async () => {
      const res = await http.get("/portfolio/property");
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
            <h2 className='text-2xl font-bold tracking-tight '>Why choose Best Thai Deal
            </h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of  items our property  !
            </p>
          </div>
          <AddItems />
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
            <DataTable data={property} columns={columns} />
          )}
        </div>
      </Layout.Body>
    </Layout>
  );
}
