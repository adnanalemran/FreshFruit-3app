import { Button } from '@/components/custom/button';
import { Layout } from '@/components/custom/layout';
import { Search } from '@/components/search';
import ThemeSwitch from '@/components/theme-switch';
import { Card } from '@/components/ui/card';  // Import Card from your UI components
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { UserNav } from '@/components/user-nav';
import http from '@/utils/http';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

type ContactInfo = {
    whatsapp: string;
    facebook: string;
    phone_no: string;
};

export default function Social() {
    const { toast } = useToast();

    // Fetch the contact data
    const { data: contactData } = useQuery<ContactInfo>({
        queryKey: ['social-info'],
        queryFn: async () => {
            const res = await http.get('/tour/social-info');
            return res.data;
        },
    });

    // Set initial state for form fields
    const [contactInfo, setContactInfo] = useState<ContactInfo>({
        whatsapp: '',
        facebook: '',
        phone_no: '',
    });

    useEffect(() => {
        if (contactData) {
            setContactInfo({
                whatsapp: contactData.whatsapp || '',
                facebook: contactData.facebook || '',
                phone_no: contactData.phone_no || '',
            });
        }
    }, [contactData]);

    // Mutation to update the contact information
    const { mutate: updateContact } = useMutation<void, unknown, ContactInfo>({
        mutationFn: async (updatedContact: ContactInfo) => {
            const res = await http.put('/tour/social-info', updatedContact);
            return res.data;
        },
        onSuccess: () => {
            toast({
                title: 'Success',
                description: 'Item updated successfully!',
                duration: 3000,
            });
        },
    });

    // Handle form submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateContact(contactInfo);
    };

    return (
        <Layout>
            <Layout.Header sticky className="shadow-sm">
                <div className="container mx-auto flex items-center justify-between px-4">
                    <Search />
                    <div className="ml-auto flex items-center space-x-4">
                        <ThemeSwitch />
                        <UserNav />
                    </div>
                </div>
            </Layout.Header>

            <Layout.Body className="container mx-auto py-6 px-4">
                <h2 className="text-2xl font-semibold mb-6 text-center"> Contact Information</h2>
                <h2 className="text-sm mb-4 text-center text-gray-700">
                    Note: This info impacts the Package booking info and link section.
                </h2>

                {/* ShadCN Card Component */}
                <Card className="max-w-3xl mx-auto p-6 space-y-4 shadow-lg rounded-lg">
                    <form onSubmit={handleSubmit}>
                        {/* Whatsapp */}
                        <div className='mt-6'>
                            <Label
                                htmlFor="whatsapp"

                            >
                                Whatsapp <p className="text-xs text-gray-500">    Example Data: https://wa.me/8801712345678</p>
                            </Label>
                            <Input
                                type="text"
                                id="whatsapp"
                                value={contactInfo.whatsapp}
                                onChange={(e) =>
                                    setContactInfo({
                                        ...contactInfo,
                                        whatsapp: e.target.value,
                                    })
                                }
                                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Facebook */}
                        <div className='mt-6'>
                            <Label
                                htmlFor="facebook"

                            >
                                Facebook <p className="text-xs text-gray-500">   Example Data: https://m.me/yourpage</p>
                            </Label>

                            <Input
                                type="text"
                                id="facebook"
                                value={contactInfo.facebook}
                                onChange={(e) =>
                                    setContactInfo({
                                        ...contactInfo,
                                        facebook: e.target.value,
                                    })
                                }
                                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Phone Number */}
                        <div className='mt-6'>
                            <Label
                                htmlFor="phone_no"

                            >
                                Phone Number
                                <p className="text-xs text-gray-500">    Example Data: +8801712345678</p>
                            </Label>
                            <Input
                                type="text"
                                id="phone_no"
                                value={contactInfo.phone_no}
                                onChange={(e) =>
                                    setContactInfo({
                                        ...contactInfo,
                                        phone_no: e.target.value,
                                    })
                                }
                                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="flex justify-end mt-4">
                            <Button
                                type="submit"

                            >
                                Update Contact
                            </Button>
                        </div>
                    </form>
                </Card>
            </Layout.Body>
        </Layout>
    );
}
