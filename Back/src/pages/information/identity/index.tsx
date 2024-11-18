import { Layout } from '@/components/custom/layout';
import { Search } from '@/components/search';
import ThemeSwitch from '@/components/theme-switch';
import { Label } from '@/components/ui/label';
import { UserNav } from '@/components/user-nav';

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import HeaderDial from './HeaderDial';
import { useQuery } from "@tanstack/react-query";
 
import { ImageUrl } from "@/utils/ImageUrl";
import FooterDial from './FooterDial';
import http from '@/utils/http';

export default function Identity() {
  
    const { data: headerData = [], } = useQuery({
        queryKey: ["header"],
        queryFn: async () => {
            const res = await http.get("/portfolio/header/1");
            return res?.data?.data;
        },
    });

    const { data: footerData = [], } = useQuery({
        queryKey: ["footer"],
        queryFn: async () => {
            const res = await http.get("/portfolio/footer/1");
            return res?.data?.data;
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
                        <h2 className='text-2xl font-bold tracking-tight '> Identity Information
                        </h2>
                        <p className='text-muted-foreground'>
                            Here&apos;s   information about your Identity!
                        </p>
                    </div>
                </div>
                <div className="flex gap-2 flex-col lg:flex-row ">
                    <Card className="lg:w-1/2 w-full mx-auto">
                        <CardHeader>
                            <CardTitle className='flex justify-between'><p className='text-2xl'>Header <h2 className='text-base   text-muted-foreground' > Portfolio site Header section content  </h2>     </p>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <img className='w-32 pb-4' src={headerData?.image ? `${ImageUrl}${headerData?.image}` : "https://i.ibb.co/JRK7qw1/picture-icon-vector-illustration.jpg"} alt="" />

                            <div className="grid w-full items-center gap-4">
                                <div className="flex items-center gap-4  ">
                                    <Label htmlFor="name">Website Title:  </Label>
                                    <p className='text-muted-foreground  '>  {headerData?.name} </p>

                                </div>
                                <div className="flex items-center gap-4  ">
                                    <Label htmlFor="framework">Hotline No: </Label>
                                    <p className='text-muted-foreground  '> {headerData?.hotlineNo} </p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <HeaderDial />
                        </CardFooter>
                    </Card>
                    <Card className="lg:w-1/2 w-full mx-auto">
                        <CardHeader>
                            <CardTitle className='flex justify-between'><p className='text-2xl'>Footer <h2 className='text-base   text-muted-foreground'> Portfolio site Footer content  </h2> </p>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid w-full items-center gap-4">
                                <img className='w-32 pb-4' src={footerData?.image ? `${ImageUrl}${footerData?.image}` : "https://i.ibb.co/JRK7qw1/picture-icon-vector-illustration.jpg"} alt="" />
                                <div className="flex items-center gap-4  ">
                                    <Label htmlFor="name">Footer Title:</Label>
                                    <p className='text-muted-foreground '> {footerData?.title} </p>
                                </div>
                                <div className="flex items-center gap-4  ">
                                    <Label htmlFor="framework">Description: </Label>
                                    <p className='text-muted-foreground  '> {footerData?.description} </p>
                                </div>
                                <div className="flex items-center gap-4  ">
                                    <Label htmlFor="framework">Address: </Label>
                                    <p className='text-muted-foreground '>  {footerData?.address}  </p>
                                </div>
                                <div className="flex items-center gap-4  ">
                                    <Label htmlFor="framework">Social media : </Label>
                                    <p className='text-muted-foreground '>  {footerData?.social} </p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <FooterDial />
                        </CardFooter>
                    </Card>
                </div>
            </Layout.Body>
        </Layout>
    );
}
