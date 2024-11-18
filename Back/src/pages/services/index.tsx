import { Layout } from '@/components/custom/layout';
import { Search } from '@/components/search';
import ThemeSwitch from '@/components/theme-switch';
import { UserNav } from '@/components/user-nav';

import { columns } from './components/columns';
 

import { useQuery } from "@tanstack/react-query";
 

import { DataTable } from '@/components/reused/table/data-table';
import AddItems from './AddItems';
import http from '@/utils/http';

export default function Service() {
  

  const { data: services = [], isLoading, isError, error } = useQuery({
    queryKey: ["service"],
    queryFn: async () => {
      const res = await http.get("/portfolio/service");
      return res.data.data;
    },
  });



  return (
    <Layout>
      <Layout.Header sticky className="  shadow-sm">
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
            <h2 className='text-2xl font-bold tracking-tight '>Our Services</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of services we offer!
            </p>
          </div>
          <AddItems />
        </div>

        <div className='rounded-lg   shadow p-6'>
          {isLoading ? (
            <div className="text-center py-10">
              <div className="loader mb-4"></div>
              <p className=" ">Loading services...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-10 text-red-600">
              <p>{error.message}</p>
            </div>
          ) : (
            <DataTable data={services} columns={columns} />
          )}
        </div>
      </Layout.Body>
    </Layout>
  );
}
