import { Layout } from '@/components/custom/layout';
import { Search } from '@/components/search';
import ThemeSwitch from '@/components/theme-switch';


import { UserNav } from '@/components/user-nav';
import http from '@/utils/http';



import { useQuery } from "@tanstack/react-query";


export default function Identity() {


    const { data: headerData = [] } = useQuery({
        queryKey: ["header"],
        queryFn: async () => {
            const res = await http.get("/portfolio/header/1");
            return res.data.data;
        },
    });

    console.log('headerData', headerData);

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

                <h3 className='flex items-center justify-center m-auto h-80 w-full text-4xl'>
                    Come in soon...
                    This page is under construction for now.
                </h3>





            </Layout.Body>
        </Layout>
    );
}
