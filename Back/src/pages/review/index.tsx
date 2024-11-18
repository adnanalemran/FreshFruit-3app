import { Layout } from '@/components/custom/layout';
import { Search } from '@/components/search';
import ThemeSwitch from '@/components/theme-switch';
import { UserNav } from '@/components/user-nav';

import { columns } from './components/columns';

import { useQuery } from "@tanstack/react-query";
import { DataTable } from '@/components/reused/table/data-table';
import AddItems from './AddItems';
import http from '@/utils/http';

export default function Review() {
  const { data: review = [], isLoading, isError, error } = useQuery({
    queryKey: ["review"],
    queryFn: async () => {
      const res = await http.get("/portfolio/review");
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
            <h2 className='text-2xl font-bold tracking-tight '>Review section
            </h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list  of reviews we have!
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
            <DataTable data={review} columns={columns} />
          )}
        </div>
      </Layout.Body>
    </Layout>
  );
}
